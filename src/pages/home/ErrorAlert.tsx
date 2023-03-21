import { Alert, AlertProps } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export interface ErrorAlertProps extends Partial<AlertProps> {
  error: Error;
}

export function ErrorAlert({ error, ...alertProps }: ErrorAlertProps): JSX.Element {
  return (
    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" {...alertProps}>
      {error.message}
    </Alert>
  );
}
