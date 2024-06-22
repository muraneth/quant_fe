import { lazy } from 'react';
import Loadable from 'components/Loadable';

const LandingPage = Loadable(lazy(() => import('pages/landing-page/LandingPage')));

const LandingPageRoutes = {
  path: '/',
  element: <LandingPage />,
  children: [
    {
      path: 'home',
      element: <LandingPage />
    }
  ]
};
export default LandingPageRoutes;
