import { Request, Response } from "express";
import { Redis } from "ioredis";

type MySession = Express.Session &
  Partial<{
    userId: number;
  }>;

export type MyRequest = Request & { session?: MySession };

export type MyContext = {
  req: MyRequest;
  res: Response;
  redis: Redis;
};
