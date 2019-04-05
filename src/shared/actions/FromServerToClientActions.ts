import { ActionType } from "typesafe-actions";
import * as serverActions from "shared/actions/serverActions";

export type FromServerToClientActions = ActionType<typeof serverActions>;
