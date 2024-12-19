import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

interface SendMailOptions {
  to: string;
  subject: string;
  userName?: string;
  accommodationName?: string;
  bookingDates?: string;
  totalCost?: string;
}

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(resend: Resend) {
    this.resend = resend;
  }

  async sendMail({
    to,
    subject,
    userName = 'User',
    accommodationName = 'Your Accommodation',
    bookingDates = 'N/A',
    totalCost = 'N/A',
  }: SendMailOptions): Promise<void> {
    try {
      const htmlContent = this.generateHtmlContent(userName, accommodationName, bookingDates, totalCost);

      await this.resend.emails.send({
        from: 'noreply@stayhub.uz',
        to,
        subject,
        html: htmlContent,
      });
    } catch (error) {
      this.handleError(error, to);
    }
  }

  private generateHtmlContent(
    userName: string,
    accommodationName: string,
    bookingDates: string,
    totalCost: string = 'N/A',
  ): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
    <h1 style="color: #4CAF50; text-align: center;">Booking Confirmation</h1>
    <p style="font-size: 16px; color: #555; text-align: center;">
      Dear <strong>${userName}</strong>,
    </p>
    <p style="font-size: 16px; color: #333;">
      Your booking for <strong style="color: #4CAF50;">${accommodationName}</strong> has been confirmed!
    </p>
    <p style="font-size: 16px; color: #333;">
      <strong>Booking Dates:</strong> ${bookingDates}
    </p>
    <p style="font-size: 16px; color: #333;">
      <strong>Total Cost:</strong> ${totalCost}
    </p>
    <p style="font-size: 14px; color: #888; text-align: center;">
      Thank you for choosing us! We look forward to serving you.
    </p>
    <hr style="border: none; border-top: 1px solid #e0e0e0;" />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      This is an automated email. Please do not reply.
    </p>
  </div>
    `;
  }

  private handleError(error: unknown, recipient: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);

    this.logger.error(`Failed to send email to ${recipient}: ${errorMessage}`);
    throw new InternalServerErrorException(`Failed to send email: ${errorMessage}`);
  }
}
