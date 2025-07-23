import redisClient from '../../../config/redis';
import { UserResponseDto } from '../dto/user.dto';
import logger from '../../../utils/logger';

export class UserCache {
  private readonly USER_KEY_PREFIX = 'user:';
  private readonly USER_LIST_KEY_PREFIX = 'users:';
  private readonly TTL = 3600; // 1 hour in seconds

  private getUserKey(id: string): string {
    return `${this.USER_KEY_PREFIX}${id}`;
  }

  private getUserListKey(query: string): string {
    return `${this.USER_LIST_KEY_PREFIX}${query}`;
  }

  async getUser(id: string): Promise<UserResponseDto | null> {
    try {
      const cached = await redisClient.get(this.getUserKey(id));
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      logger.error('Error in getUser:', error);
      throw error;
    }
  }

  async setUser(id: string, user: UserResponseDto): Promise<void> {
    try {
      await redisClient.connect(); // S'assure que la connexion est active
      await redisClient.set(
        this.getUserKey(id),
        JSON.stringify(user),
        { EX: 60 * 60 * 24 } // CORRECT: 24 heures via objet d'options
      );
    } catch (error) {
      logger.error('Error in setUser:', error);
      throw error;
    }
  }

  async getUserList(query: string): Promise<any | null> {
    try {
      const cached = await redisClient.get(this.getUserListKey(query));
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      logger.error('Error getting user list from cache:', error);
      return null;
    }
  }

  async setUserList(query: string, data: any): Promise<void> {
    try {
      await redisClient.set(
        this.getUserListKey(query),
        JSON.stringify(data),
        { EX: this.TTL } // ✅ CORRECT : Utiliser options pour le TTL
      );
    } catch (error) {
      logger.error('Error setting user list in cache:', error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await redisClient.del(this.getUserKey(id));
      // Also clear user list caches
      await this.clearUserListCaches();
    } catch (error) {
      logger.error('Error deleting user from cache:', error);
    }
  }

  async clearUserCaches(id?: string): Promise<void> {
    try {
      if (id) {
        await redisClient.del(this.getUserKey(id));
      }
      await this.clearUserListCaches();
    } catch (error) {
      logger.error('Error clearing user caches:', error);
    }
  }

  private async clearUserListCaches(): Promise<void> {
    try {
      // Get all user list keys and delete them
      const keys = await redisClient.keys(`${this.USER_LIST_KEY_PREFIX}*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      logger.error('Error clearing user list caches:', error);
    }
  }
}
