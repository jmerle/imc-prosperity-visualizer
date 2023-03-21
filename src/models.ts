import { ColorScheme } from '@mantine/core';

export type Theme = ColorScheme | 'system';

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
}

export interface AlgorithmSummary {
  id: string;
  content: string;
  fileName: string;
  round: string;
  selectedForRound: boolean;
  status: string;
  teamId: string;
  timestamp: string;
  user: UserSummary;
}

export type Time = number;
export type ProsperitySymbol = string;
export type Product = string;
export type Position = number;
export type UserId = string;
export type Observation = number;

export interface ActivityLogRow {
  day: number;
  timestamp: number;
  product: Product;
  bidPrices: number[];
  bidVolumes: number[];
  askPrices: number[];
  askVolumes: number[];
  midPrice: number;
  profitLoss: number;
}

export interface Listing {
  symbol: ProsperitySymbol;
  product: Product;
  denomination: Product;
}

export interface Order {
  symbol: ProsperitySymbol;
  price: number;
  quantity: number;
}

export interface OrderDepth {
  buy_orders: Record<number, number>;
  sell_orders: Record<number, number>;
}

export interface Trade {
  symbol: ProsperitySymbol;
  price: number;
  quantity: number;
  buyer: UserId;
  seller: UserId;
  timestamp: Time;
}

export interface TradingState {
  timestamp: Time;
  listings: Record<ProsperitySymbol, Listing>;
  order_depths: Record<ProsperitySymbol, OrderDepth>;
  own_trades: Record<ProsperitySymbol, Trade[]>;
  market_trades: Record<ProsperitySymbol, Trade[]>;
  position: Record<Product, Position>;
  observations: Record<Product, Observation>;
}

export interface SandboxLogRow {
  state: TradingState;
  orders: Record<ProsperitySymbol, Order[]>;
  logs: string;
}

export interface Algorithm {
  summary: AlgorithmSummary;
  activityLogs: ActivityLogRow[];
  sandboxLogs: SandboxLogRow[];
  submissionLogs: string;
}
