import dynamoDBService from "../services/dynamoDbClient";
import StockOrder from "../model/stockOrder";

import eventBridgeClientService from "../services/eventBridgeClient";

function _compareBuyOrderAndSave(
  ordersData: any,
  sellOrderDetail: any
): object {
  console.log("🚀 ~ file: matchSellOrderRule.ts:48 ~ ordersData", ordersData);
  if (ordersData.Items.length === 0) {
    return sellOrderDetail;
  }

  const highestBuyOrder = ordersData.Items.reduce((a, b) =>
    a.price > b.price ? a : b
  );
  console.log(
    "🚀 ~ file: matchSellOrderRule.ts:55 ~ highestBuyOrder",
    highestBuyOrder
  );

  const sellOrderDetailWithFulfillment = {
    ...sellOrderDetail,
    fulfillment: `Buy Fullfillment: ${highestBuyOrder.volume}/${highestBuyOrder.price}`,
  };

  console.log(
    "🚀 ~ file: matchSellOrderRule.ts:58 ~ sellOrderDetailWithFulfillment",
    sellOrderDetailWithFulfillment
  );

  return sellOrderDetailWithFulfillment;
}

async function _scanAllBuyOrdersToCompare(sellPrice: number): Promise<object> {
  try {
    return await dynamoDBService.fetchAllBuyOrdersWithHighestPrice(sellPrice);
  } catch (error) {
    throw new Error("error retrieving orders");
  }
}

async function matchSellOrderRule(event: any, _context: any) {
  console.log("matchSellOrderRule:event", event);

  // NB: for local and remote development/testing purposes, we are catering for sls local invoke vs Postman (or similar)
  // just leaving it here for self notes
  const data = event.body || event;

  const orderDetail = data.detail;

  const allOrdersData = await _scanAllBuyOrdersToCompare(orderDetail.price);

  const orderDetailToSave = _compareBuyOrderAndSave(allOrdersData, orderDetail);

  try {
    const result = await eventBridgeClientService.triggerSaveOrderToDBEventRule(
      orderDetailToSave
    );
    console.log("Sell Event sent to EventBridge with result", result);

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

export const handler = matchSellOrderRule;
