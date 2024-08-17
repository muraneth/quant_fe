import { lazy } from 'react';
import Loadable from 'components/Loadable';
// import MinimalLayout from 'layout/MinimalLayout/index';

const AnalyzePage = Loadable(lazy(() => import('pages/analyze')));
const AnalyzePageRoutes = {
  path: '/',
  element: <AnalyzePage />,
  children: [
    {
      path: 'analyze',
      element: <AnalyzePage />
    }
  ]
};
export default AnalyzePageRoutes;
