import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Injectable } from '@nestjs/common';
import { PaymentRecord } from '../types/payment-record.type';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async savePaymentRecord({
    amount,
    status,
    transactionId,
    bookingId,
  }: PaymentRecord) {
    const existingPaymentRecord =
      await this.getPaymentRecordByBookingId(bookingId);

    const newPaymentRecord = this.paymentRepository.create({
      amount,
      transactionId,
      bookingId,
    });

    const paymentRecord = existingPaymentRecord
      ? existingPaymentRecord
      : newPaymentRecord;

    paymentRecord.status = status;
    await this.paymentRepository.save(paymentRecord);
  }

  async getPaymentRecordByBookingId(bookingId: string) {
    const paymentRecord = this.paymentRepository.findOneBy({ bookingId });

    return paymentRecord;
  }
}
