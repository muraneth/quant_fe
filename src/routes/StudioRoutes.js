import { lazy } from 'react';
import Loadable from 'components/Loadable';

import TokenLayout from 'layout/token-layout';

const DashboardPage = Loadable(lazy(() => import('pages/token-dashboard')));

const StudioRoutes = {
  path: '/dashboard',
  element: <TokenLayout />,
  children: [
    {
      path: ':symbol',
      element: <DashboardPage />
    }
  ]
};
export default StudioRoutes;
