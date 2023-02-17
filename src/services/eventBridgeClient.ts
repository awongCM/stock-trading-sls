import UUID from "uuid-int";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import EventEntry from "../model/eventEntry";
import { EventSource, EventDetailType } from "../shared/types";
import { checkAndFetchDetailType } from "../shared/utils";

const REGION = process.env.REGION || "";
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME || "";

class EventBridgeClientService {
  private client: EventBridgeClient;

  constructor() {
    this.client = new EventBridgeClient({ region: REGION });
  }

  async triggerProcessOrderEventRule(orderDetailToSend: any): Promise<Object> {
    const parsedDetailData = JSON.parse(orderDetailToSend);

    const detailType = checkAndFetchDetailType(parsedDetailData.action);

    const eventEntry: EventEntry = {
      Source: EventSource.PROCESS_ORDER_ROUTE,
      EventBusName: EVENT_BUS_NAME,
      DetailType: detailType,
      Time: new Date(),
      Detail: orderDetailToSend,
    };

    const eventBridgeParams = {
      Entries: [eventEntry],
    };

    const putEventCommand = new PutEventsCommand(eventBridgeParams);

    try {
      const result = await this.client.send(putEventCommand);

      console.log(
        `Trigger Process Order Event ${detailType} sent to EventBridge with result`,
        result
      );

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

  async triggerSaveOrderToDBEventRule(orderDetailToSave: any): Promise<Object> {
    const eventEntry: EventEntry = {
      Source: EventSource.MATCH_ORDER_ROUTE,
      EventBusName: EVENT_BUS_NAME,
      DetailType: EventDetailType.SAVE_ORDER,
      Time: new Date(),
      Detail: JSON.stringify(orderDetailToSave),
    };

    const eventBridgeParams = {
      Entries: [eventEntry],
    };

    const putEventCommand = new PutEventsCommand(eventBridgeParams);

    try {
      const result = await this.client.send(putEventCommand);

      console.log(
        `Trigger Save Order To Db Event sent to EventBridge with result`,
        result
      );

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
}

const eventBridgeClientService = new EventBridgeClientService();

export default eventBridgeClientService;
