export type UserRole = 'customer' | 'brand_admin' | 'superadmin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  brandId?: string; // present for brand_admin and customer once they've ordered from a brand
  createdAt: string;
}

export type MealCategory = 'Main Dish' | 'Quick Bite' | 'Daily Special' | 'Traditional';

export type CountryCategory = 'Uganda' | 'Somalia' | 'Eritrea' | 'DR Congo' | 'Nigeria' | 'Sudan';

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MealCategory;
  country: CountryCategory;
  imageUrl?: string;
  isAvailable: boolean;
  meatOptions?: string[];
  accompanimentOptions?: string[];
  options?: string[]; // Generic options
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  mealId: string;
  mealName: string;
  selectedMeat?: string;
  selectedAccompaniment?: string;
  selectedOption?: string; // Generic option
  quantity: number;
  totalPrice: number;
  paidAmount: number;
  status: OrderStatus;
  deliveryDate: string;
  deliveryLocation: string;
  createdAt: string;
}

// --- Platform / multi-tenant types ---

export type BrandStatus = 'active' | 'suspended';

export interface Organization {
  id: string;           // brandId
  name: string;
  slug: string;          // URL-safe, unique, used in /b/:slug
  status: BrandStatus;
  ownerUid: string;
  ownerEmail: string;
  ownerName: string;
  contactPhone?: string;
  logoUrl?: string;
  createdAt: string;
  approvedAt: string;
  approvedBy: string;    // superadmin uid
}

export type BrandRequestStatus = 'pending' | 'approved' | 'rejected';

export interface BrandRequest {
  id: string;
  applicantUid: string; // the Firebase Auth account the applicant created at registration time
  brandName: string;
  slug: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  message?: string;
  status: BrandRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}
