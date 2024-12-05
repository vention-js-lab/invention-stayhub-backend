import { EnvConfig } from '#/shared/configs/env.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeApiService {
  public readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {
    const apiKey = this.configService.get('STRIPE_PRIVATE_API_KEY', {
      infer: true,
    });

    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }
}
