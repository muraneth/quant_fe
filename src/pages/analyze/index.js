/* eslint-disable no-unused-vars */

import AraeChart from './AreaChart';
import ExchangeBalanceChart from './ExchangeChart';
import NUPLChart from './NUPLChart';
import SumInfoChart from './SumInfoChart';
import TokenProfitAndLossChart from './TokenProfitAndLossChart';
import WalletChart from './WalletChart';
import MVRVChart from './MVRVChart';

export default function AnalyzePage() {
  return (
    <div>
      <h1>AnalyzePage</h1>
      <AraeChart lower_balance={10} upper_balance={100000000000} />
      <AraeChart lower_balance={1000000} upper_balance={10000000} />
      <AraeChart lower_balance={10000000} upper_balance={100000000} />
      <AraeChart lower_balance={100000000} upper_balance={1000000000} />
      ---
      <WalletChart />
      <SumInfoChart />
      <div>NUPL</div>
      <NUPLChart />
      --MVRV--
      <MVRVChart />
      <TokenProfitAndLossChart />
      -- exchange --
      <ExchangeBalanceChart />
    </div>
  );
}
