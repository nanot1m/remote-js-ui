import express from "express";
import http from "http";
import path from "path";
import WebSocket from "ws";
import { filter, map } from "rxjs/operators";
import { getProjectScripts } from "core";
import { FromClientToServerActions } from "shared/actions/FromClientToServerActions";
import { parseMessage } from "shared/utils/wsUtils";
import { config } from "./config";
import { sendMessage } from "./utils/wsUtils";
import { fromWebSocket } from "./utils/fromWebSocket";
import { isClientToServerAction } from "./utils/isClientToServerAction";
import { handleClientAction } from "server/handleClientAction";
import { getScriptsActions } from "server/getScriptsActions";

function start() {
  const scripts = getProjectScripts();

  const app = express();

  app.use(express.static(path.resolve(__dirname, "../client")));

  const server = http.createServer(app);

  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on("connection", ws => {
    const subscription = getScriptsActions(scripts).subscribe(action => {
      sendMessage(ws, action);
    });

    fromWebSocket(ws)
      .pipe(
        map(data => parseMessage<FromClientToServerActions>(data)),
        filter(isClientToServerAction)
      )
      .subscribe(
        handleClientAction(scripts, ws),
        error => {
          console.error(error);
          subscription.unsubscribe();
        },
        () => {
          subscription.unsubscribe();
        }
      );
  });

  server.listen(config.port, () => {
    console.log(`🌏 Server started on http://localhost:${config.port} 🙃`);
  });
}

start();
