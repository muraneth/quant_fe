import { lazy } from 'react';
import Loadable from 'components/Loadable';

const StrategyPage = Loadable(lazy(() => import('pages/strategies')));

const StrategyPageRoutes = {
  path: '/strategies',
  element: <StrategyPage />
};
export default StrategyPageRoutes;
