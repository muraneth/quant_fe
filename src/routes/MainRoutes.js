import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';


// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const StrategyDetail = Loadable(lazy(() => import('pages/strategies/strategy-detail')));
const InvestPage = Loadable(lazy(() => import('pages/invest')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      path: 'default',
      element: <DashboardDefault />
    },

    {
      path: 'strategy/:id',
      element: <StrategyDetail />
    },
    {
      path: 'strategy/invest/:id',
      element: <InvestPage />
    },

  ]
};

export default MainRoutes;
