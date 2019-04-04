// @ts-check

/**
 * @typedef {import('../../src/shared/actions/FromServerToClientActions').FromServerToClientActions} FromServerToClientActions
 */

/**
 * @typedef {import('../../src/shared/actions/FromClientToServerActions').FromClientToServerActions} FromClientToServerActions
 */

/**
 * @typedef {(action: FromServerToClientActions, dispatch: (action: FromClientToServerActions) => void) => void} MessageHandler
 */

/**
 * @param {MessageHandler} messageHandler
 */
export function setupWS(messageHandler) {
  const messageQueue = [];

  let ws;

  function init() {
    ws = new WebSocket(`ws://${location.host}`);

    ws.addEventListener("message", event => {
      const action = parseMessage(event.data);
      if (!action) {
        return;
      }
      messageHandler(action, dispatch);
    });

    ws.addEventListener("open", () => {
      let message;
      while ((message = messageQueue.shift())) {
        dispatch(message);
      }
    });

    ws.addEventListener("close", () => {
      setTimeout(init, 3000);
    });

    ws.addEventListener("error", () => {
      setTimeout(init, 3000);
    });

    return ws;
  }

  init();

  /**
   * @param {FromClientToServerActions} action
   */
  function dispatch(action) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(action));
    } else {
      messageQueue.push(action);
    }
  }

  return {
    dispatch
  };
}

/**
 * @param {string} data
 *
 * @returns {FromServerToClientActions | null}
 */
function parseMessage(data) {
  try {
    return JSON.parse(data);
  } catch (ex) {
    return null;
  }
}
