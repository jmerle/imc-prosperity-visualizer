import { Center, createStyles, Grid, Title } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import Highcharts from 'highcharts';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import HighchartsHighContrastDarkTheme from 'highcharts/themes/high-contrast-dark';
import HighchartsHighContrastLightTheme from 'highcharts/themes/high-contrast-light';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store';
import { formatNumber } from '../../utils/format';
import { AlgorithmSummaryCard } from './AlgorithmSummaryCard';
import { PositionChart } from './PositionChart';
import { PriceChart } from './PriceChart';
import { ProfitLossChart } from './ProfitLossChart';
import { SandboxLogsCard } from './SandboxLogsCard';
import { SubmissionLogsCard } from './SubmissionLogsCard';
import { VolumeChart } from './VolumeChart';

HighchartsAccessibility(Highcharts);
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

const useStyles = createStyles(theme => ({
  container: {
    margin: '0 auto',
    width: '1500px',

    [theme.fn.smallerThan(1500)]: {
      width: '100%',
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
    },
  },
}));

export function VisualizerPage(): JSX.Element {
  const { classes } = useStyles();

  const algorithm = useStore(state => state.algorithm);

  // When you switch from light to dark everything's fine
  // When you switch from dark to light it looks weird since the light theme sets fewer properties than the dark theme
  // This leads to some of the dark theme's properties staying active
  // We therefore only set the theme once, and require a page refresh to update the themes of the charts
  const theme = useStore(state => state.theme);
  const preferredColorScheme = useColorScheme();
  const colorScheme = theme === 'system' ? preferredColorScheme : theme;
  HighchartsHighContrastLightTheme(Highcharts);
  if (colorScheme === 'dark') {
    HighchartsHighContrastDarkTheme(Highcharts);
  }

  if (algorithm === null) {
    return <Navigate to="/" />;
  }

  let profitLoss = 0;
  const lastTimestamp = algorithm.activityLogs[algorithm.activityLogs.length - 1].timestamp;
  for (let i = algorithm.activityLogs.length - 1; i >= 0 && algorithm.activityLogs[i].timestamp == lastTimestamp; i--) {
    profitLoss += algorithm.activityLogs[i].profitLoss;
  }

  const symbolColumns: JSX.Element[] = [];
  Object.keys(algorithm.sandboxLogs[0].state.listings)
    .sort((a, b) => a.localeCompare(b))
    .forEach((symbol, i) => {
      symbolColumns.push(
        <Grid.Col key={i * 2} xs={12} sm={6}>
          <PriceChart symbol={symbol} />
        </Grid.Col>,
      );

      symbolColumns.push(
        <Grid.Col key={i * 2 + 1} xs={12} sm={6}>
          <VolumeChart symbol={symbol} />
        </Grid.Col>,
      );
    });

  return (
    <div className={classes.container}>
      <Grid columns={12}>
        <Grid.Col span={12}>
          <Center>
            <Title order={2}>Final Profit / Loss: {formatNumber(profitLoss)}</Title>
          </Center>
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <ProfitLossChart />
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <PositionChart />
        </Grid.Col>
        {symbolColumns}
        <Grid.Col span={12}>
          <SandboxLogsCard />
        </Grid.Col>
        <Grid.Col span={12}>
          <SubmissionLogsCard />
        </Grid.Col>
        {algorithm.summary && (
          <Grid.Col span={12}>
            <AlgorithmSummaryCard />
          </Grid.Col>
        )}
      </Grid>
    </div>
  );
}
