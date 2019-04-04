import express from "express";
import http from "http";
import path from "path";
import WebSocket from "ws";
import { merge } from "rxjs";
import { map } from "rxjs/operators";

import { getProjectScripts, IProjectScripts } from "../core";

import { FromClientToServerActions } from "../shared/actions/FromClientToServerActions";
import {
  sendScripts,
  scriptStateChange,
  scriptStdOutNewChunk as scriptStdoutNewChunk,
  npmInstalState,
  npmInstallStdoutChunk
} from "../shared/actions/serverActions";

import { config } from "./config";
import { parseMessage, sendMessage } from "./utils/wsUtils";

function getMessageHandler(ws: WebSocket, scripts: IProjectScripts) {
  return (message: WebSocket.Data) => {
    const action = parseMessage<FromClientToServerActions>(message);
    if (!action) {
      return;
    }

    switch (action.type) {
      case "scripts/GET": {
        sendMessage(ws, sendScripts(scripts));
        break;
      }

      case "scripts/RUN": {
        const name = action.payload;
        scripts.npmScripts[name].run();
        break;
      }

      case "scripts/KILL": {
        const name = action.payload;
        scripts.npmScripts[name].kill();
        break;
      }

      case "scripts/RUN_NPM_INSTALL": {
        scripts.npmInstall.run();
        break;
      }
    }
  };
}

function initScriptSubscriptions(scripts: IProjectScripts, ws: WebSocket) {
  const stateSubscription = merge(
    ...Object.entries(scripts.npmScripts).map(([name, script]) =>
      script.state.pipe(map(state => ({ name, state })))
    )
  ).subscribe(x => sendMessage(ws, scriptStateChange(x)));

  const stdoutSubscription = merge(
    ...Object.entries(scripts.npmScripts).map(([name, script]) =>
      script.stdout.pipe(map(chunk => ({ name, chunk })))
    )
  ).subscribe(x => sendMessage(ws, scriptStdoutNewChunk(x)));

  const npmInstallSubscription = scripts.npmInstall.state.subscribe(x =>
    sendMessage(ws, npmInstalState(x))
  );

  const npmInstallStdoutSubscription = scripts.npmInstall.stdout.subscribe(x =>
    sendMessage(ws, npmInstallStdoutChunk(x))
  );

  return () => {
    [
      stateSubscription,
      stdoutSubscription,
      npmInstallSubscription,
      npmInstallStdoutSubscription
    ].forEach(x => x.unsubscribe());
  };
}

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

  server.listen(config.port, () => {
    console.log(`🌏 Server started on http://localhost:${config.port} 🙃`);
  });
}

run();
