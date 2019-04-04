import WebSocket from "ws";

export function sendMessage<T>(ws: WebSocket, obj: T) {
  ws.send(JSON.stringify(obj));
}

export function parseMessage<T>(message: WebSocket.Data): T | null {
  try {
    return JSON.parse(message.toString());
  } catch (ex) {
    return null;
  }
}
