//TODO
enum StockSymbol {
  CBA = "CBA",
  NAB = "NAB",
  WBC = "WBC",
  ANZ = "ANZ",
}

enum Action {
  BUY = "Buy",
  SELL = "Sell",
}

enum EventSource {
  PROCESS_ORDER_ROUTE = "processOrderRoute",
  MATCH_ORDER_ROUTE = "matchOrderRoute",
}

enum EventDetailType {
  SAVE_ORDER = "Save Order",
  BUY_ORDER = "Buy Order",
  SELL_ORDER = "Sell Order",
}

export { StockSymbol, EventSource, EventDetailType, Action };
