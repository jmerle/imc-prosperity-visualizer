import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatNumber } from '../../utils/format';
import { VisualizerCard } from './VisualizerCard';

interface ChartProps {
  title: string;
  series: Highcharts.SeriesOptionsType[];
}

export function Chart({ title, series }: ChartProps): JSX.Element {
  const options: Highcharts.Options = {
    chart: {
      height: 400,
      zooming: {
        type: 'x',
      },
      panning: {
        enabled: true,
        type: 'x',
      },
      panKey: 'shift',
      numberFormatter: formatNumber,
    },
    title: {
      text: title,
    },
    credits: {
      href: 'javascript:window.open("https://www.highcharts.com/?credits", "_blank")',
    },
    exporting: {
      sourceWidth: 1600,
      sourceHeight: 800,
      allowHTML: true,
    },
    xAxis: {
      type: 'linear',
      title: {
        text: 'Timestamp',
      },
      crosshair: {
        width: 1,
      },
    },
    yAxis: {
      allowDecimals: false,
    },
    tooltip: {
      split: true,
      valueDecimals: 0,
    },
    series,
  };

  return (
    <VisualizerCard p={0}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </VisualizerCard>
  );
}
