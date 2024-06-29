// import { Navigate } from 'react-router-dom';

import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';

// project import
import Loadable from 'components/Loadable';
const BillingPage = Loadable(lazy(() => import('pages/user/Billing')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

const UserRoutes = {
  path: '/user',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'billing',
      element: <BillingPage />
    }
  ]
};
export default UserRoutes;
