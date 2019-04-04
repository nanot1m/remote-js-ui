import { Process } from "./Process";

export class NpmScriptProcess extends Process {
  public static fromScriptName(name: string) {
    return new NpmScriptProcess(name);
  }

  private constructor(public readonly name: string) {
    super("npm", "run", name);
  }
}
