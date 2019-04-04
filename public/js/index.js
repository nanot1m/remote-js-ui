// @ts-check

import { setupWS } from "./ws.js";

const scriptsNode = document.getElementById("scripts");

/** @type {HTMLTextAreaElement} */
const stdoutNode = (() => {
  const node = document.getElementById("stdout");
  if (node instanceof HTMLTextAreaElement) {
    return node;
  }
  throw new Error("stdout is not textarea");
})();

/** @type {HTMLButtonElement} */
const npmInstallButton = (() => {
  const node = document.getElementById("npm-install");
  if (node instanceof HTMLButtonElement) {
    return node;
  }
  throw new Error("stdout is not textarea");
})();

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

/**
 * @param {Array<{name: string, state: string}>} scripts
 */
function initScriptsView(scripts) {
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
    ws.dispatch({ type: "scripts/RUN_NPM_INSTALL" });
  });
}

function getScriptActionName(state) {
  return state === "stopped" ? "Run" : "Stop";
}

/**
 * @param {Object} scriptStateDTO
 * @param {string} scriptStateDTO.name
 * @param {string} scriptStateDTO.state
 */
function updateScriptState(scriptStateDTO) {
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
function updateNpmInstall(state) {
  const running = state === "running";

  npmInstallButton.disabled = running;
  npmInstallButton.innerText = running ? "installing..." : "Run npm install";
}

/**
 * @param {string} name
 * @param {string} chunk
 */
function updateStdout(name, chunk) {
  stdoutNode.value = `${stdoutNode.value}\n[${name}]${chunk}`;
}

/**
 * @param {MouseEvent} event
 */
function handleScriptClick(event) {
  const node = event.target;
  if (!(node instanceof HTMLElement)) {
    return;
  }

  if (node.classList.contains("scripts__script-state")) {
    const { name, state } = node.dataset;
    if (state === "running") {
      ws.dispatch({ type: "scripts/KILL", payload: name });
    } else {
      ws.dispatch({ type: "scripts/RUN", payload: name });
    }
  }
}
