import { lazy } from 'react';
import Loadable from 'components/Loadable';

import TokenLayout from 'layout/token-layout';

const StudioPage = Loadable(lazy(() => import('pages/token-studio')));

const StudioRoutes = {
  path: '/studio',
  element: <TokenLayout />,
  children: [
    {
      path: ':symbol',
      element: <StudioPage />
    }
  ]
};
export default StudioRoutes;
