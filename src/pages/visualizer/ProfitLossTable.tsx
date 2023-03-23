import { useStore } from '../../store';
import { getAskColor, getBidColor } from '../../utils/colors';
import { formatNumber } from '../../utils/format';
import { SimpleTable } from './SimpleTable';

export interface ProfitLossTableProps {
  timestamp: number;
}

export function ProfitLossTable({ timestamp }: ProfitLossTableProps): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const rows: JSX.Element[] = algorithm.activityLogs
    .filter(row => row.timestamp === timestamp)
    .sort((a, b) => a.product.localeCompare(b.product))
    .map(row => {
      let colorFunc: (alpha: number) => string = () => 'transparent';
      if (row.profitLoss > 0) {
        colorFunc = getBidColor;
      } else if (row.profitLoss < 0) {
        colorFunc = getAskColor;
      }

      return (
        <tr key={row.product} style={{ backgroundColor: colorFunc(0.1) }}>
          <td>{row.product}</td>
          <td>{formatNumber(row.profitLoss)}</td>
        </tr>
      );
    });

  return <SimpleTable label="profit / loss" columns={['Product', 'Profit / Loss']} rows={rows} />;
}
