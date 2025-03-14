import { WebSocketServer } from "ws";
import WebSocket from "ws";

import jwt, { JwtPayload } from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  ws.on("error", () => {
    console.log("Error while connection");
  });

  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const decoded = jwt.verify(token, JWT_SECRET!!);

  if (!decoded || (decoded as JwtPayload).userId) {
    ws.close();
    return;
  }
  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });

    ws.send("Hello from the websocket server");
  });
});
