import path from "path";
import { NpmScriptProcess } from "./processes/NpmScriptProcess";
import { NpmInstallProcess } from "./processes/NpmInstallProcess";
import { IProcess } from "./processes/IProcess";

export interface IProjectScripts {
  readonly npmScripts: Record<string, IProcess>;
  readonly npmInstall: IProcess;
}

export function getProjectScripts(): IProjectScripts {
  const packageJson = require(path.resolve(process.cwd(), "package.json"));
  const npmScripts = Object.keys(packageJson.scripts || {}).reduce(
    (acc: Record<string, NpmScriptProcess>, name: string) => {
      acc[name] = NpmScriptProcess.fromScriptName(name);
      return acc;
    },
    {}
  );
  return {
    npmScripts,
    npmInstall: NpmInstallProcess.create()
  };
}
