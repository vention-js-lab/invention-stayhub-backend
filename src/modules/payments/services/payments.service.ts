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

  async createPaymentRecord({
    amount,
    status,
    transactionId,
    bookingId,
  }: PaymentRecord) {
    const newPaymentRecord = this.paymentRepository.create({
      amount,
      status,
      transactionId,
      bookingId,
    });

    await this.paymentRepository.save(newPaymentRecord);
  }
}
