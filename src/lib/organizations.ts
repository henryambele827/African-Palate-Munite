import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  limit,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { Organization, BrandRequest, UserProfile } from '../types';
import { seedMeals } from './seedData';
import { OperationType, handleFirestoreError } from '../components/AuthProvider';

// --- Slug helpers ---

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60) || 'brand';
}

export async function isSlugTaken(slug: string): Promise<boolean> {
  const q = query(collection(db, 'organizations'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) return true;
  const q2 = query(collection(db, 'brandRequests'), where('slug', '==', slug), where('status', '==', 'pending'), limit(1));
  const snap2 = await getDocs(q2);
  return !snap2.empty;
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let counter = 2;
  while (await isSlugTaken(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}

// --- Brand requests (public application) ---
//
// The applicant sets their own admin password right here at registration
// time. We create their Firebase Auth account immediately (self-service,
// on the main auth instance — no admin trickery needed), then file a
// brandRequests doc referencing that uid. Their account exists from the
// start, but it has no special role until a superadmin approves the
// request, so it can't do anything as a brand_admin in the meantime.

export interface BrandRequestInput {
  brandName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  password: string;
  message?: string;
}

export async function submitBrandRequest(input: BrandRequestInput): Promise<string> {
  const email = input.applicantEmail.trim().toLowerCase();
  const slug = await generateUniqueSlug(input.brandName);

  // 1. Create the applicant's own Auth account with the password they chose.
  const cred = await createUserWithEmailAndPassword(auth, email, input.password);
  const uid = cred.user.uid;
  const now = new Date().toISOString();

  try {
    // 2. Write their profile as a plain 'customer' for now — approval is
    //    what promotes them to 'brand_admin'.
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      displayName: input.applicantName.trim(),
      phoneNumber: input.applicantPhone.trim(),
      role: 'customer',
      createdAt: now,
    } as UserProfile);

    // 3. File the brand request itself.
    const docRef = await addDoc(collection(db, 'brandRequests'), {
      applicantUid: uid,
      brandName: input.brandName.trim(),
      slug,
      applicantName: input.applicantName.trim(),
      applicantEmail: email,
      applicantPhone: input.applicantPhone.trim(),
      message: input.message?.trim() || '',
      status: 'pending',
      createdAt: now,
    });

    // 4. Sign them back out — they'll log in properly via Staff Login once
    //    approved, rather than wandering the site mid-registration.
    await firebaseSignOut(auth).catch(() => {});

    return docRef.id;
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'brandRequests');
    throw e;
  }
}

// --- Superadmin: listening to requests & brands ---

export function listenPendingRequests(cb: (requests: BrandRequest[]) => void) {
  const path = 'brandRequests';
  const q = query(
    collection(db, 'brandRequests'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as BrandRequest)));
  }, (error) => handleFirestoreError(error, OperationType.LIST, path));
}

export function listenAllBrands(cb: (brands: Organization[]) => void) {
  const path = 'organizations';
  const q = query(collection(db, 'organizations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Organization)));
  }, (error) => handleFirestoreError(error, OperationType.LIST, path));
}

// --- Brand resolution by slug (for public storefronts) ---

export async function getBrandBySlug(slug: string): Promise<Organization | null> {
  const path = 'organizations';
  try {
    const q = query(collection(db, 'organizations'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Organization;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, path);
    throw e;
  }
}

// --- Does this email have a request already, and what's its status? ---
// Used by the staff-login page to explain "still pending" / "rejected"
// instead of silently doing nothing.

export async function findRequestByApplicantUid(uid: string): Promise<BrandRequest | null> {
  const q = query(collection(db, 'brandRequests'), where('applicantUid', '==', uid), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as BrandRequest;
}

// --- Reject ---

export async function rejectBrandRequest(requestId: string, reviewerUid: string, reason?: string) {
  const path = `brandRequests/${requestId}`;
  try {
    await updateDoc(doc(db, 'brandRequests', requestId), {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerUid,
      rejectionReason: reason || '',
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.UPDATE, path);
    throw e;
  }
}

// --- Approve ---

export interface ApprovalResult {
  brandId: string;
  slug: string;
  loginEmail: string;
}

/**
 * Approves a pending brand request. The applicant's Auth account and
 * password already exist (created at registration time), so approval is
 * just: create the brand, promote their profile to brand_admin, seed the
 * menu, and mark the request approved.
 */
export async function approveBrandRequest(
  request: BrandRequest,
  reviewer: UserProfile
): Promise<ApprovalResult> {
  if (reviewer.role !== 'superadmin') {
    throw new Error('Only the superadmin can approve brand requests.');
  }

  const now = new Date().toISOString();
  const brandId = request.id;

  const orgPath = `organizations/${brandId}`;
  try {
    await setDoc(doc(db, 'organizations', brandId), {
      name: request.brandName,
      slug: request.slug,
      status: 'active',
      ownerUid: request.applicantUid,
      ownerEmail: request.applicantEmail,
      ownerName: request.applicantName,
      contactPhone: request.applicantPhone,
      createdAt: now,
      approvedAt: now,
      approvedBy: reviewer.uid,
    } as Omit<Organization, 'id'>);
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, orgPath);
    throw e;
  }

  const userPath = `users/${request.applicantUid}`;
  try {
    await updateDoc(doc(db, 'users', request.applicantUid), {
      role: 'brand_admin',
      brandId,
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.UPDATE, userPath);
    throw e;
  }

  // Seed the brand's menu (orders subcollection stays empty).
  await seedMeals(brandId);

  const reqPath = `brandRequests/${request.id}`;
  try {
    await updateDoc(doc(db, 'brandRequests', request.id), {
      status: 'approved',
      reviewedAt: now,
      reviewedBy: reviewer.uid,
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.UPDATE, reqPath);
    throw e;
  }

  return { brandId, slug: request.slug, loginEmail: request.applicantEmail };
}
