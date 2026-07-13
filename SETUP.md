# Setup & Testing Guide — Multi-Tenant Rebuild

## What changed since the single-tenant version

- **Roles**: `customer`, `brand_admin`, `superadmin` (was `student` / `admin`)
- **Data**: `meals` and `orders` now live under `organizations/{brandId}/meals` and `organizations/{brandId}/orders` instead of flat top-level collections
- **New collections**: `organizations` (approved brands), `brandRequests` (pending applications)
- **New routes**: `/`, `/register-brand`, `/staff-login`, `/superadmin`, and everything customer-facing moved under `/b/:slug/...`

## 1. Before you deploy

**Set your own superadmin email.** I used an obvious placeholder — find and replace `YOUR_SUPERADMIN_EMAIL@example.com` with your real email in exactly two files:
- `src/components/AuthProvider.tsx` (the `SUPERADMIN_EMAILS` array)
- `firestore.rules` (three occurrences)

This is the email that gets auto-promoted to `superadmin` the first time it signs in via Google.

## 2. Deploy rules and indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

The indexes file (`firestore.indexes.json`) covers the two composite queries the new pages need (pending brand requests sorted by date, and a customer's orders within a brand sorted by date). Without deploying these, those two screens will show a Firestore error in the console with a direct link to create the missing index — that link also works if you'd rather create them by hand.

## 3. How registration → approval actually works now

1. A restaurant owner fills out `/register-brand`: brand name, their name/phone/email, **and a password they choose right there**.
2. On submit, we create their Firebase Auth account immediately (with that password) and file a `brandRequests` doc tied to their new account. They're signed back out right after, and see a "request received" screen.
3. You review pending requests at `/superadmin`. Approve creates the `organizations/{brandId}` doc, promotes their account to `brand_admin`, and seeds the shared meal catalog into their brand. Reject just marks it rejected (their Auth account still exists but never gets elevated — if they apply again with the same email it'll fail with "email already in use," which is a known limitation without a Cloud Functions backend to clean that up).
4. They log in at `/staff-login` with the email + password they set. If not yet approved, they see a clear "still under review" screen; if rejected, they see why (if you gave a reason) and a link to re-apply.
5. Once approved, they land on `/b/{slug}/admin` — the same dashboard as before, just scoped to their brand.

## 4. Testing locally

```bash
npm install
npm run dev
```

Suggested test pass:
1. Sign in with your superadmin email via Google on `/` → you should see the "Superadmin" pill in the nav.
2. Submit a test application at `/register-brand` using a *different* email.
3. Approve it from `/superadmin`.
4. Open an incognito window, go to `/staff-login`, sign in with the email/password from step 2 → should land on `/b/{slug}/admin` with a full seeded menu.
5. From a third, signed-out window, visit `/b/{slug}` and place a test order as a customer (Google sign-in).
6. Confirm the order shows up in the brand admin's dashboard, and *not* in any other brand's.

## 5. Migrating your existing Cavendish data (optional, one-time)

Your original flat `meals` / `orders` collections aren't touched by any of this. Once you've created "The African Palate" as brand #1 through the normal flow above, run this once from the browser console while signed in as superadmin:

```js
import { migrateLegacyDataToBrand } from './lib/migrateLegacyData';
await migrateLegacyDataToBrand('YOUR_NEW_BRAND_ID');
```

Verify the copied data looks right, then delete the old `meals` and `orders` collections from the Firebase console.

## 6. Known limitations (fine for a v1, worth knowing about)

- No transactional email yet — approvals/rejections aren't emailed automatically; you'd relay that manually or add an email extension later.
- A rejected applicant's Auth account isn't deleted (requires Cloud Functions / Admin SDK), so a same-email re-application will collide.
- All brands share one fixed set of meal categories/countries (matches the original app); brands can't yet define fully custom categories.
