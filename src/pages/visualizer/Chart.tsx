import { useMantineTheme } from '@mantine/core';
import Highcharts from 'highcharts';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import HighchartsHighContrastDarkTheme from 'highcharts/themes/high-contrast-dark';
import HighchartsReact from 'highcharts-react-official';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import { formatNumber } from '../../utils/format';
import { VisualizerCard } from './VisualizerCard';

HighchartsAccessibility(Highcharts);
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

// Highcharts themes are distributed as Highcharts extensions
// The normal way to use them is to apply these extensions to the global Highcharts object
// However, themes work by overriding the default options, with no way to rollback
// To make theme switching work, we merge theme options into the local chart options instead
// This way we don't override the global defaults and can change themes without refreshing
// This function is a little workaround to be able to get the options a theme overrides
function getThemeOptions(theme: (highcharts: typeof Highcharts) => void): Highcharts.Options {
  const highchartsMock = {
    _modules: {
      'Core/Globals.js': {
        theme: null,
      },
      'Core/Defaults.js': {
        setOptions: () => {
          // Do nothing
        },
      },
    },
  };

  theme(highchartsMock as any);

  return highchartsMock._modules['Core/Globals.js'].theme! as Highcharts.Options;
}

interface ChartProps {
  title: string;
  series: Highcharts.SeriesOptionsType[];
}

export function Chart({ title, series }: ChartProps): JSX.Element {
  const theme = useMantineTheme();

  const options = useMemo((): Highcharts.Options => {
    const themeOptions = theme.colorScheme === 'light' ? {} : getThemeOptions(HighchartsHighContrastDarkTheme);

    const chartOptions: Highcharts.Options = {
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

    return merge(themeOptions, chartOptions);
  }, [theme]);

  return (
    <VisualizerCard p={0}>
      <HighchartsReact highcharts={Highcharts} options={options} immutable={true} />
    </VisualizerCard>
  );
}
