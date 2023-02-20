from diagrams import(Cluster, Diagram)
from diagrams.aws.compute import Lambda
from diagrams.aws.database import DDB
from diagrams.aws.network import APIGateway
from diagrams.aws.integration import (
    Eventbridge, EventbridgeCustomEventBusResource, EventResource)

with Diagram("Stock Trading Serverless Service", show=False):
    ddb = DDB('order_book')

    with Cluster("Order Events EventBridge Cluster"):
        eb_primary = Eventbridge("Order EventBridge")
        bor = EventResource('buy order rule')
        sor = EventResource('sell order rule')
        bor >> Lambda('matchBuyOrderRule') >> eb_primary
        sor >> Lambda('matchSellOrderRule') >> eb_primary
        eb_primary >> [bor, sor]

    APIGateway(':post:order') >> Lambda(
        'proceessOrder') >> eb_primary >> Lambda('saveOrderToDbRule') >> ddb

    APIGateway(':get:orders') >> Lambda('fetchAllOrders') >> ddb
