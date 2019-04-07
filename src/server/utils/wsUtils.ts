import WebSocket from "ws";

export function sendMessage<T>(ws: WebSocket, obj: T) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(obj));
  } else {
    console.warn(
      `WebSocket is not opened. Action ${JSON.stringify(obj)} was not sent`
    );
  }
}
