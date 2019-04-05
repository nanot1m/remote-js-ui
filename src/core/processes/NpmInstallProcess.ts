import { Process } from "core/processes/Process";

export class NpmInstallProcess extends Process {
  public static create() {
    return new NpmInstallProcess();
  }

  private constructor() {
    super("npm", "install");
  }
}
