import WebSocket from "ws";
import { Observable } from "rxjs";

export function fromWebSocket(ws: WebSocket) {
  return new Observable<WebSocket.Data>(observer => {
    function dataHandler(data: WebSocket.Data) {
      observer.next(data);
    }

    function errorHandler(err: Error) {
      observer.error(err);
    }

    function endHandler() {
      observer.complete();
    }

    ws.addListener("message", dataHandler);
    ws.addListener("close", errorHandler);
    ws.addListener("error", endHandler);

    return () => {
      ws.removeListener("message", dataHandler);
      ws.removeListener("close", errorHandler);
      ws.removeListener("error", endHandler);
    };
  });
}
