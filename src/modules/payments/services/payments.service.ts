import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentRecord } from '../types/payment-record.type';
import { canTransitionStatus } from '../utils/payments.util';

@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(Payment) private paymentRepository: Repository<Payment>) {}

  async savePayment({ amount, status, transactionId, bookingId }: PaymentRecord) {
    const existingPayment = await this.getPaymentByBookingId(bookingId);

    const newPayment = this.paymentRepository.create({
      amount,
      transactionId,
      bookingId,
    });

    const payment = existingPayment ?? newPayment;

    if (existingPayment && !canTransitionStatus(existingPayment.status, status)) {
      throw new BadRequestException('Invalid status transition');
    }

    payment.status = status;

    await this.paymentRepository.save(payment);
  }

  async getPaymentByBookingId(bookingId: string) {
    const payment = await this.paymentRepository.findOneBy({ bookingId });

    return payment;
  }
}
