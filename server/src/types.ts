import { Request, Response } from "express";
import { Redis } from "ioredis";

declare global {
  namespace Express {
    interface Session {
      userId: number;
    }
  }
}

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
};
