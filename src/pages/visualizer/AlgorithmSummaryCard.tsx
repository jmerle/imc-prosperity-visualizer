import { Button, Grid, Group, Text, Title } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { format } from 'date-fns';
import { useStore } from '../../store';
import { downloadAlgorithmResults } from '../../utils/algorithm';
import { useAsync } from '../../utils/async';
import { PrismScrollArea } from '../base/PrismScrollArea';
import { VisualizerCard } from './VisualizerCard';

export function AlgorithmSummaryCard(): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;
  const summary = algorithm.summary!;

  const timestamp = format(Date.parse(summary.timestamp), 'yyyy-MM-dd HH:mm:ss');

  const downloadResults = useAsync<void>(async () => {
    await downloadAlgorithmResults(summary.id);
  });

  return (
    <VisualizerCard title="Algorithm summary">
      <Grid columns={12}>
        <Grid.Col xs={12} sm={3}>
          <Title order={5}>Id</Title>
          <Text>{summary.id}</Text>
        </Grid.Col>
        <Grid.Col xs={12} sm={3}>
          <Title order={5}>File name</Title>
          <Text>{summary.fileName}</Text>
        </Grid.Col>
        <Grid.Col xs={12} sm={3}>
          <Title order={5}>Submitted at</Title>
          <Text>{timestamp}</Text>
        </Grid.Col>
        <Grid.Col xs={12} sm={3}>
          <Title order={5}>Submitted by</Title>
          <Text>
            {summary.user.firstName} {summary.user.lastName}
          </Text>
        </Grid.Col>
        <Grid.Col xs={12} sm={3}>
          <Title order={5}>Status</Title>
          <Text>{summary.status}</Text>
        </Grid.Col>
        <Grid.Col xs={12} sm={3}>
          <Title order={5}>Round</Title>
          <Text>{summary.round}</Text>
        </Grid.Col>
        <Grid.Col xs={12} sm={3}>
          <Title order={5}>Selected for round</Title>
          <Text>{summary.selectedForRound ? 'Yes' : 'No'}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Title order={5}>Content</Title>
          <Prism withLineNumbers language="python" scrollAreaComponent={PrismScrollArea}>
            {summary.content}
          </Prism>
        </Grid.Col>
        <Grid.Col span={12}>
          <Group grow>
            <Button
              variant="outline"
              component="a"
              href={`https://bz97lt8b1e.execute-api.eu-west-1.amazonaws.com/prod/submission/logs/${summary.id}`}
              download
              target="_blank"
              rel="noreferrer"
            >
              Download logs
            </Button>
            <Button variant="outline" onClick={downloadResults.call} loading={downloadResults.loading}>
              Download results
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </VisualizerCard>
  );
}
