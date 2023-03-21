import { TradingState } from '../../models';
import { SimpleTable } from './SimpleTable';

export interface ListingTableProps {
  listings: TradingState['listings'];
}

export function ListingTable({ listings }: ListingTableProps): JSX.Element {
  const rows: JSX.Element[] = [];
  for (const symbol of Object.keys(listings)) {
    const listing = listings[symbol];

    rows.push(
      <tr key={symbol}>
        <td>{listing.symbol}</td>
        <td>{listing.product}</td>
        <td>{listing.denomination}</td>
      </tr>,
    );
  }

  return <SimpleTable label="listings" columns={['Symbol', 'Product', 'Denomination']} rows={rows} />;
}
