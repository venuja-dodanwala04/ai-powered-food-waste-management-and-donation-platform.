export type UserRole = 'BUSINESS' | 'CHARITY';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  businessType?: 'Restaurant' | 'Hotel' | 'Supermarket' | 'Bakery' | 'Catering';
  charityType?: string;
  branch?: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  createdAt: string;
}

export type FoodCategory =
  | 'Meat'
  | 'Vegetables'
  | 'Fruits'
  | 'Dairy'
  | 'Rice & Grains'
  | 'Bakery'
  | 'Prepared Food'
  | 'Seafood'
  | 'Beverages'
  | 'Other';

export type StorageLocation =
  | 'Dry Storage'
  | 'Refrigerator'
  | 'Freezer'
  | 'Prepared Food Area';

export type ExpiryStatus =
  | 'Fresh'
  | 'Low Stock'
  | 'Expiring Soon'
  | 'Critical Expiry'
  | 'Expired';

export interface FoodItem {
  id: string;
  userId: string;
  foodName: string;
  category: FoodCategory;
  quantity: number;
  unit: 'kg' | 'units' | 'liters' | 'packs';
  purchaseDate: string;
  expiryDate: string;
  expiryHoursLeft?: number;
  storageLocation: StorageLocation;
  status: ExpiryStatus;
  unitCost: number; // in LKR
  imageUrl?: string;
}

export interface SalesEntry {
  id: string;
  foodItemId: string;
  foodName: string;
  date: string;
  quantityPrepared: number;
  quantitySold: number;
  wasteQuantity: number;
  unit: string;
  status: 'Logged' | 'Donated' | 'Wasted' | 'Sold Out';
}

export interface Prediction {
  id: string;
  foodItemId: string;
  foodName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedPreparation: number;
  recommendedPurchase: number;
  expiryRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Approved' | 'Stock Out' | 'Low Stock' | 'Overstocked';
  unit: string;
  generatedAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorAddress: string;
  donorPhone: string;
  foodItemName: string;
  category: FoodCategory | string;
  quantity: number;
  unit: string;
  pickupAddress: string;
  pickupTime: string;
  pickupDate: string;
  expiryTime: string;
  distanceKm?: number;
  status: 'Available' | 'Reserved' | 'Collected' | 'Expired' | 'Cancelled';
  createdAt: string;
  isPrepared?: boolean;
}

export interface DonationRequest {
  id: string;
  donationId: string;
  charityId: string;
  charityName: string;
  requestedFood: string;
  requestedQuantity: number;
  unit: string;
  pickupTime: string;
  distanceKm: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Collected';
  createdAt: string;
  notes?: string;
  donorName?: string;
  pickupAddress?: string;
}

export type WasteReason =
  | 'Spoilage / Expired'
  | 'Overproduction'
  | 'Preparation Waste'
  | 'Quality Issue'
  | 'Storage Failure'
  | 'Damaged Product'
  | 'Other';

export interface WasteEntry {
  id: string;
  userId: string;
  foodItemId: string;
  foodName: string;
  quantity: number;
  unit: string;
  reason: WasteReason;
  financialLoss: number; // in LKR
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'EXPIRY' | 'FORECAST' | 'DONATION_REQUEST' | 'SYSTEM';
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface WasteAnalytics {
  id: string;
  userId: string;
  month: string;
  wastedItems: number;
  donatedItems: number;
  moneySaved: number; // LKR
  co2Saved: number; // kg
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: string;
  instructions: string[];
  imageUrl: string;
}

export interface RecipeIngredient {
  recipeId: string;
  foodId: string;
}
