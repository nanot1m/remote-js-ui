import "./index.css";

import { setupWS } from "./ws";
import { findElementById } from "./findElementById";
import { IScriptStateDTO } from "shared/actions/serverActions";
import { ProcessStateType } from "core";
import {
  killScript,
  runScript,
  runNpmInstall
} from "shared/actions/clientActions";

const scriptsNode = findElementById("scripts", HTMLElement);
const stdoutNode = findElementById("stdout", HTMLTextAreaElement);
const npmInstallButton = findElementById("npm-install", HTMLButtonElement);

const ws = setupWS(action => {
  switch (action.type) {
    case "scripts/SEND": {
      initScriptsView(action.payload.npmScripts);
      initNpmInstall();
      break;
    }

    case "scripts/STATE_CHANGE": {
      updateScriptState(action.payload);
      break;
    }

    case "scripts/STD_OUT_NEW_CHUNK": {
      updateStdout(action.payload.name, action.payload.chunk);
      break;
    }

    case "scripts/NPM_INSTALL_STATE": {
      updateNpmInstall(action.payload);
      break;
    }

    case "scripts/NPM_INSTALL_STDOUT_CHUNK": {
      updateStdout("npm install", action.payload);
      break;
    }
  }
});

ws.dispatch({ type: "scripts/GET" });

scriptsNode.addEventListener("click", handleScriptClick);

function initScriptsView(scripts: IScriptStateDTO[]) {
  const scriptNodes = scripts.map(script => {
    const scriptNode = document.createElement("div");
    scriptNode.className = "scripts__script";
    scriptNode.innerHTML = `
<div class="scripts__script-name">${script.name}</div>
<button
  class="scripts__script-state"
  data-name="${script.name}"
  data-state="${script.state}"
>${getScriptActionName(script.state)}
</button>
`.trim();
    return scriptNode;
  });

  scriptsNode.innerHTML = ``;
  scriptNodes.forEach(scriptNode => {
    scriptsNode.appendChild(scriptNode);
  });
}

function initNpmInstall() {
  npmInstallButton.addEventListener("click", () => {
    ws.dispatch(runNpmInstall());
  });
}

function getScriptActionName(state: ProcessStateType) {
  return state === "stopped" ? "Run" : "Stop";
}

function updateScriptState(scriptStateDTO: IScriptStateDTO) {
  const { name, state } = scriptStateDTO;
  const node = scriptsNode.querySelector(`[data-name="${name}"]`);
  if (node instanceof HTMLElement) {
    node.dataset.state = state;
    node.innerText = getScriptActionName(state);
  }
}

/**
 *
 * @param {string} state
 */
function updateNpmInstall(state: ProcessStateType) {
  const running = state === "running";

  npmInstallButton.disabled = running;
  npmInstallButton.innerText = running ? "installing..." : "Run npm install";
}

function updateStdout(name: string, chunk: string) {
  stdoutNode.value = `${stdoutNode.value}\n[${name}]${chunk}`;
}

function handleScriptClick(event: MouseEvent) {
  const node = event.target;
  if (!(node instanceof HTMLElement)) {
    return;
  }

  if (node.classList.contains("scripts__script-state")) {
    const { name, state } = node.dataset;
    if (!name) {
      return;
    }
    if (state === "running") {
      ws.dispatch(killScript(name));
    } else {
      ws.dispatch(runScript(name));
    }
  }
}
