import { Slider, SliderProps, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useState } from 'react';
import { SandboxLogRow } from '../../models';
import { useStore } from '../../store';
import { formatNumber } from '../../utils/format';
import { SandboxLogDetail } from './SandboxLogDetail';
import { VisualizerCard } from './VisualizerCard';

export function SandboxLogsCard(): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  const rowsByTimestamp: Record<number, SandboxLogRow> = {};
  for (const row of algorithm.sandboxLogs) {
    rowsByTimestamp[row.state.timestamp] = row;
  }

  const timestampMin = algorithm.sandboxLogs[0].state.timestamp;
  const timestampMax = algorithm.sandboxLogs[algorithm.sandboxLogs.length - 1].state.timestamp;
  const timestampStep = algorithm.sandboxLogs[1].state.timestamp - algorithm.sandboxLogs[0].state.timestamp;

  const [timestamp, setTimestamp] = useState(timestampMin);

  const marks: SliderProps['marks'] = [];
  for (let i = timestampMin; i < timestampMax; i += 25000) {
    marks.push({
      value: i,
      label: formatNumber(i),
    });
  }

  useHotkeys([
    ['ArrowLeft', () => setTimestamp(timestamp === timestampMin ? timestamp : timestamp - timestampStep)],
    ['ArrowRight', () => setTimestamp(timestamp === timestampMax ? timestamp : timestamp + timestampStep)],
  ]);

  return (
    <VisualizerCard title="Sandbox logs">
      <Slider
        min={timestampMin}
        max={timestampMax}
        step={timestampStep}
        marks={marks}
        label={value => `Timestamp ${formatNumber(value)}`}
        value={timestamp}
        onChange={setTimestamp}
        mb="lg"
      />

      {rowsByTimestamp[timestamp] ? (
        <SandboxLogDetail row={rowsByTimestamp[timestamp]} />
      ) : (
        <Text>No logs found for timestamp {formatNumber(timestamp)}</Text>
      )}
    </VisualizerCard>
  );
}
