/**
 * @format
 * Auth module
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AccessTokenStrategy } from 'src/modules/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/modules/auth/strategies/refreshToken.strategy';
import { UsersModule } from 'src/modules/users/users.module';
import { RedisModule } from 'src/modules/redis';
import { UserDeviceModule } from 'src/modules/user-devices';

@Module({
  imports: [JwtModule.register({}), RedisModule, UsersModule, UserDeviceModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
