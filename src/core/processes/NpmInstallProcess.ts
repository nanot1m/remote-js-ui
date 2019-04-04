import { Process } from "./Process";

export class NpmInstallProcess extends Process {
  public static create() {
    return new NpmInstallProcess();
  }

  private constructor() {
    super("npm", "install");
  }
}
