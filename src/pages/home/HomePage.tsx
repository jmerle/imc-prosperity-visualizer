import { Code, Container, Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { PrismScrollArea } from '../base/PrismScrollArea';
import { HomeCard } from './HomeCard';
import { LoadFromFile } from './LoadFromFile';
import { LoadFromProsperity } from './LoadFromProsperity';

export function HomePage(): JSX.Element {
  const exampleCode = `
import json
from datamodel import Order, ProsperityEncoder, Symbol, Trade, TradingState
from typing import Any

class Logger:
    def __init__(self) -> None:
        self.logs = ""

    def print(self, *objects: Any, sep: str = " ", end: str = "\\n") -> None:
        self.logs += sep.join(map(str, objects)) + end

    def flush(self, state: TradingState, orders: dict[Symbol, list[Order]]) -> None:
        print(json.dumps({
            "state": self.compress_state(state),
            "orders": self.compress_orders(orders),
            "logs": self.logs,
        }, cls=ProsperityEncoder, separators=(",", ":"), sort_keys=True))

        self.logs = ""

    def compress_state(self, state: TradingState) -> dict[str, Any]:
        listings = []
        for listing in state.listings.values():
            listings.append([listing["symbol"], listing["product"], listing["denomination"]])

        order_depths = {}
        for symbol, order_depth in state.order_depths.items():
            order_depths[symbol] = [order_depth.buy_orders, order_depth.sell_orders]

        return {
            "t": state.timestamp,
            "l": listings,
            "od": order_depths,
            "ot": self.compress_trades(state.own_trades),
            "mt": self.compress_trades(state.market_trades),
            "p": state.position,
            "o": state.observations,
        }

    def compress_trades(self, trades: dict[Symbol, list[Trade]]) -> list[list[Any]]:
        compressed = []
        for arr in trades.values():
            for trade in arr:
                compressed.append([
                    trade.symbol,
                    trade.buyer,
                    trade.seller,
                    trade.price,
                    trade.quantity,
                    trade.timestamp,
                ])

        return compressed

    def compress_orders(self, orders: dict[Symbol, list[Order]]) -> list[list[Any]]:
        compressed = []
        for arr in orders.values():
            for order in arr:
                compressed.append([order.symbol, order.price, order.quantity])

        return compressed

logger = Logger()

class Trader:
    def run(self, state: TradingState) -> dict[Symbol, list[Order]]:
        orders = {}

        # TODO: Add logic

        logger.flush(state, orders)
        return orders
  `.trim();

  return (
    <Container>
      <Stack mb="md">
        <HomeCard title="Welcome!">
          {/* prettier-ignore */}
          <Text>
            IMC Prosperity Visualizer is a visualizer for <a href={`https://prosperity.imc.com/`} target="_blank" rel="noreferrer">IMC Prosperity</a> algorithms.
            Its source code is available in the <a href={`https://github.com/jmerle/imc-prosperity-visualizer`} target="_blank" rel="noreferrer">jmerle/imc-prosperity-visualizer</a> GitHub repository.
            Load an algorithm below to get started.
          </Text>
        </HomeCard>

        <HomeCard title="Prerequisites">
          <Text>
            IMC Prosperity Visualizer assumes your algorithm logs in a certain format. Algorithms that use a different
            logging format may cause unexpected errors when opening them in the visualizer. Please use the following
            boilerplate for your algorithm (or adapt your algorithm to use the logger from this code) and use{' '}
            <Code>logger.print()</Code> where you would normally use <Code>print()</Code>:
            <Prism withLineNumbers language="python" scrollAreaComponent={PrismScrollArea}>
              {exampleCode}
            </Prism>
          </Text>
        </HomeCard>

        <LoadFromFile />
        <LoadFromProsperity />
      </Stack>
    </Container>
  );
}
