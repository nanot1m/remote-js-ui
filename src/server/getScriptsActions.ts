import { IProjectScripts } from "core";
import { merge } from "rxjs";
import { map } from "rxjs/operators";
import {
  scriptStateChange,
  scriptStdOutNewChunk
} from "shared/actions/serverActions";

export function getScriptsActions({ npmScripts }: IProjectScripts) {
  const npmScriptActions = Object.entries(npmScripts).map(([name, script]) =>
    merge(
      script.stdout.pipe(map(chunk => scriptStdOutNewChunk({ name, chunk }))),
      script.state.pipe(map(state => scriptStateChange({ name, state })))
    )
  );

  return merge(...npmScriptActions);
}
