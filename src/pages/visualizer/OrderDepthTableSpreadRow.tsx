import { formatNumber } from '../../utils/format';

export interface OrderDepthTableSpreadRowProps {
  spread: number;
}

export function OrderDepthTableSpreadRow({ spread }: OrderDepthTableSpreadRowProps): JSX.Element {
  return (
    <tr>
      <td></td>
      <td style={{ textAlign: 'center' }}>↑ {formatNumber(spread)} ↓</td>
      <td></td>
    </tr>
  );
}
