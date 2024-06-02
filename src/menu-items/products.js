
// const products = {
//     id: 'products',
//     title: 'Products',
//     type: 'group',
//     children: [
//       {
//         id: 'product-1',
//         title: 'Product 1',
//         type: 'item',
//         url: '/dashboard/product/1',
//         // icon: icons.ChromeOutlined
//       },
//       {
//         id: 'product-2',
//         title: 'Product 2',
//         type: 'item',
//         url: '/dashboard/product/2',
//         // icon: icons.ChromeOutlined
//       },
      
//     ]
// };
  
// export default products;


function fetchProducts() {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        fetch(`/api/user/asset/getAllProduct?uid=${uid}`,{
            headers: {
            'Authorization': token, 
            'Uid': uid
            
            }
        })
        .then(response => response.json())
        .then(data => {
          const products = {
            id: 'products',
            title: 'Products',
            type: 'group',
            children: data.map(product => ({
              id: product.id,
              title: product.product_name, // Assuming the API returns a 'name' field for each product
              type: 'item',
              url: `/dashboard/product/${product.id}`,
              // You can include additional fields here if needed
            }))
          };
          // Resolve the promise with the products object
          resolve(products);
        })
        .catch(error => {
          // Reject the promise with the error
          reject(error);
        });
    });
  }
  
export default fetchProducts;
