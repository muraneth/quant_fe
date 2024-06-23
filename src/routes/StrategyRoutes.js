import { lazy } from 'react';
import Loadable from 'components/Loadable';

const StrategyPage = Loadable(lazy(() => import('pages/strategies')));
const StrategyDetail = Loadable(lazy(() => import('pages/strategies/strategy-detail')));

const StrategyPageRoutes = {
  path: '/strategies',
  //   element: <StrategyPage />,
  children: [
    {
      path: '',
      element: <StrategyPage />
    },
    {
      path: ':id',
      element: <StrategyDetail />
    }
  ]
};
export default StrategyPageRoutes;
