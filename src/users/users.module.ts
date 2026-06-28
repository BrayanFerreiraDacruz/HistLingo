import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GamificationModule } from '../gamification/gamification.module';
import { SrsModule } from '../srs/srs.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [GamificationModule, SrsModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
