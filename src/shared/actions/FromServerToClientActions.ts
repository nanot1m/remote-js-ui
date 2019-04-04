import { ActionType } from "typesafe-actions";
import * as serverActions from "./serverActions";

export type FromServerToClientActions = ActionType<typeof serverActions>;
