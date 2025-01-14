import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    connectTimeout: 10000, // 10 seconds
});
