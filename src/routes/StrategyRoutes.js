import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout/index';

const StrategyPage = Loadable(lazy(() => import('pages/strategies')));
const StrategyDetail = Loadable(lazy(() => import('pages/strategies/strategy-detail')));

const StrategyPageRoutes = {
  path: '/',
    element: <MinimalLayout />,
  children: [
    {
      path: 'strategies',
      element: <StrategyPage />
    },
    {
      path: 'strategies/:id',
      element: <StrategyDetail />
    }
  ]
};
export default StrategyPageRoutes;
