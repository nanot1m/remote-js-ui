import child_process, { ChildProcessWithoutNullStreams } from "child_process";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import stripAnsi from 'strip-ansi';

import { ProcessStateType } from "core/processes/ProcessStateType";
import fromReadableStream from "core/utils/fromReadableStream";
import { IProcess } from "core/processes/IProcess";

export class Process implements IProcess {
  public readonly stdout: Observable<string>;

  public readonly state: Observable<ProcessStateType>;

  private proc: ChildProcessWithoutNullStreams | undefined;

  private readonly stateSubject = new BehaviorSubject<ProcessStateType>(
    "stopped"
  );

  private readonly stdoutSubject = new Subject<string>();

  private readonly args: readonly string[];

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

    this.stateSubject.next('running');

    fromReadableStream<string>(this.proc.stdout).pipe(
      map(x => stripAnsi(x.toString()))
    ).subscribe(
      chunk => this.stdoutSubject.next(chunk),
      () => this.stateSubject.next("stopped"),
      () => this.stateSubject.next("stopped")
    );
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
