import { SandboxLogRow } from '../../models';
import { getAskColor, getBidColor } from '../../utils/colors';
import { formatNumber } from '../../utils/format';
import { SimpleTable } from './SimpleTable';

export interface OrderTableProps {
  orders: SandboxLogRow['orders'];
}

export function OrderTable({ orders }: OrderTableProps): JSX.Element {
  const rows: JSX.Element[] = [];
  for (const symbol of Object.keys(orders)) {
    for (let i = 0; i < orders[symbol].length; i++) {
      const order = orders[symbol][i];

      const colorFunc = order.quantity > 0 ? getBidColor : getAskColor;

      rows.push(
        <tr key={`${symbol}-${i}`} style={{ background: colorFunc(0.1) }}>
          <td>{order.symbol}</td>
          <td>{order.quantity > 0 ? 'Buy' : 'Sell'}</td>
          <td>{formatNumber(order.price)}</td>
          <td>{formatNumber(Math.abs(order.quantity))}</td>
        </tr>,
      );
    }
  }

  return <SimpleTable label="orders" columns={['Symbol', 'Type', 'Price', 'Quantity']} rows={rows} />;
}
