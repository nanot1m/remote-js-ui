import WebSocket from "ws";

export function sendMessage<T>(ws: WebSocket, obj: T) {
  ws.send(JSON.stringify(obj));
}
