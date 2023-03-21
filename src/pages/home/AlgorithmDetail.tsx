import { Accordion, Button, Group, MantineColor, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AlgorithmSummary } from '../../models';
import { useStore } from '../../store';
import { downloadAlgorithmResults, parseAlgorithmLogs } from '../../utils/algorithm';
import { useAsync } from '../../utils/async';
import { createAxios } from '../../utils/axios';
import { PrismScrollArea } from '../base/PrismScrollArea';
import { ErrorAlert } from './ErrorAlert';

export interface AlgorithmDetailProps {
  position: number;
  algorithm: AlgorithmSummary;
}

export function AlgorithmDetail({ position, algorithm }: AlgorithmDetailProps): JSX.Element {
  const setAlgorithm = useStore(state => state.setAlgorithm);

  const navigate = useNavigate();

  const timestamp = format(Date.parse(algorithm.timestamp), 'yyyy-MM-dd HH:mm:ss');

  let statusColor: MantineColor = 'primary';
  switch (algorithm.status) {
    case 'FINISHED':
      statusColor = 'green';
      break;
    case 'ERROR':
      statusColor = 'red';
      break;
  }

  const downloadResults = useAsync<void>(async () => {
    await downloadAlgorithmResults(algorithm.id);
  });

  const openInVisualizer = useAsync<void>(async () => {
    const axios = createAxios();

    const logsResponse = await axios.get(
      `https://bz97lt8b1e.execute-api.eu-west-1.amazonaws.com/prod/submission/logs/${algorithm.id}`,
    );

    setAlgorithm(parseAlgorithmLogs(logsResponse.data, algorithm));
    navigate('/visualizer');
  });

  return (
    <Accordion.Item key={algorithm.id} value={algorithm.id}>
      <Accordion.Control>
        {/* prettier-ignore */}
        <Text color={statusColor}>
          <b>{position}.</b> {algorithm.fileName} submitted at {timestamp} ({algorithm.status}) {algorithm.selectedForRound ? ' (active)' : ''}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        {openInVisualizer.error && <ErrorAlert error={openInVisualizer.error} mb="xs" />}
        <Group grow mb="xs">
          <Button
            variant="outline"
            component="a"
            href={`https://bz97lt8b1e.execute-api.eu-west-1.amazonaws.com/prod/submission/logs/${algorithm.id}`}
            download
            target="_blank"
            rel="noreferrer"
          >
            Download logs
          </Button>
          <Button variant="outline" onClick={downloadResults.call} loading={downloadResults.loading}>
            Download results
          </Button>
          {algorithm.status === 'FINISHED' && (
            <Button onClick={openInVisualizer.call} variant="outline" ml="xs" loading={openInVisualizer.loading}>
              Open in visualizer
            </Button>
          )}
        </Group>
        <Text>
          <b>Id:</b> {algorithm.id}
        </Text>
        <Text>
          <b>File name:</b> {algorithm.fileName}
        </Text>
        <Text>
          <b>Submitted at:</b> {timestamp}
        </Text>
        <Text>
          <b>Submitted by:</b> {algorithm.user.firstName} {algorithm.user.lastName}
        </Text>
        <Text>
          <b>Status:</b> {algorithm.status}
        </Text>
        <Text>
          <b>Round:</b> {algorithm.round}
        </Text>
        <Text>
          <b>Selected for round:</b> {algorithm.selectedForRound ? 'Yes' : 'No'}
        </Text>
        <Text>
          <b>Content:</b>
        </Text>
        <Prism withLineNumbers language="python" scrollAreaComponent={PrismScrollArea}>
          {algorithm.content}
        </Prism>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
