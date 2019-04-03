import express from "express";
import http from "http";
import path from "path";
import WebSocket from "ws";
import {
  FromClientToServerActions,
  sendScripts,
  scriptStateChange,
  scriptStdOutNewChunk
} from "../shared/actions";
import { getProjectScripts, IScript } from "../core";
import { Unsubscribable } from "rxjs";

function emit<T>(ws: WebSocket, obj: T) {
  ws.send(JSON.stringify(obj));
}

function parseMessage(
  message: WebSocket.Data
): FromClientToServerActions | null {
  try {
    return JSON.parse(message.toString());
  } catch (ex) {
    return null;
  }
}

function getMessageHandler(ws: WebSocket, scripts: Record<string, IScript>) {
  return (message: WebSocket.Data) => {
    const action = parseMessage(message);
    if (!action) {
      return;
    }

    switch (action.type) {
      case "scripts/GET": {
        emit(ws, sendScripts(scripts));
        break;
      }

      case "scripts/RUN": {
        const name = action.payload;
        scripts[name].run();
        break;
      }

      case "scripts/KILL": {
        const name = action.payload;
        scripts[name].kill();
        break;
      }
    }
  };
}

function initScriptSubscriptions(
  scripts: Record<string, IScript>,
  ws: WebSocket
) {
  const unsubscribables: Unsubscribable[] = [];

  for (const script of Object.values(scripts)) {
    const { name } = script;
    unsubscribables.push(
      script.state.subscribe(state => {
        emit(ws, scriptStateChange({ name, state }));
      })
    );
    unsubscribables.push(
      script.stdout.subscribe(chunk => {
        emit(ws, scriptStdOutNewChunk({ name, chunk: chunk.toString() }));
      })
    );
  }

  return () => unsubscribables.forEach(x => x.unsubscribe());
}

const PORT = Number(process.env.PORT) || 8080;

function run() {
  const scripts = getProjectScripts();

  const app = express();

  app.use(express.static(path.resolve(__dirname, "../client")));
  app.use(express.static(path.resolve(__dirname, "../../public")));

  const server = http.createServer(app);

  const wss = new WebSocket.Server({ server });

  wss.on("connection", ws => {
    const unsubscribe = initScriptSubscriptions(scripts, ws);

    ws.on("message", getMessageHandler(ws, scripts));
    ws.on("close", unsubscribe);
    ws.on("error", unsubscribe);
  });

  server.listen(PORT, () => {
    console.log(`🌏 Server started on http://localhost:${PORT} 🙃`);
  });
}

run();
