import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationConfig } from './shared/configs/validation.config';
import { SwaggerConfig } from './shared/configs/swagger.config';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './shared/configs/env.config';
import { getCorsValues } from './shared/utils/cors.util';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService<EnvConfig>);

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });

  const { isCorsEnabled, corsOrigins, corsMethods } =
    getCorsValues(configService);

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
    console.log(`Server has started on ${port}-port!`);
  });
}

bootstrap();
