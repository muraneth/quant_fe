import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/main-layout';
import ChartLayout from 'layout/ChartLayout';

const ChartPage = Loadable(lazy(() => import('pages/analyze')));
const DataHomePage = Loadable(lazy(() => import('pages/data-home')));
const DashboardPage = Loadable(lazy(() => import('pages/token-dashboard')));

const DataPageRoutes = {
  path: '',
  element: <MainLayout />,
  children: [
    {
      path: 'home',
      element: <DataHomePage />
    },
    {
      path: '/chart',
      element: <ChartLayout />,
      children: [
        {
          path: ':symbol/:chartId',
          element: <ChartPage />
        }
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardPage />
    }
  ]
};
export default DataPageRoutes;
