import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationConfig } from './shared/configs/validation.config';
import { swaggerConfig } from './shared/configs/swagger.config';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './shared/configs/env.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<EnvConfig>);

    const port = configService.getOrThrow('APP_PORT', {
      infer: true,
    });

    app.useGlobalPipes(ValidationConfig);
    app.use(cookieParser());

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(port, () => {
      console.log(`Server has started on ${port}-port!`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
