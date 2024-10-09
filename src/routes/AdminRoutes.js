import { lazy } from 'react';
import Loadable from 'components/Loadable';

const Adminpage = Loadable(lazy(() => import('pages/admin')));

const AdminRoutes = {
  path: '/abacadabra',
  children: [
    {
      path: 'position',
      element: <Adminpage />
    }
  ]
};
export default AdminRoutes;
