import Highcharts from 'highcharts';
import { useStore } from '../../store';
import { Chart } from './Chart';

export function PositionChart(): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const symbols = Object.keys(algorithm.sandboxLogs[0].state.listings).sort((a, b) => a.localeCompare(b));

  const data: Record<string, [number, number][]> = {};
  for (const symbol of symbols) {
    data[symbol] = [];
  }

  for (const row of algorithm.sandboxLogs) {
    for (const symbol of symbols) {
      data[symbol].push([row.state.timestamp, row.state.position[symbol] || 0]);
    }
  }

  const series: Highcharts.SeriesOptionsType[] = symbols.map(symbol => ({
    type: 'line',
    name: symbol,
    data: data[symbol],
  }));

  return <Chart title="Positions" series={series} />;
}
