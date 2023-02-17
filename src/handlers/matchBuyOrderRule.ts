import dynamoDBService from "../services/dynamoDbClient";
import StockOrder from "../model/stockOrder";

import eventBridgeClientService from "../services/eventBridgeClient";

function _compareSellOrderAndSave(
  ordersData: any,
  buyOrderDetail: any
): object {
  console.log("🚀 ~ file: matchBuyOrderRule.ts:48 ~ ordersData", ordersData);
  if (ordersData.Items.length === 0) {
    return buyOrderDetail;
  }

  const lowestSellOrder = ordersData.Items.reduce((a, b) =>
    a.price < b.price ? a : b
  );
  console.log(
    "🚀 ~ file: matchBuyOrderRule.ts:55 ~ lowestSellOrder",
    lowestSellOrder
  );

  const buyOrderDetailWithFulfillment = {
    ...buyOrderDetail,
    fulfillment: `Sell Fullfillment: ${lowestSellOrder.volume}/${lowestSellOrder.price}`,
  };

  console.log(
    "🚀 ~ file: matchBuyOrderRule.ts:58 ~ buyOrderDetailWithFulfillment",
    buyOrderDetailWithFulfillment
  );

  return buyOrderDetailWithFulfillment;
}

async function _scanAllSellOrdersToCompare(buyPrice: number): Promise<object> {
  try {
    return await dynamoDBService.fetchAllSellOrdersWithLowestPrice(buyPrice);
  } catch (error) {
    throw new Error("error retrieving orders");
  }
}

async function matchBuyOrderRule(event: any, _context: any) {
  console.log("matchBuyOrderRule:event", event);

  // NB: for local and remote development/testing purposes, we are catering for sls local invoke vs Postman (or similar)
  // just leaving it here for self notes
  const data = event.body || event;

  const orderDetail = data.detail;

  const allOrdersData = await _scanAllSellOrdersToCompare(orderDetail.price);

  const orderDetailToSave = _compareSellOrderAndSave(
    allOrdersData,
    orderDetail
  );

  try {
    const result = await eventBridgeClientService.triggerSaveOrderToDBEventRule(
      orderDetailToSave
    );
    console.log("Buy Event sent to EventBridge with result", result);

    return {
      statusCode: 200,
      message: "Successfully sent to EventBridge!",
    };
  } catch (error) {
    console.log("error!!", error);
    return {
      statusCode: 500,
      message: "error sent to EventBridge!",
    };
  }
}

export const handler = matchBuyOrderRule;
