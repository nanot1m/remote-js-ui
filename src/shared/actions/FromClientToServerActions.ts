import { ActionType } from "typesafe-actions";
import * as clientActions from "./clientActions";

export type FromClientToServerActions = ActionType<typeof clientActions>;
