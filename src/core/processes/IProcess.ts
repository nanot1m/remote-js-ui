import { ProcessStateType } from "./ProcessStateType";
import { Observable } from "rxjs";

export interface IProcess {
  readonly state: Observable<ProcessStateType>;

  readonly stdout: Observable<string>;

  getState(): ProcessStateType;

  run(): IProcess;

  kill(): IProcess;

  isRunning(): boolean;
}
