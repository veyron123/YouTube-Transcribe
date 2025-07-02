import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Инициализируем Redis-клиент из переменных окружения
const redis = Redis.fromEnv();

// Ограничитель для анонимных пользователей (по IP)
// 10 запросов в течение 10 минут
export const anonymousRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  prefix: "@upstash/ratelimit-anonymous",
});

// Ограничитель для авторизованных пользователей (по user ID)
// 50 запросов в час
export const authenticatedRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"),
  prefix: "@upstash/ratelimit-authenticated",
});