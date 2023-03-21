import { Paper, PaperProps, Title } from '@mantine/core';

interface VisualizerCardProps extends PaperProps {
  title?: string;
}

export function VisualizerCard({ title, children, ...paperProps }: VisualizerCardProps): JSX.Element {
  return (
    <Paper withBorder shadow="xs" p={'md'} {...paperProps}>
      {title && (
        <Title order={4} mb="xs">
          {title}
        </Title>
      )}

      {children}
    </Paper>
  );
}
