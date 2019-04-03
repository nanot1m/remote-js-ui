import cp, { ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import fromReadableStream from "./utils/fromReadableStream";
import { Observable, BehaviorSubject, Subject, Unsubscribable } from "rxjs";

export function getProjectScripts() {
  const packageJson = require(path.resolve(process.cwd(), "package.json"));
  return Object.keys(packageJson.scripts || {}).reduce(
    (acc: Record<string, IScript>, name: string) => {
      acc[name] = scriptFactory(name);
      return acc;
    },
    {}
  );
}

export type ScriptStateType = "running" | "stopped";

export interface IScript {
  readonly name: string;
  readonly state: Observable<ScriptStateType>;
  readonly stdout: Observable<string>;
  run(): IScript;
  kill(): IScript;
  isRunning(): boolean;
  getState(): ScriptStateType;
}

function scriptFactory(script: string): IScript {
  const stateSubject = new BehaviorSubject<ScriptStateType>("stopped");
  const stdoutSubject = new Subject<string>();

  let proc: ChildProcessWithoutNullStreams;
  let unsubscribable: Unsubscribable;

  function run() {
    proc = cp.spawn("npm", ["run", script]);

    stateSubject.next("running");

    unsubscribable = fromReadableStream<string>(proc.stdout).subscribe(
      chunk => stdoutSubject.next(chunk),
      () => stateSubject.next("stopped"),
      () => stateSubject.next("stopped")
    );
  }

  function kill() {
    if (proc) {
      proc.kill("SIGINT");
      stateSubject.next("stopped");
    }
    if (unsubscribable) {
      unsubscribable.unsubscribe();
    }
  }

  return {
    isRunning() {
      return stateSubject.value === "running";
    },
    getState() {
      return stateSubject.value;
    },
    kill() {
      kill();
      return this;
    },
    run() {
      run();
      return this;
    },
    name: script,
    state: stateSubject.asObservable(),
    stdout: stdoutSubject.asObservable()
  };
}
