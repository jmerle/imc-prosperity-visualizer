import { ProsperitySymbol, Trade } from '../../models';
import { getAskColor, getBidColor } from '../../utils/colors';
import { formatNumber } from '../../utils/format';
import { SimpleTable } from './SimpleTable';

export interface TradeTableProps {
  trades: Record<ProsperitySymbol, Trade[]>;
}

export function TradeTable({ trades }: TradeTableProps): JSX.Element {
  const rows: JSX.Element[] = [];
  for (const symbol of Object.keys(trades)) {
    for (let i = 0; i < trades[symbol].length; i++) {
      const trade = trades[symbol][i];

      let type: string;
      let color: string;

      if (trade.buyer !== '') {
        type = 'Buy';
        color = getBidColor(0.1);
      } else if (trade.seller !== '') {
        type = 'Sell';
        color = getAskColor(0.1);
      } else {
        type = 'Unknown';
        color = 'transparent';
      }

      rows.push(
        <tr key={`${symbol}-${i}`} style={{ backgroundColor: color }}>
          <td>{trade.symbol}</td>
          <td>{type}</td>
          <td>{formatNumber(trade.price)}</td>
          <td>{formatNumber(trade.quantity)}</td>
          <td>{formatNumber(trade.timestamp)}</td>
        </tr>,
      );
    }
  }

  return <SimpleTable label="trades" columns={['Symbol', 'Type', 'Price', 'Quantity', 'Timestamp']} rows={rows} />;
}
