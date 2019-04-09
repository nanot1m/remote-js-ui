import { FromServerToClientActions } from "shared/actions/FromServerToClientActions";
import { parseMessage } from "shared/utils/wsUtils";
import { FromClientToServerActions } from "shared/actions/FromClientToServerActions";

export type MessageHandlerType = (
  action: FromServerToClientActions,
  dispatch: (action: FromClientToServerActions) => void
) => void;

export type DispatchType = (action: FromClientToServerActions) => void;

export function setupWS(
  messageHandler: MessageHandlerType
): { dispatch: DispatchType } {
  const messageQueue: FromClientToServerActions[] = [];

  let ws: WebSocket;

  function init() {
    ws = new WebSocket(`ws://${location.host}/ws`);

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
  }

  init();
  setInterval(() => {
    if (ws.readyState !== ws.OPEN) {
      init();
    }
  }, 5000);

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
