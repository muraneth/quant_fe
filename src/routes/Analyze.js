import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/ChartLayout';
import MinimalLayout from 'layout/MinimalLayout/index';

const ChartPage = Loadable(lazy(() => import('pages/analyze')));
const WalletDetailPage = Loadable(lazy(() => import('pages/wallet-detail')));
const AnalyzePageRoutes = {
  path: '/analyze',
  element: <MainLayout />,
  children: [
    {
      path: ':symbol/chart',
      element: <ChartPage />
    },
    {
      path: ':symbol/chart/:chartId',
      element: <ChartPage />
    },
    {
      path: ':symbol/topwallet',
      element: <ChartPage />
    },
    {
      path: ':symbol/wallet/:wallet',
      element: <WalletDetailPage />
    }
  ]
};
export default AnalyzePageRoutes;
