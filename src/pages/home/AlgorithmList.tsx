import { Accordion, Text } from '@mantine/core';
import { AlgorithmSummary } from '../../models';
import { AlgorithmDetail } from './AlgorithmDetail';

export interface AlgorithmListProps {
  algorithms: AlgorithmSummary[];
}

export function AlgorithmList({ algorithms }: AlgorithmListProps): JSX.Element {
  if (algorithms.length === 0) {
    return <Text mt="md">No algorithms found</Text>;
  }

  return (
    <Accordion variant="contained" defaultValue={algorithms[0].id} mt="md">
      {algorithms.map((algorithm, i) => (
        <AlgorithmDetail key={i} position={algorithms.length - i} algorithm={algorithm} />
      ))}
    </Accordion>
  );
}
