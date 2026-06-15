import "dotenv/config";

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { getPrisma } from "./db.js";

const DEFAULT_PORT = 4000;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

type JsonBody = Record<string, unknown>;

function sendJson(res: ServerResponse, statusCode: number, body: JsonBody): void {
  const payload = JSON.stringify(body);

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && requestUrl.pathname === "/") {
    sendJson(res, 200, {
      name: "AI Video Editor API",
      status: "running"
    });
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/health") {
    sendJson(res, 200, {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/health/db") {
    try {
      await getPrisma().$queryRaw`SELECT 1`;
      sendJson(res, 200, {
        status: "ok",
        database: "connected"
      });
    } catch (error) {
      sendJson(res, 503, {
        status: "error",
        database: "unavailable",
        message: error instanceof Error ? error.message : "Unknown database error"
      });
    }
    return;
  }

  sendJson(res, 404, {
    error: "Not found"
  });
}

const server = createServer((req, res) => {
  void handleRequest(req, res).catch((error) => {
    sendJson(res, 500, {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown server error"
    });
  });
});

server.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});