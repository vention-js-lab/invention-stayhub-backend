import { Test, type TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../services/payments.service';
import { Payment } from '../entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';

interface MockPaymentRepository {
  findOneBy: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
}

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let paymentRepository: MockPaymentRepository;

  const mockPayment = {
    id: 'payment-id',
    amount: 1000,
    status: PaymentStatus.Pending,
    transactionId: 'txn-123',
    bookingId: 'booking-id',
  } as Payment;

  const canTransitionStatus = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
    paymentRepository = module.get(getRepositoryToken(Payment));
  });

  describe('getPaymentByBookingId', () => {
    it('should return a payment by booking ID', async () => {
      paymentRepository.findOneBy.mockResolvedValue(mockPayment);

      const result = await paymentsService.getPaymentByBookingId('booking-id');

      expect(result).toEqual(mockPayment);
      expect(paymentRepository.findOneBy).toHaveBeenCalledWith({ bookingId: 'booking-id' });
    });

    it('should return null if no payment is found', async () => {
      paymentRepository.findOneBy.mockResolvedValue(null);

      const result = await paymentsService.getPaymentByBookingId('non-existent-booking-id');

      expect(result).toBeNull();
      expect(paymentRepository.findOneBy).toHaveBeenCalledWith({ bookingId: 'non-existent-booking-id' });
    });
  });

  describe('savePayment', () => {
    it('creates and saves a new payment if none exists', async () => {
      paymentRepository.findOneBy.mockResolvedValue(null);
      paymentRepository.create.mockReturnValue(mockPayment);
      paymentRepository.save.mockResolvedValue(mockPayment);

      await paymentsService.savePayment({
        amount: 1000,
        status: PaymentStatus.Pending,
        transactionId: 'txn-123',
        bookingId: 'booking-id',
      });

      expect(paymentRepository.findOneBy).toHaveBeenCalledWith({ bookingId: 'booking-id' });
      expect(paymentRepository.create).toHaveBeenCalledWith({
        amount: 1000,
        transactionId: 'txn-123',
        bookingId: 'booking-id',
      });
      expect(paymentRepository.save).toHaveBeenCalledWith(mockPayment);
    });

    it('updates payment if it exists and status transition is valid', async () => {
      const updatedPayment = { ...mockPayment, status: PaymentStatus.Success };
      paymentRepository.findOneBy.mockResolvedValue(mockPayment);
      paymentRepository.save.mockResolvedValue(updatedPayment);

      canTransitionStatus.mockReturnValue(true);

      await paymentsService.savePayment({
        amount: 1000,
        status: PaymentStatus.Success,
        transactionId: 'txn-123',
        bookingId: 'booking-id',
      });

      expect(paymentRepository.findOneBy).toHaveBeenCalledWith({ bookingId: 'booking-id' });
      expect(paymentRepository.save).toHaveBeenCalledWith({ ...mockPayment, status: PaymentStatus.Success });
    });

    it('throws an error if status transition is invalid', async () => {
      paymentRepository.findOneBy.mockResolvedValue(mockPayment);
      canTransitionStatus.mockReturnValue(false);

      await expect(
        paymentsService.savePayment({
          amount: 1000,
          status: PaymentStatus.Declined,
          transactionId: 'txn-123',
          bookingId: 'booking-id',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(paymentRepository.findOneBy).toHaveBeenCalledWith({ bookingId: 'booking-id' });
      expect(paymentRepository.save).not.toHaveBeenCalled();
    });
  });
});
