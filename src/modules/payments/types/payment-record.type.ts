import { PaymentStatus } from '#/shared/constants/payment-status.constant';

export interface PaymentRecord {
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  bookingId: string;
}
