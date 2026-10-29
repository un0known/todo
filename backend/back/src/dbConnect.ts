import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Injectable()
export class DbConnect {
  private readonly logger = new Logger(DbConnect.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async check(): Promise<void> {
    try {
      if (!this.connection.db) {
        throw new Error('MongoDB connection is not ready');
      }

      await this.connection.db.admin().ping();
      this.logger.log('MongoDB connection check passed');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`MongoDB connection check failed: ${message}`);
      throw error;
    }
  }
}
