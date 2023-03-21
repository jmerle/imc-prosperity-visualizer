import { Table, Text } from '@mantine/core';

export interface SimpleTableProps {
  label: string;
  columns: string[];
  rows: JSX.Element[];
}

export function SimpleTable({ label, columns, rows }: SimpleTableProps): JSX.Element {
  if (rows.length === 0) {
    return <Text>Timestamp has no {label}</Text>;
  }

  return (
    <Table withColumnBorders horizontalSpacing={8} verticalSpacing={4}>
      <thead>
        <tr>
          {columns.map((column, i) => (
            <th key={i}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
