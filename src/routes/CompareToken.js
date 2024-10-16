import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/main-layout';
import ChartLayout from 'layout/ChartLayout';

const ComparePage = Loadable(lazy(() => import('pages/token-compare')));

const CompareRoutes = {
  path: '',
  element: <MainLayout />,
  children: [
    {
      path: 'compare',
      element: <ComparePage />
    }
    // {
    //   path: '/chart',
    //   element: <ChartLayout />,
    //   children: [
    //     {
    //       path: ':symbol/:chartId',
    //       element: <ChartPage />
    //     }
    //   ]
    // }
  ]
};
export default CompareRoutes;
