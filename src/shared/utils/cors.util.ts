import { ConfigService } from '@nestjs/config';

export function getCorsValues(configService: ConfigService) {
  const isCorsEnabled = configService.get<boolean>('CORS_ENABLED');
  const corsOrigins = configService
    .get<string>('CORS_ALLOWED_ORIGINS')
    .split(',');
  const corsMethods = configService
    .get<string>('CORS_ALLOWED_METHODS')
    .split(',');

  return { isCorsEnabled, corsOrigins, corsMethods };
}
