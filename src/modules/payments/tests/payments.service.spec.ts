import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentsService } from '../services/payments.service';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockPaymentRepository: Partial<
    Record<keyof Repository<Payment>, jest.Mock>
  >;

  beforeEach(async () => {
    mockPaymentRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('creates and saves a payment record', async () => {
    const paymentRecord = {
      amount: 100,
      status: PaymentStatus.Success,
      transactionId: 'test-transaction-id',
      bookingId: 'test-booking-id',
    };

    const mockCreatedPayment = { ...paymentRecord };

    (mockPaymentRepository.create as jest.Mock).mockReturnValue(
      mockCreatedPayment,
    );
    (mockPaymentRepository.save as jest.Mock).mockResolvedValue(
      mockCreatedPayment,
    );

    await service.createPaymentRecord(paymentRecord);

    expect(mockPaymentRepository.create).toHaveBeenCalledWith(paymentRecord);
    expect(mockPaymentRepository.save).toHaveBeenCalledWith(mockCreatedPayment);
  });
});
