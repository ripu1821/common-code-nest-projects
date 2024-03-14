/**
 * @format
 * Access Token Strategy
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { RedisService } from 'src/modules/redis/redis.service';

type JwtPayload = {
  _id: string;
  device: string;
  exp: number;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  private token: string;
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromRequest: (req: Request) => {
        const headerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (headerToken) {
          this.token = headerToken;
          return headerToken;
        }
      },
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const tokenRevoke = await this.redisService.isTokenRevoked(this.token);
    if (tokenRevoke) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
