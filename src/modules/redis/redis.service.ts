/**
 *  @format
 * Redis service
 */

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;
  redisHost = process.env.REDIS_HOST;
  redisPort = Number(process.env.REDIS_PORT);
  redisPassword = process.env.REDIS_PASSWORD;

  constructor() {
    this.redisClient = new Redis({
      host: this.redisHost,
      port: this.redisPort,
      password: this.redisPassword,
    });
    this.redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  async addToBlacklist(token: string) {
    return await this.redisClient.set(token, token);
  }

  async isTokenRevoked(token: string) {
    const result = await this.redisClient.get(token);
    return result;
  }
}
