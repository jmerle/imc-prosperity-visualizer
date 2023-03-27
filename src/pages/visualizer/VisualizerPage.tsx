import { Center, createStyles, Grid, Title } from '@mantine/core';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { formatNumber } from '../../utils/format';
import { AlgorithmSummaryCard } from './AlgorithmSummaryCard';
import { ObservationChart } from './ObservationChart';
import { PositionChart } from './PositionChart';
import { PriceChart } from './PriceChart';
import { ProfitLossChart } from './ProfitLossChart';
import { SandboxLogsCard } from './SandboxLogsCard';
import { SubmissionLogsCard } from './SubmissionLogsCard';
import { VolumeChart } from './VolumeChart';

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

  const { search } = useLocation();

  if (algorithm === null) {
    return <Navigate to={`/${search}`} />;
  }

  let profitLoss = 0;
  const lastTimestamp = algorithm.activityLogs[algorithm.activityLogs.length - 1].timestamp;
  for (let i = algorithm.activityLogs.length - 1; i >= 0 && algorithm.activityLogs[i].timestamp == lastTimestamp; i--) {
    profitLoss += algorithm.activityLogs[i].profitLoss;
  }

  const symbolColumns: JSX.Element[] = [];
  Object.keys(algorithm.sandboxLogs[0].state.listings)
    .filter(key => algorithm.sandboxLogs[0].state.observations[key] === undefined)
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

  const observationColumns = Object.keys(algorithm.sandboxLogs[0].state.observations)
    .sort((a, b) => a.localeCompare(b))
    .map((product, i) => (
      <Grid.Col key={i} xs={12} sm={6}>
        <ObservationChart product={product} />
      </Grid.Col>
    ));

  if (observationColumns.length % 2 > 0) {
    observationColumns.push(<Grid.Col key={observationColumns.length} span="auto" />);
  }

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
        {observationColumns}
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
