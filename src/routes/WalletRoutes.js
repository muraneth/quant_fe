import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/main-layout';

const WalletTablePage = Loadable(lazy(() => import('pages/wallet-page')));
const WalletDetailPage = Loadable(lazy(() => import('pages/wallet-detail')));
const WalletRoutes = {
  path: '',
  element: <MainLayout />,
  children: [
    {
      path: 'wallet/:symbol',
      element: <WalletTablePage />
    },

    {
      path: 'wallet-detail/:symbol/:wallet',
      element: <WalletDetailPage />
    }
  ]
};
export default WalletRoutes;
