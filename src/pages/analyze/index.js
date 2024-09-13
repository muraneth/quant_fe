/* eslint-disable no-unused-vars */

import AraeChart from './AreaChart';

import { useParams } from 'react-router-dom';

export default function AnalyzePage() {
  const { id } = useParams();
  return (
    <div>
      <h1>AnalyzePage</h1>
       <AraeChart symbol={"NPC"} chart={id} />
    </div>
  );
}
