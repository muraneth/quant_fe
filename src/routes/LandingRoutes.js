import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
// import MinimalLayout from 'layout/MinimalLayout';
import SignIn from 'pages/sign-in/SignIn';

import { Navigate } from 'react-router-dom';

const LandingPage = Loadable(lazy(() => import('pages/landing-page/LandingPage')));

const LandingPageRoutes = {
  path: '/',
  element: <LandingPage />,
  children: [
    {
      path: 'home',
      element: <LandingPage />
    }]
};
export default LandingPageRoutes;
