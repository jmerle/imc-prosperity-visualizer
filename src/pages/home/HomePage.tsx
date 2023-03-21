import { Code, Container, Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { PrismScrollArea } from '../base/PrismScrollArea';
import { HomeCard } from './HomeCard';
import { LoadFromFile } from './LoadFromFile';
import { LoadFromProsperity } from './LoadFromProsperity';

export function HomePage(): JSX.Element {
  const exampleCode = `
import json
from datamodel import Order, ProsperityEncoder, TradingState, Symbol
from typing import Any

class Logger:
    def __init__(self) -> None:
        self.logs = ""

    def print(self, *objects: Any, sep: str = " ", end: str = "\\n") -> None:
        self.logs += sep.join(map(str, objects)) + end

    def flush(self, state: TradingState, orders: dict[Symbol, list[Order]]) -> None:
        logs = self.logs
        if logs.endswith("\\n"):
            logs = logs[:-1]

        print(json.dumps({
            "state": state,
            "orders": orders,
            "logs": logs,
        }, cls=ProsperityEncoder, separators=(",", ":"), sort_keys=True))

        self.state = None
        self.orders = {}
        self.logs = ""

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
