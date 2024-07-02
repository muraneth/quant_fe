import { GoldOutlined } from '@ant-design/icons';

// icons
const icons = {
  GoldOutlined
};
const products = {
  id: 'strategies',
  title: 'Straregies',
  type: 'group',
  children: [
    {
      id: 'strategies',
      title: 'Straregies',
      type: 'item',
      url: '/user/strategies',
      icon: icons.GoldOutlined
    }
  ]
};

export default products;

// function fetchProducts() {
//   return new Promise((resolve, reject) => {
//     const token = localStorage.getItem('token');
//     const uid = localStorage.getItem('uid');
//     fetch(`/api/user/asset/getAllProduct`, {
//       headers: {
//         Authorization: token,
//         Uid: uid
//       }
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const products = {
//           id: 'products',
//           title: 'Products',
//           type: 'group',
//           children: data.map((product) => ({
//             id: product.id,
//             title: product.product_name, // Assuming the API returns a 'name' field for each product
//             type: 'item',
//             url: `/dashboard/product/${product.id}`
//             // You can include additional fields here if needed
//           }))
//         };
//         // Resolve the promise with the products object
//         resolve(products);
//       })
//       .catch((error) => {
//         // Reject the promise with the error
//         reject(error);
//       });
//   });
// }

// export default fetchProducts;
