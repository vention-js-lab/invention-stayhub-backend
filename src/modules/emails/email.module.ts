import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { Resend } from 'resend';

@Module({
  providers: [
    {
      provide: Resend,
      useFactory: () => {
        return new Resend(process.env.RESEND_API_KEY);
      },
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
