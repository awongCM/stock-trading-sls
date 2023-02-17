import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import StockOrder from "../model/stockOrder";

const REGION = process.env.REGION || "";
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

class DynamoDBClientService {
  private dynamoDbClient: DynamoDBClient;
  private client: DynamoDBDocumentClient;

  constructor() {
    // TODO - this is techdebt for now as we learned aws sdk 3 dynamodb libraries has it upcoming marshalling properties
    // in a separate library
    const marshallOptions = {
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: false, // false, by default.
      // Whether to remove undefined values while marshalling.
      removeUndefinedValues: true, // false, by default.
      // Whether to convert typeof object to map attribute.
      convertClassInstanceToMap: false, // false, by default.
    };

    const unmarshallOptions = {
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      wrapNumbers: false, // false, by default.
    };

    this.dynamoDbClient = new DynamoDBClient({ region: REGION });
    this.client = DynamoDBDocumentClient.from(this.dynamoDbClient, {
      marshallOptions,
      unmarshallOptions,
    });
  }

  async fetchAllSellOrdersWithLowestPrice(buyPrice: number): Promise<object> {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: "#action = :action_val AND #price <= :price_val",
      ExpressionAttributeNames: {
        "#action": "action",
        "#price": "price",
      },
      ExpressionAttributeValues: {
        ":action_val": "Sell",
        ":price_val": buyPrice,
      },
    };

    const scanCommand = new ScanCommand(params);

    try {
      const data = await this.client.send(scanCommand);
      console.log("success", data);

      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async fetchAllBuyOrdersWithHighestPrice(sellPrice: number): Promise<object> {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: "#action = :action_val AND #price >= :price_val",
      ExpressionAttributeNames: {
        "#action": "action",
        "#price": "price",
      },
      ExpressionAttributeValues: {
        ":action_val": "Buy",
        ":price_val": sellPrice,
      },
    };

    const scanCommand = new ScanCommand(params);

    try {
      const data = await this.client.send(scanCommand);
      console.log("success", data);

      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async getAllStockOrders(): Promise<any[]> {
    const queryParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    const scanCommand = new ScanCommand(queryParams);

    try {
      const data = await this.client.send(scanCommand);
      console.log("success", data);

      const { Items } = data;

      return Items as any;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async createStockOrder(stockOrder: StockOrder): Promise<Object> {
    const params = {
      TableName: TABLE_NAME,
      Item: stockOrder,
    };

    const putItemCommand = new PutCommand(params);

    try {
      const data = await this.client.send(putItemCommand);
      console.log("success", data);

      return {
        statusCode: 200,
        message: "Successfully inserted order!",
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 500,
        message: "error inserting order!",
      };
    }
  }
}

const dynamoDBService = new DynamoDBClientService();

export default dynamoDBService;
