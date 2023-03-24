import Highcharts from 'highcharts';
import { Product } from '../../models';
import { useStore } from '../../store';
import { Chart } from './Chart';

export interface ObservationChartProps {
  product: Product;
}

export function ObservationChart({ product }: ObservationChartProps): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const series: Highcharts.SeriesOptionsType[] = [
    {
      type: 'line',
      name: 'Value',
      data: algorithm.sandboxLogs.map(row => [row.state.timestamp, row.state.observations[product]]),
    },
  ];

  return <Chart title={product} series={series} />;
}
