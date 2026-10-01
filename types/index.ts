export type UserRole = "passenger" | "captain" | "admin" | "support";
export type Gender = "female" | "male" | "non_binary" | "prefer_not_to_say";
export type VerificationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "resubmission_required";
export type RideStatus =
  | "idle"
  | "searching_captain"
  | "captain_requested"
  | "captain_assigned"
  | "captain_navigating_pickup"
  | "captain_arrived"
  | "awaiting_pin"
  | "ride_started"
  | "ride_in_progress"
  | "ride_completed"
  | "payment_pending"
  | "payment_completed"
  | "rated"
  | "cancelled";
export type AvailabilityStatus = "offline" | "online" | "busy" | "available";
export type PaymentStatus = "pending" | "processing" | "successful" | "failed" | "refunded" | "cancelled";
export type NotificationType =
  | "ride_request"
  | "captain_accepted"
  | "captain_arriving"
  | "captain_arrived"
  | "ride_started"
  | "ride_completed"
  | "payment_success"
  | "payment_failed"
  | "safety_alert"
  | "verification_update"
  | "earnings_update"
  | "promotion";

export interface User {
  id: string;
  authId?: string;
  role: UserRole;
  phone: string;
  email?: string;
  name: string;
  photoUrl?: string;
  gender?: Gender;
  status: "active" | "blocked" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface PassengerProfile {
  id: string;
  userId: string;
  emergencyContacts: EmergencyContact[];
  savedPlaces: SavedPlace[];
  preferredPaymentMethod: "UPI" | "Card" | "Cash" | "Wallet";
  createdAt: string;
  updatedAt: string;
}

export interface CaptainProfile {
  id: string;
  userId: string;
  verificationStatus: VerificationStatus;
  rating: number;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  availabilityStatus: AvailabilityStatus;
  onlineStatus: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  lastLocationUpdate?: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  captainId: string;
  type: "Bike" | "Scooter" | "Auto";
  brand: string;
  model: string;
  registrationNumber: string;
  color: string;
  year: number;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  captainId: string;
  documentType: string;
  documentUrl?: string;
  status: VerificationStatus;
  expiryDate?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface SavedPlace {
  id: string;
  label: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface RideLocation {
  id: string;
  rideId: string;
  captainId?: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface Ride {
  id: string;
  passengerId: string;
  captainId?: string;
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string;
  destinationLat: number;
  destinationLng: number;
  destinationAddress: string;
  distanceKm: number;
  estimatedDurationMinutes: number;
  estimatedFare: number;
  finalFare?: number;
  captainEarnings?: number;
  status: RideStatus;
  ridePinHash?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: "passenger" | "captain" | "system";
  cancellationReason?: string;
}

export interface RideRequest {
  id: string;
  rideId: string;
  captainId: string;
  status: "pending" | "accepted" | "declined" | "expired";
  sentAt: string;
  respondedAt?: string;
  expiresAt: string;
  response?: string;
}

export interface Payment {
  id: string;
  rideId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: "razorpay" | "cash" | "wallet";
  providerOrderId?: string;
  providerPaymentId?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  captainId: string;
  balance: number;
  pendingBalance: number;
  withdrawableBalance: number;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  captainId: string;
  type: "ride_earning" | "bonus" | "adjustment" | "withdrawal" | "refund";
  amount: number;
  description: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  rideId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  tags?: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  rideId?: string;
  category: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "waiting_for_user" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyEvent {
  id: string;
  userId: string;
  rideId?: string;
  type: "sos" | "report" | "share_trip" | "safety_alert";
  location?: string;
  status: "active" | "resolved";
  createdAt: string;
}

export interface SessionInfo {
  userId: string;
  role: UserRole;
  token: string;
  expiresAt: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiSuccessResponse<T = Record<string, unknown>> = {
  success: true;
  data: T;
};

export type ApiResponse<T = Record<string, unknown>> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface RoutePlan {
  distanceKm: number;
  durationMinutes: number;
  polyline: string[];
  steps: Array<{ instruction: string; distanceKm: number; durationMinutes: number }>;
}
