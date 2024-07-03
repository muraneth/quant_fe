import { lazy } from 'react';
import Loadable from 'components/Loadable';

const LandingPage = Loadable(lazy(() => import('pages/landing-page/LandingPage')));
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const MyquantDashBoardRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <DashboardDefault />
    }
  ]
};
export default MyquantDashBoardRoutes;
