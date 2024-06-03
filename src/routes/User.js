// import { Navigate } from 'react-router-dom';

import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
const BillingPage = Loadable(lazy(() => import('pages/user/Billing')));
const UserRoutes = {
  path: '/user',
  // element:
  children: [
    {
      path: 'billing',
      element: <BillingPage />
    }
  ]
};
export default UserRoutes;
