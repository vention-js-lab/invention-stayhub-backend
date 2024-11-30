import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationConfig } from './shared/configs/validation.config';
import { SwaggerConfig } from './shared/configs/swagger.config';
import { ConfigService } from '@nestjs/config';
import { type EnvConfig } from './shared/configs/env.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvConfig>);

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });

  const isCorsEnabled = configService.get<boolean>('CORS_ENABLED');
  const corsOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS')?.split(',');
  const corsMethods = configService.get<string>('CORS_ALLOWED_METHODS')?.split(',');

  if (isCorsEnabled) {
    app.enableCors({
      origin: corsOrigins,
      methods: corsMethods,
    });
  }

  app.useGlobalPipes(ValidationConfig);
  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(port, () => {
    Logger.log(`Server is running in ${configService.get('APP_ENV')} mode on http://localhost:${port}`);
  });
}

void bootstrap();
