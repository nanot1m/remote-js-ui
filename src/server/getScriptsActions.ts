import { IProjectScripts } from "core";
import { merge } from "rxjs";
import { map } from "rxjs/operators";
import {
  npmInstallStdoutChunk,
  npmInstalState,
  scriptStateChange,
  scriptStdOutNewChunk
} from "shared/actions/serverActions";

export function getScriptsActions({ npmInstall, npmScripts }: IProjectScripts) {
  const npmScriptActions = Object.entries(npmScripts).map(([name, script]) =>
    merge(
      script.stdout.pipe(map(chunk => scriptStdOutNewChunk({ name, chunk }))),
      script.state.pipe(map(state => scriptStateChange({ name, state })))
    )
  );

  const npmInstallActions = merge(
    npmInstall.stdout.pipe(map(chunk => npmInstallStdoutChunk(chunk))),
    npmInstall.state.pipe(map(state => npmInstalState(state)))
  );

  return merge(...npmScriptActions, npmInstallActions);
}
