import { Table, Text } from '@mantine/core';
import { OrderDepth } from '../../models';
import { getAskColor, getBidColor } from '../../utils/colors';
import { formatNumber } from '../../utils/format';
import { OrderDepthTableSpreadRow } from './OrderDepthTableSpreadRow';

export interface OrderDepthTableProps {
  orderDepth: OrderDepth;
}

export function OrderDepthTable({ orderDepth }: OrderDepthTableProps): JSX.Element {
  const rows: JSX.Element[] = [];

  const askPrices = Object.keys(orderDepth.sell_orders)
    .map(Number)
    .sort((a, b) => b - a);
  const bidPrices = Object.keys(orderDepth.buy_orders)
    .map(Number)
    .sort((a, b) => b - a);

  for (let i = 0; i < askPrices.length; i++) {
    const price = askPrices[i];

    if (i > 0 && askPrices[i - 1] - price > 1) {
      rows.push(<OrderDepthTableSpreadRow key={`${price}-spread`} spread={askPrices[i - 1] - price} />);
    }

    rows.push(
      <tr key={price}>
        <td></td>
        <td style={{ textAlign: 'center' }}>{formatNumber(price)}</td>
        <td style={{ backgroundColor: getAskColor(0.1) }}>{formatNumber(Math.abs(orderDepth.sell_orders[price]))}</td>
      </tr>,
    );
  }

  if (askPrices.length > 0 && bidPrices.length > 0) {
    rows.push(<OrderDepthTableSpreadRow key="spread" spread={askPrices[askPrices.length - 1] - bidPrices[0]} />);
  }

  for (let i = 0; i < bidPrices.length; i++) {
    const price = bidPrices[i];

    if (i > 0 && bidPrices[i - 1] - price > 1) {
      rows.push(<OrderDepthTableSpreadRow key={`${price}-spread`} spread={bidPrices[i - 1] - price} />);
    }

    rows.push(
      <tr key={price}>
        <td style={{ backgroundColor: getBidColor(0.1), textAlign: 'right' }}>
          {formatNumber(orderDepth.buy_orders[price])}
        </td>
        <td style={{ textAlign: 'center' }}>{formatNumber(price)}</td>
        <td></td>
      </tr>,
    );
  }

  if (rows.length === 0) {
    return <Text>Timestamp has no order depth</Text>;
  }

  return (
    <Table withColumnBorders horizontalSpacing={8} verticalSpacing={4}>
      <thead>
        <tr>
          <th style={{ textAlign: 'right' }}>Bid volume</th>
          <th style={{ textAlign: 'center' }}>Price</th>
          <th>Ask volume</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
