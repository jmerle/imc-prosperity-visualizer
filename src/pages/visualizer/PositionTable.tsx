import { TradingState } from '../../models';
import { getAskColor, getBidColor } from '../../utils/colors';
import { formatNumber } from '../../utils/format';
import { SimpleTable } from './SimpleTable';

export interface PositionTableProps {
  position: TradingState['position'];
}

export function PositionTable({ position }: PositionTableProps): JSX.Element {
  const rows: JSX.Element[] = [];
  for (const product of Object.keys(position)) {
    if (position[product] === 0) {
      continue;
    }

    const colorFunc = position[product] > 0 ? getBidColor : getAskColor;

    rows.push(
      <tr key={product} style={{ backgroundColor: colorFunc(0.1) }}>
        <td>{product}</td>
        <td>{formatNumber(position[product])}</td>
      </tr>,
    );
  }

  return <SimpleTable label="positions" columns={['Product', 'Position']} rows={rows} />;
}
