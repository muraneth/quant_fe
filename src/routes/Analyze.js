import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout/index';

const AnalyzePage = Loadable(lazy(() => import('pages/analyze')));
const AnalyzePageRoutes = {
  path: '/analyze',
  element: <MainLayout />,
  children: [
    {
      path: 'chart',
      element: <AnalyzePage />
    },
    {
      path: 'chart/:id',
      element: <AnalyzePage />
    },
    {
      path: 'topwallet',
      element: <AnalyzePage />
    }
  ]
};
export default AnalyzePageRoutes;
