import { type PaymentStatus } from '#/shared/constants/payment-status.constant';
import { AllowedPaymentStatusTransitions } from '../constants/allowed-status-transitions.constant';

export function canTransitionStatus(currentStatus: PaymentStatus, newStatus: PaymentStatus) {
  const allowedTransitions = AllowedPaymentStatusTransitions[currentStatus];
  return allowedTransitions.includes(newStatus);
}
