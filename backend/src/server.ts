import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

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

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
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

  sendJson(res, 404, {
    error: "Not found"
  });
}

const server = createServer(handleRequest);

server.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});