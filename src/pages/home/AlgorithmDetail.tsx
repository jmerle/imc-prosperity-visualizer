import { Accordion, Button, Group, MantineColor, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import defaultAxios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AlgorithmSummary, ResultRow, SandboxLogRow } from '../../models';
import { useStore } from '../../store';
import { downloadAlgorithmResults } from '../../utils/algorithm';
import { useAsync } from '../../utils/async';
import { createAxios } from '../../utils/axios';
import { PrismScrollArea } from '../base/PrismScrollArea';
import { ErrorAlert } from './ErrorAlert';

function getColumnValues(columns: string[], indices: number[]): number[] {
  const values: number[] = [];

  for (const index of indices) {
    const value = columns[index];
    if (value !== '') {
      values.push(Number(value));
    }
  }

  return values;
}

function getResults(resultLines: string[]): ResultRow[] {
  const results: ResultRow[] = [];

  for (let i = 1; i < resultLines.length; i++) {
    const columns = resultLines[i].split(';');
    results.push({
      day: Number(columns[0]),
      timestamp: Number(columns[1]),
      product: columns[2],
      bidPrices: getColumnValues(columns, [3, 5, 7]),
      bidVolumes: getColumnValues(columns, [4, 6, 8]),
      askPrices: getColumnValues(columns, [9, 11, 13]),
      askVolumes: getColumnValues(columns, [10, 12, 14]),
      midPrice: Number(columns[15]),
      profitLoss: Number(columns[16]),
    });
  }

  return results;
}

function getSandboxLogs(logLines: string[]): SandboxLogRow[] {
  const headerIndex = logLines.indexOf('Sandbox logs:');
  if (headerIndex === -1) {
    return [];
  }

  const rows: SandboxLogRow[] = [];
  for (let i = headerIndex + 1; i < logLines.length; i++) {
    const line = logLines[i];
    if (line.endsWith(':')) {
      break;
    }

    if (line.startsWith('{')) {
      rows.push(JSON.parse(line));
      continue;
    }

    if (line.length === 0 || line.endsWith(' ') || !/\d/.test(line[0])) {
      continue;
    }

    const unparsed = line.substring(line.indexOf(' ') + 1);
    if (unparsed[0] !== '{') {
      continue;
    }

    rows.push(JSON.parse(unparsed));
  }

  return rows;
}

function getSubmissionLogs(logLines: string[]): string {
  const headerIndex = logLines.indexOf('Submission logs:');
  if (headerIndex === -1) {
    return '';
  }

  return logLines.slice(headerIndex + 1).join('\n');
}

export interface AlgorithmDetailProps {
  position: number;
  algorithm: AlgorithmSummary;
}

export function AlgorithmDetail({ position, algorithm }: AlgorithmDetailProps): JSX.Element {
  const corsProxy = useStore(state => state.corsProxy);
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

    const detailsResponse = await axios.get(
      `https://bz97lt8b1e.execute-api.eu-west-1.amazonaws.com/prod/results/tutorial/${algorithm.id}`,
    );

    const resultsUrl = JSON.parse(detailsResponse.data).algo.summary.activitiesLog;
    const resultsResponse = await defaultAxios.get(corsProxy + resultsUrl);

    const logsResponse = await axios.get(
      `https://bz97lt8b1e.execute-api.eu-west-1.amazonaws.com/prod/submission/logs/${algorithm.id}`,
    );

    const resultLines = resultsResponse.data.trim().split('\n') as string[];
    const logLines = logsResponse.data.trim().split('\n') as string[];

    const results = getResults(resultLines);
    const sandboxLogs = getSandboxLogs(logLines);
    const submissionLogs = getSubmissionLogs(logLines);

    if (sandboxLogs.length === 0) {
      throw new Error('Sandbox logs are in invalid format, please see the prerequisites section above.');
    }

    setAlgorithm({ summary: algorithm, results, sandboxLogs, submissionLogs });
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
