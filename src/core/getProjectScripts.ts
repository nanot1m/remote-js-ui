import path from "path";
import fs from "fs";
import { NpmScriptProcess } from "core/processes/NpmScriptProcess";
import { NpmInstallProcess } from "core/processes/NpmInstallProcess";
import { IProcess } from "core/processes/IProcess";

export interface IProjectScripts {
  readonly npmScripts: Record<string, IProcess>;
}

export function getProjectScripts(): IProjectScripts {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "package.json"), {
      encoding: "utf8"
    })
  );
  const npmScripts = Object.keys(packageJson.scripts || {}).reduce(
    (acc: Record<string, IProcess>, name: string) => {
      acc[name] = NpmScriptProcess.fromScriptName(name);
      return acc;
    },
    { "npm install": NpmInstallProcess.create() }
  );
  return { npmScripts };
}
