import { PaymentStatus } from '#/shared/constants/payment-status.constant';

export const AllowedPaymentStatusTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  [PaymentStatus.Pending]: [PaymentStatus.Canceled, PaymentStatus.Declined, PaymentStatus.Success],
  [PaymentStatus.Canceled]: [PaymentStatus.Declined, PaymentStatus.Success],
  [PaymentStatus.Declined]: [PaymentStatus.Success, PaymentStatus.Canceled],
  [PaymentStatus.Success]: [],
};
