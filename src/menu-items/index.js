

import dashboard from './dashboard';
import fetchProducts from './products';
// import support from './support';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard,
      // products,
      //support
    ]
};

fetchProducts()
  .then(products => {
    menuItems.items.push(products);
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
export default menuItems;
