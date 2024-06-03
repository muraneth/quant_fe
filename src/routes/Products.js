import { lazy } from 'react';

import Loadable from 'components/Loadable';

const ProductList = Loadable(lazy(() => import('pages/product/Products')));

const ProductRoutes = {
  path: '/',
  children: [
    {
      path: 'products',
      element: <ProductList />
    }
  ]
};

export default ProductRoutes;
