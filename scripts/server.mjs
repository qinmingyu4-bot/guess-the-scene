#!/usr/bin/env node

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const port = Number.parseInt(process.env.PORT || "4173", 10);
const host = process.env.HOST || "127.0.0.1";

function dirname(path) {
  return path.slice(0, path.lastIndexOf("/"));
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store"
  });
  res.end(body);
}

function getFilePath(url) {
  const requestPath = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const cleanPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const absolute = resolve(join(root, cleanPath === "/" ? "index.html" : cleanPath.slice(1)));

  if (!absolute.startsWith(root)) {
    return null;
  }

  if (existsSync(absolute) && statSync(absolute).isDirectory()) {
    return join(absolute, "index.html");
  }

  return absolute;
}

const server = createServer((req, res) => {
  if (!req.url || !["GET", "HEAD"].includes(req.method || "")) {
    send(res, 405, "Method Not Allowed");
    return;
  }

  const filePath = getFilePath(req.url);
  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    send(res, 404, "Not Found");
    return;
  }

  res.writeHead(200, {
    "content-type": types[extname(filePath)] || "application/octet-stream",
    "cache-control": "no-store"
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Guess the Scene is running at http://${host}:${port}`);
});

