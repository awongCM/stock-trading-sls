import eventBridgeClientService from "../services/eventBridgeClient";

import { validateRequest } from "../shared/utils";

async function processOrder(event: any, _context: any) {
  console.log("processOrder:event", event);

  // NB: for local and remote development/testing purposes, we are catering for sls local invoke vs Postman (or similar)
  // just leaving it here for self notes
  const detailData = event.body || event;

  if (!validateRequest(detailData)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Bad Request encountered - ⚠️⚠️⚠️",
      }),
    };
  }

  try {
    await eventBridgeClientService.triggerProcessOrderEventRule(detailData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "'Successfully sent to EventBridgeClientService! 🚀'",
      }),
    };
  } catch (error) {
    console.log("🚀 ~ file: processOrder.ts:95 ~ processOrder ~ error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "error sent to EventBridgeClientService! 👎",
      }),
    };
  }
}

export const handler = processOrder;
