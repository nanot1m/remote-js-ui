import { createStandardAction } from "typesafe-actions";

export const getScripts = createStandardAction("scripts/GET")();

export const runScript = createStandardAction("scripts/RUN")<string>();

export const killScript = createStandardAction("scripts/KILL")<string>();
