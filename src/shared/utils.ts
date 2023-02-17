import { Action, EventDetailType } from "../shared/types";

// TODO: to check for mandatory requests field validation for now..
function validateRequest(requestBody: any): boolean {
  const { symbol, action, volume, price } = requestBody;

  if (
    typeof symbol !== "number" ||
    typeof action !== "string" ||
    typeof volume !== "number" ||
    typeof price !== "number"
  ) {
    return false;
  }

  return true;
}

function checkAndFetchDetailType(actionType: string): string {
  actionType == Action.BUY;

  switch (actionType) {
    case Action.BUY:
      return EventDetailType.BUY_ORDER;
    case Action.SELL:
      return EventDetailType.SELL_ORDER;
    // TECHDEBT - very very unlikely it will reach here....
    default:
      return "";
  }
}

export { validateRequest, checkAndFetchDetailType };
