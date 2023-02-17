import dynamoDBService from "../services/dynamoDbClient";
import StockOrder from "../model/stockOrder";
import UUID from "uuid-int";

const id = 0;
const generator = UUID(id);

async function saveOrderToDbRule(event: any, _context: any) {
  console.log("saveOrderToDbRule:event", event);

  // NB: for local and remote development/testing purposes, we are catering for sls local invoke vs Postman (or similar)
  // just leaving it here for self notes
  const data = event.body || event;

  const orderDetail = data.detail;

  try {
    const stockOrder: StockOrder = {
      orderId: generator.uuid(),
      symbol: orderDetail.symbol,
      action: orderDetail.action,
      volume: orderDetail.volume,
      price: orderDetail.price,
      fulfillment: orderDetail.fulfillment,
    };

    const data = await dynamoDBService.createStockOrder(stockOrder);

    console.log("success", data);
  } catch (error) {
    console.log("error", error);
  }
}

export const handler = saveOrderToDbRule;
