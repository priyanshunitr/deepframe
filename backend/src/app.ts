import "dotenv/config";

import express from "express";
import type { NextFunction, Request, Response } from "express";

import { ApiError } from "./utils/ApiError.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  res.status(statusCode).json({
    statusCode,
    data: err instanceof ApiError ? err.data : null,
    message: err.message || "Internal Server Error",
    success: false,
    errors: err instanceof ApiError ? err.errors : []
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

export { app };