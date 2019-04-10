import { ProcessStateType } from "core";
import { FromServerToClientActions } from "shared/actions/FromServerToClientActions";
import { useCallback, useLayoutEffect, useReducer, useRef } from "react";
import { DispatchType, setupWS } from "client/ws";
import {
  getScripts,
  killScript,
  runScript
} from "shared/actions/clientActions";
import { createStandardAction } from "typesafe-actions";
import { scriptStateChange } from "shared/actions/serverActions";
import { tupple } from "shared/utils/tupple";
import ansiToJson, { AnsiNode } from "ansi-to-json";

export interface ScriptModelType {
  name: string;
  state: ProcessStateType;
  stdout: AnsiNode[];
}

export interface MainState {
  npmScripts: Record<string, ScriptModelType>;
  stdoutTabs: string[];
  currentStdoutTab: number;
}

const clearStdoutAction = createStandardAction("stdout/CLEAR")();
const closeStdoutTabAction = createStandardAction("stdout/CLOSE_TAB")<number>();
const selectStdoutTabAction = createStandardAction("stdout/SELECT_TAB")<
  number
>();

type ClientActions =
  | ReturnType<typeof clearStdoutAction>
  | ReturnType<typeof closeStdoutTabAction>
  | ReturnType<typeof selectStdoutTabAction>;

const initialState: MainState = {
  npmScripts: {},
  stdoutTabs: [],
  currentStdoutTab: 0
};

function handleScriptStateChange(
  action: ReturnType<typeof scriptStateChange>,
  state: MainState
) {
  const { state: scriptState, name } = action.payload;

  let nextStdoutTabs = state.stdoutTabs;
  let nextCurrentStdoutTab = state.currentStdoutTab;
  if (scriptState === "running") {
    if (!nextStdoutTabs.includes(name)) {
      nextStdoutTabs = nextStdoutTabs.concat(name);
    }
    nextCurrentStdoutTab = Math.max(nextStdoutTabs.indexOf(name), 0);
  }

  const updatedScript = state.npmScripts[name]
    ? { ...state.npmScripts[name], state: scriptState }
    : { name, state: scriptState, stdout: [] };

  return {
    ...state,
    stdoutTabs: nextStdoutTabs,
    currentStdoutTab: nextCurrentStdoutTab,
    npmScripts: {
      ...state.npmScripts,
      [name]: updatedScript
    }
  };
}

function mainReducer(
  state: MainState,
  action: FromServerToClientActions | ClientActions
): MainState {
  switch (action.type) {
    case "scripts/SEND": {
      const { npmScripts } = action.payload;
      return {
        ...state,
        npmScripts: npmScripts.reduce(
          (acc, script) => {
            acc[script.name] = {
              name: script.name,
              state: script.state,
              stdout: []
            };
            return acc;
          },
          {} as Record<string, ScriptModelType>
        )
      };
    }

    case "scripts/STATE_CHANGE": {
      return handleScriptStateChange(action, state);
    }

    case "scripts/STD_OUT_NEW_CHUNK": {
      const { name, chunk } = action.payload;
      const updatedScript: ScriptModelType = state.npmScripts[name]
        ? {
            ...state.npmScripts[name],
            stdout: state.npmScripts[name].stdout.concat(ansiToJson(chunk))
          }
        : {
            name,
            state: "stopped",
            stdout: ansiToJson(chunk)
          };
      return {
        ...state,
        npmScripts: {
          ...state.npmScripts,
          [name]: updatedScript
        }
      };
    }

    case "stdout/SELECT_TAB": {
      return {
        ...state,
        currentStdoutTab: Math.min(action.payload, state.stdoutTabs.length - 1)
      };
    }

    case "stdout/CLOSE_TAB": {
      return {
        ...state,
        stdoutTabs: state.stdoutTabs.slice().splice(action.payload, 1),
        currentStdoutTab: Math.max(
          0,
          Math.min(state.currentStdoutTab, state.stdoutTabs.length - 2)
        )
      };
    }

    case "stdout/CLEAR": {
      const name = state.stdoutTabs[state.currentStdoutTab];

      if (!name) {
        return state;
      }

      const updatedScript: ScriptModelType = state.npmScripts[name]
        ? { ...state.npmScripts[name], stdout: [] }
        : { name, state: "stopped", stdout: [] };

      return {
        ...state,
        npmScripts: {
          ...state.npmScripts,
          [name]: updatedScript
        }
      };
    }
    default:
      return state;
  }
}

export function useMainController() {
  const wsDispatch = useRef<DispatchType>(() => void 0);
  const [state, dispatch] = useReducer(mainReducer, initialState);

  useLayoutEffect(() => {
    const ws = setupWS(action => dispatch(action));
    ws.dispatch(getScripts());
    wsDispatch.current = ws.dispatch;
  }, []);

  const killNpmScript = useCallback(
    (name: string) => wsDispatch.current(killScript(name)),
    []
  );

  const runNpmScript = useCallback(
    (name: string) => wsDispatch.current(runScript(name)),
    []
  );

  const clearStdout = useCallback(() => dispatch(clearStdoutAction()), []);

  const selectStdoutTab = useCallback(
    (idx: number) => dispatch(selectStdoutTabAction(idx)),
    []
  );

  const closeStdoutTab = useCallback(
    (idx: number) => dispatch(closeStdoutTabAction(idx)),
    []
  );

  return tupple(state, {
    killNpmScript,
    runNpmScript,
    clearStdout,
    selectStdoutTab,
    closeStdoutTab
  });
}
