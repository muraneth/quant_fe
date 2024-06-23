import { lazy } from 'react';
import Loadable from 'components/Loadable';

const InvestPage = Loadable(lazy(() => import('pages/invest')));

const InvestRoutes = {
  path: '/invest/:id',
  element: <InvestPage />
};
export default InvestRoutes;
