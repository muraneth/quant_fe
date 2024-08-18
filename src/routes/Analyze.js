import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout/index';

const AnalyzePage = Loadable(lazy(() => import('pages/analyze')));
const AnalyzePageRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'analyze',
      element: <AnalyzePage />
    }
  ]
};
export default AnalyzePageRoutes;
