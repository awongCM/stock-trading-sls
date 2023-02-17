import dynamoDBService from "../services/dynamoDbClient";

async function fetchAllOrders(event: any, _context: any) {
  console.log("fetchAllOrders:event", event);

  try {
    const data = await dynamoDBService.getAllStockOrders();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully retrieved orders!",
        data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        message: "error retrieving orders!",
        error,
      },
    };
  }
}

export const handler = fetchAllOrders;
