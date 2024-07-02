import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const StrategyDetail = Loadable(lazy(() => import('pages/strategies/strategy-detail')));
const InvestPage = Loadable(lazy(() => import('pages/invest')));
const Strategies = Loadable(lazy(() => import('pages/strategies')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/user',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'strategies',
      element: <Strategies />
    },

    {
      path: 'strategies/:id',
      element: <StrategyDetail />
    },
    {
      path: 'strategies/invest/:id',
      element: <InvestPage />
    }
  ]
};

export default MainRoutes;
