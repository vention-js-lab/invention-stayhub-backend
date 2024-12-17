import { Test, type TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailService } from '../email.service';

jest.mock('resend');

describe('EmailService', () => {
  let emailService: EmailService;
  let resendMock: jest.Mocked<Resend>;

  beforeEach(async () => {
    resendMock = {
      emails: { send: jest.fn() },
    } as unknown as jest.Mocked<Resend>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, { provide: Resend, useValue: resendMock }],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should send an email successfully', async () => {
    (resendMock.emails.send as jest.Mock).mockResolvedValueOnce({ id: 'test-email-id' });

    const emailData = {
      to: 'user@example.com',
      subject: 'Booking Confirmation',
      userName: 'John Doe',
      accommodationName: 'Seaside Apartment',
      bookingDates: 'June 1, 2024 to June 10, 2024',
      totalCost: '$1000',
    };

    await expect(emailService.sendMail(emailData)).resolves.not.toThrow();

    expect(resendMock.emails.send).toHaveBeenCalledWith({
      from: 'noreply@stayhub.uz',
      to: emailData.to,
      subject: emailData.subject,
      html: expect.stringContaining('John Doe'),
    });
  });

  it('should throw InternalServerErrorException on failure', async () => {
    (resendMock.emails.send as jest.Mock).mockRejectedValueOnce(new Error('Email send failed'));

    const emailData = {
      to: 'user@example.com',
      subject: 'Booking Confirmation',
      userName: 'John Doe',
      accommodationName: 'Seaside Apartment',
      bookingDates: 'June 1, 2024 to June 10, 2024',
      totalCost: '$1000',
    };

    await expect(emailService.sendMail(emailData)).rejects.toThrow(InternalServerErrorException);

    expect(resendMock.emails.send).toHaveBeenCalledTimes(1);
  });
});
