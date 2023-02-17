from diagrams import Diagram
from diagrams.aws.compute import Lambda
from diagrams.aws.database import DDB
from diagrams.aws.network import APIGateway
from diagrams.aws.integration import (
    Eventbridge, EventbridgeDefaultEventBusResource)

with Diagram("Stock Trading Serverless Service", show=False):
    # TODO
