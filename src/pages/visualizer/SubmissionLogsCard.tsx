import { Prism } from '@mantine/prism';
import { useStore } from '../../store';
import { PrismScrollArea } from '../base/PrismScrollArea';
import { VisualizerCard } from './VisualizerCard';

export function SubmissionLogsCard(): JSX.Element {
  const algorithm = useStore(state => state.algorithm)!;

  if (algorithm.submissionLogs === '') {
    return <VisualizerCard title="Submission logs">Algorithm has no submission logs</VisualizerCard>;
  }

  return (
    <VisualizerCard title="Submission logs">
      <Prism withLineNumbers language="markdown" scrollAreaComponent={PrismScrollArea}>
        {algorithm.submissionLogs}
      </Prism>
    </VisualizerCard>
  );
}
