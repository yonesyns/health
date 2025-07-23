import { createClient } from 'redis';
import { config } from './server';
import logger from '../utils/logger';
// Si linter: installer les types Node.js avec: npm i --save-dev @types/node

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err: any) => {
  logger.error('❌ Redis Client Error:', err);
  console.error('❌ Redis Client Error:', err);
});

export default redisClient; 