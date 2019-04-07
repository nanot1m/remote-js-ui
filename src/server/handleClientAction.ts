import WebSocket from "ws";
import { IProjectScripts } from "core";
import { FromClientToServerActions } from "shared/actions/FromClientToServerActions";
import { sendMessage } from "server/utils/wsUtils";
import { sendScripts } from "shared/actions/serverActions";

export function handleClientAction(scripts: IProjectScripts, ws: WebSocket) {
  return (action: FromClientToServerActions) => {
    if (action.type === "scripts/RUN") {
      const name = action.payload;
      scripts.npmScripts[name].run();
    }

    if (action.type === "scripts/KILL") {
      const name = action.payload;
      scripts.npmScripts[name].kill();
    }

    if (action.type === "scripts/GET") {
      sendMessage(ws, sendScripts(scripts));
    }

    if (action.type === "scripts/RUN_NPM_INSTALL") {
      scripts.npmInstall.run();
    }
  };
}
