import { Grid, Text, Title } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { SandboxLogRow } from '../../models';
import { useStore } from '../../store';
import { formatNumber } from '../../utils/format';
import { PrismScrollArea } from '../base/PrismScrollArea';
import { ListingTable } from './ListingTable';
import { OrderDepthTable } from './OrderDepthTable';
import { OrderTable } from './OrderTable';
import { PositionTable } from './PositionTable';
import { TradeTable } from './TradeTable';

export interface SandboxLogDetailProps {
  row: SandboxLogRow;
}

export function SandboxLogDetail({ row: { state, orders, logs } }: SandboxLogDetailProps): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const resultRow = algorithm.results.find(row => row.timestamp === state.timestamp);
  const profitLoss = resultRow ? ` • Profit / Loss: ${formatNumber(resultRow.profitLoss)}` : '';

  return (
    <Grid columns={12}>
      <Grid.Col span={12}>
        <Title order={5}>
          Timestamp {formatNumber(state.timestamp)}
          {profitLoss}
        </Title>
      </Grid.Col>
      <Grid.Col xs={12} sm={6}>
        <Title order={5}>Listings</Title>
        <ListingTable listings={state.listings} />
      </Grid.Col>
      <Grid.Col xs={12} sm={6}>
        <Title order={5}>Positions</Title>
        <PositionTable position={state.position} />
      </Grid.Col>
      {Object.keys(state.order_depths).map((symbol, i) => (
        <Grid.Col key={i} xs={12} sm={6}>
          <Title order={5}>{symbol} order depth</Title>
          <OrderDepthTable orderDepth={state.order_depths[symbol]} />
        </Grid.Col>
      ))}
      {Object.keys(state.order_depths).length % 2 === 1 && <Grid.Col span="auto" />}
      <Grid.Col xs={12} sm={6}>
        <Title order={5}>Own trades</Title>
        {<TradeTable trades={state.own_trades} />}
      </Grid.Col>
      <Grid.Col xs={12} sm={6}>
        <Title order={5}>Market trades</Title>
        {<TradeTable trades={state.market_trades} />}
      </Grid.Col>
      <Grid.Col xs={12} sm={6}>
        <Title order={5}>Orders</Title>
        {<OrderTable orders={orders} />}
      </Grid.Col>
      <Grid.Col xs={12} sm={6}>
        <Title order={5}>Logs</Title>
        {logs ? (
          <Prism withLineNumbers language="markdown" scrollAreaComponent={PrismScrollArea}>
            {logs}
          </Prism>
        ) : (
          <Text>Timestamp has no logs</Text>
        )}
      </Grid.Col>
    </Grid>
  );
}