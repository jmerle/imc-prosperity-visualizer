import Highcharts from 'highcharts';
import { Algorithm, ProsperitySymbol } from '../../models';
import { useStore } from '../../store';
import { Chart } from './Chart';

function getLimit(algorithm: Algorithm, symbol: ProsperitySymbol): number {
  switch (symbol) {
    case 'PEARLS':
    case 'BANANAS':
      return 20;
    case 'COCONUTS':
      return 600;
    case 'PINA_COLADAS':
      return 300;
    case 'DIVING_GEAR':
      return 50;
    case 'BERRIES':
      return 250;
  }

  // This code will be hit when a new product is added to the competition and the visualizer isn't updated yet
  // In that case the visualizer doesn't know the real limit yet, so we make a guess based on the algorithm's positions

  const product = algorithm.sandboxLogs[0].state.listings[symbol].product;

  const positions = algorithm.sandboxLogs.map(row => row.state.position[product] || 0);
  const minPosition = Math.min(...positions);
  const maxPosition = Math.max(...positions);

  return Math.max(Math.abs(minPosition), maxPosition);
}

export function PositionChart(): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const symbols = Object.keys(algorithm.sandboxLogs[0].state.listings).sort((a, b) => a.localeCompare(b));

  const limits: Record<string, number> = {};
  for (const symbol of symbols) {
    limits[symbol] = getLimit(algorithm, symbol);
  }

  const data: Record<string, [number, number][]> = {};
  for (const symbol of symbols) {
    data[symbol] = [];
  }

  for (const row of algorithm.sandboxLogs) {
    for (const symbol of symbols) {
      const position = row.state.position[symbol] || 0;
      data[symbol].push([row.state.timestamp, (position / limits[symbol]) * 100]);
    }
  }

  const series: Highcharts.SeriesOptionsType[] = symbols.map(symbol => ({
    type: 'line',
    name: symbol,
    data: data[symbol],
  }));

  return <Chart title="Positions (% of limit)" series={series} min={-100} max={100} />;
}
