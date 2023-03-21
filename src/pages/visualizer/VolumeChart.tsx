import Highcharts from 'highcharts';
import { ProsperitySymbol } from '../../models';
import { useStore } from '../../store';
import { getAskColor, getBidColor } from '../../utils/colors';
import { Chart } from './Chart';

export interface VolumeChartProps {
  symbol: ProsperitySymbol;
}

export function VolumeChart({ symbol }: VolumeChartProps): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const series: Highcharts.SeriesOptionsType[] = [
    { type: 'column', name: 'Bid 3', color: getBidColor(0.5), data: [] },
    { type: 'column', name: 'Bid 2', color: getBidColor(0.75), data: [] },
    { type: 'column', name: 'Bid 1', color: getBidColor(1.0), data: [] },
    { type: 'column', name: 'Ask 1', color: getAskColor(1.0), data: [] },
    { type: 'column', name: 'Ask 2', color: getAskColor(0.75), data: [] },
    { type: 'column', name: 'Ask 3', color: getAskColor(0.5), data: [] },
  ];

  for (const row of algorithm.results) {
    if (row.product !== symbol) {
      continue;
    }

    for (let i = 0; i < row.bidVolumes.length; i++) {
      (series[2 - i] as any).data.push([row.timestamp, row.bidVolumes[i]]);
    }

    for (let i = 0; i < row.askVolumes.length; i++) {
      (series[i + 3] as any).data.push([row.timestamp, row.askVolumes[i]]);
    }
  }

  return <Chart title={`${symbol} (volume)`} series={series} />;
}
