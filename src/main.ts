import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationConfig } from './shared/configs/validation.config';
import { swaggerConfig } from './shared/configs/swagger.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.APP_PORT || 3030;

    app.useGlobalPipes(ValidationConfig);
    app.use(cookieParser());

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(PORT, () => {
      console.log(`Server has started on ${PORT}-port!`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
