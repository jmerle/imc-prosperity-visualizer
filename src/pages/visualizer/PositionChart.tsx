import Highcharts from 'highcharts';
import { Algorithm, ProsperitySymbol } from '../../models';
import { useStore } from '../../store';
import { Chart } from './Chart';

function getLimit(algorithm: Algorithm, symbol: ProsperitySymbol): number {
  const knownLimits: Record<string, number> = {
    PEARLS: 20,
    BANANAS: 20,
    COCONUTS: 600,
    PINA_COLADAS: 300,
    DIVING_GEAR: 50,
    BERRIES: 250,
    BAGUETTE: 150,
    DIP: 300,
    UKULELE: 70,
    PICNIC_BASKET: 70,
  };

  if (knownLimits[symbol] !== undefined) {
    return knownLimits[symbol];
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

  const symbols = Object.keys(algorithm.sandboxLogs[0].state.listings)
    .filter(key => algorithm.sandboxLogs[0].state.observations[key] === undefined)
    .sort((a, b) => a.localeCompare(b));

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
