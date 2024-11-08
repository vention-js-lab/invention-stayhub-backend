import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './register.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
