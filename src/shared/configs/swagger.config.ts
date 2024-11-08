import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('InVention Project')
  .setDescription('REST API')
  .setVersion('1.0.0')
  .addTag('NestJS, Postgres, TypeORM')
  .build();
