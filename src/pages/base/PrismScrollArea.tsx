import { ScrollArea } from '@mantine/core';
import { ReactNode } from 'react';

export interface PrismScrollAreaProps {
  children: ReactNode;
}

export function PrismScrollArea({ children }: PrismScrollAreaProps): JSX.Element {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <ScrollArea style={{ width: '100%', maxHeight: '300px' }}>{children}</ScrollArea>
    </div>
  );
}
