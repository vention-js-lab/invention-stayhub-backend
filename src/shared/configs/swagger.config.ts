import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('StayHub API by InVention')
  .setDescription(
    'A modern accommodation booking platform API developed by InVention, enabling users to register, authenticate, list properties, book stays, and manage reservations. Built with NestJS and TypeORM.',
  )
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
