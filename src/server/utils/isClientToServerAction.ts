import { FromClientToServerActions } from "shared/actions/FromClientToServerActions";
export function isClientToServerAction(
  data: unknown
): data is FromClientToServerActions {
  return typeof data === "object" && !!data && Reflect.has(data, "type");
}
