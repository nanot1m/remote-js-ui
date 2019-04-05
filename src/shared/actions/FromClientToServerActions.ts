import { ActionType } from "typesafe-actions";
import * as clientActions from "shared/actions/clientActions";

export type FromClientToServerActions = ActionType<typeof clientActions>;
