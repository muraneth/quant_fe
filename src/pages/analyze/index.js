/* eslint-disable no-unused-vars */

import AraeChart from './AreaChart';
import WalletTable from './WalletTable';
import AraeChart2 from './AreaChart2';
import PriceVolumeChart from './PriceVolumeChart';
import VolumeChart from './VolumeChart';
import MultiChart from './MultiChart';

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
  if (location.pathname.includes('/PriceByVolume')) {
    return (
      <div>
        <h1>AreaChart</h1>
        <PriceVolumeChart symbol={symbol} path={'pbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/walletPriceByVolume')) {
    return (
      <div>
        <h1>AreaChart</h1>
        <PriceVolumeChart symbol={symbol} path={'walletPbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/USDPnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={symbol} usd={'Usd'} />
      </div>
    );
  }
  if (location.pathname.includes('/PnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={symbol} usd={''} />
      </div>
    );
  }
  if (location.pathname.includes('/MultiChart')) {
    return (
      <div>
        <h1>MultiChart</h1>
        <MultiChart chart={'TradeVolumeVsPoolSize'} symbols={['NPC', 'ANDY', 'JESUS', 'ELON', 'WOJAK']} />
      </div>
    );
  }

  return (
    <div>
      <h1>AnalyzePage</h1>
      {/* <PriceVolumeChart priceVolumeData={priceVolumeData} priceTimeSeriesData={priceTimeSeriesData} /> */}
      <AraeChart2 symbol={symbol} chart={chartId ? chartId : 'avgCost'} />
    </div>
  );
}
