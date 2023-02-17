export default interface StockOrder {
  orderId: number;
  symbol: string;
  action: string;
  volume: number;
  price: number;
  fulfillment: string;
}
