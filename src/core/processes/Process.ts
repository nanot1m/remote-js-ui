import child_process, { ChildProcessWithoutNullStreams } from "child_process";
import { BehaviorSubject, Subject, Observable, merge } from "rxjs";
import { map } from "rxjs/operators";

import { ProcessStateType } from "core/processes/ProcessStateType";
import fromReadableStream from "core/utils/fromReadableStream";
import { IProcess } from "core/processes/IProcess";
import { createInterface } from "readline";

export class Process implements IProcess {
  public readonly stdout: Observable<string>;

  public readonly state: Observable<ProcessStateType>;

  private proc: ChildProcessWithoutNullStreams | undefined;

  private readonly stateSubject = new BehaviorSubject<ProcessStateType>(
    "stopped"
  );

  private readonly stdoutSubject = new Subject<string>();

  private readonly args: string[];

  public constructor(private command: string, ...args: string[]) {
    this.stdout = this.stdoutSubject.asObservable();
    this.state = this.stateSubject.asObservable();
    this.args = args;
  }

  public getState() {
    return this.stateSubject.getValue();
  }

  public isRunning() {
    return this.getState() === "running";
  }

  public run() {
    this.proc = child_process.spawn(this.command, this.args, {
      shell: true,
      detached: true
    });

    createInterface({
      input: this.proc.stdout,
      terminal: true
    }).on("line", line => this.stdoutSubject.next(line));

    createInterface({
      input: this.proc.stderr,
      terminal: true
    }).on("line", line => this.stdoutSubject.next(line));

    this.stateSubject.next("running");

    this.proc.on("exit", () => this.stateSubject.next("stopped"));
    this.proc.on("error", () => this.stateSubject.next("stopped"));

    return this;
  }

  public kill() {
    if (this.proc) {
      try {
        process.kill(-this.proc.pid);
      } catch (err) {
        console.error(err);
      }
    }
    return this;
  }
}
