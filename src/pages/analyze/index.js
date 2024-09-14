/* eslint-disable no-unused-vars */

import AraeChart from './AreaChart';
import WalletTable from './Table';

import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function AnalyzePage() {
  const location = useLocation();

  const { id } = useParams();
  
  if (location.pathname.includes('/topwallet')) {
   
    return (
      <div>
        <h1>WalletTable</h1>
        <WalletTable />
      </div>
    );
  }else if  (id === undefined) {
    return (
      <div>
        <h1>AnalyzePage</h1>
        <AraeChart symbol={"NPC"} chart={"mvrv"} />
      </div>
    );
  }


  return (
    <div>
      <h1>AnalyzePage</h1>
       <AraeChart symbol={"NPC"} chart={id} />
    </div>
  );
}
