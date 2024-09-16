/* eslint-disable no-unused-vars */

import AraeChart from './AreaChart';
import WalletTable from './WalletTable';

import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function AnalyzePage() {
  const location = useLocation();

  const { symbol, chartId } = useParams();

  if (location.pathname.includes('/topwallet')) {
    return (
      <div>
        <h1>WalletTable</h1>
        <WalletTable />
      </div>
    );
  }

  return (
    <div>
      <h1>AnalyzePage</h1>
      <AraeChart symbol={symbol} chart={chartId ? chartId : 'mvrv'} />
    </div>
  );
}
