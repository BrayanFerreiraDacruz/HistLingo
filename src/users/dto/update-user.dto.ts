import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  xpTotal?: number;
  level?: number;
  streakCount?: number;
  recoveryFreezeCount?: number;
}
