import { createErrorResponse, createSuccessResponse } from "@/lib/config";
import type { ApiResponse, Payment, PaymentStatus } from "@/types";

const payments: Payment[] = [];

export async function createPaymentOrder(amount: number): Promise<ApiResponse<{ amount: number; currency: string; orderId: string; provider: string }>> {
  if (amount <= 0) {
    return createErrorResponse("INVALID_AMOUNT", "Payment amount must be greater than zero.");
  }

  return createSuccessResponse({
    amount,
    currency: "INR",
    orderId: `order_${Date.now()}`,
    provider: "razorpay",
  });
}

export async function verifyPayment(orderId: string, paymentId: string): Promise<ApiResponse<{ payment: Payment }>> {
  const payment: Payment = {
    id: `payment_${Date.now()}`,
    rideId: `ride_${Date.now()}`,
    userId: "user_passenger_priya",
    amount: 82,
    currency: "INR",
    provider: "razorpay",
    providerOrderId: orderId,
    providerPaymentId: paymentId,
    status: "successful",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  payments.push(payment);

  return createSuccessResponse({ payment });
}

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<ApiResponse<{ payment: Payment | undefined }>> {
  const payment = payments.find((entry) => entry.id === paymentId);

  if (!payment) {
    return createErrorResponse("PAYMENT_NOT_FOUND", "Payment not found.");
  }

  payment.status = status;
  payment.updatedAt = new Date().toISOString();

  return createSuccessResponse({ payment });
}
