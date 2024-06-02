import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';


const SignIn = Loadable(lazy(() => import('pages/sign-in/SignIn')));
const SignUp = Loadable(lazy(() => import('pages/sign-up/SignUp')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'sign-in',
      element: <SignIn />
    },
    {
      path: 'sign-up',
      element: <SignUp />
    }
  ]
};

export default LoginRoutes;
