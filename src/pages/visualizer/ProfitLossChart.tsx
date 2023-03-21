import Highcharts from 'highcharts';
import { useStore } from '../../store';
import { Chart } from './Chart';

export function ProfitLossChart(): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const dataByTimestamp = new Map<number, number>();
  for (const row of algorithm.activityLogs) {
    if (!dataByTimestamp.has(row.timestamp)) {
      dataByTimestamp.set(row.timestamp, row.profitLoss);
    } else {
      dataByTimestamp.set(row.timestamp, dataByTimestamp.get(row.timestamp)! + row.profitLoss);
    }
  }

  const series: Highcharts.SeriesOptionsType[] = [
    {
      type: 'line',
      name: 'Total',
      data: [...dataByTimestamp.keys()].map(timestamp => [timestamp, dataByTimestamp.get(timestamp)]),
    },
  ];

  Object.keys(algorithm.sandboxLogs[0].state.listings)
    .sort((a, b) => a.localeCompare(b))
    .forEach(symbol => {
      const data = [];

      for (const row of algorithm.activityLogs) {
        if (row.product === symbol) {
          data.push([row.timestamp, row.profitLoss]);
        }
      }

      series.push({
        type: 'line',
        name: symbol,
        data,
        dashStyle: 'Dot',
      });
    });

  return <Chart title="Profit / Loss" series={series} />;
}
