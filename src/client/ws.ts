import { FromServerToClientActions } from "shared/actions/FromServerToClientActions";
import { parseMessage } from "shared/utils/wsUtils";
import { FromClientToServerActions } from "shared/actions/FromClientToServerActions";

export type MessageHandlerType = (
  action: FromServerToClientActions,
  dispatch: (action: FromClientToServerActions) => void
) => void;

export function setupWS(messageHandler: MessageHandlerType) {
  const messageQueue: FromClientToServerActions[] = [];

  let ws: WebSocket;

  function init() {
    ws = new WebSocket(`ws://${location.host}`);

    ws.addEventListener("message", event => {
      const action = parseMessage<FromServerToClientActions>(event.data);
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

  function dispatch(action: FromClientToServerActions) {
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
