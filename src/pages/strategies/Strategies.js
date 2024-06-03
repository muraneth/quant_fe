import { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography } from '@mui/material';
// import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';
const Strategies = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const host = 'http://matrixcipher.com';
    const response = await axios.get(`${host}/api/user/asset/getAllProduct`, {
      headers: {
        Authorization: token,
        Uid: uid
      }
    });
    setProducts(response.data.data);

    // return new Promise((resolve, reject) => {

    //   fetch(`/api/user/asset/getAllProduct`, {
    //     headers: {
    //       Authorization: token,
    //       Uid: uid
    //     }
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       // const products = {
    //       //   id: 'products',
    //       //   title: 'Products',
    //       //   type: 'group',
    //       //   children: data.map((product) => ({
    //       //     id: product.id,
    //       //     title: product.product_name, // Assuming the API returns a 'name' field for each product
    //       //     type: 'item',
    //       //     url: `/dashboard/product/${product.id}`
    //       //     // You can include additional fields here if needed
    //       //   }))
    //       // };
    //       setProducts(data);
    //       // Resolve the promise with the products object
    //     })
    //     .catch((error) => {
    //       // Reject the promise with the error
    //       reject(error);
    //     });
    // });
  };
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <MainCard contentSX={{ p: 2.25 }}>
              <Stack spacing={0.5}>
                <Typography variant="h6" color="textSecondary">
                  {product.product_name}
                </Typography>
                <Grid container alignItems="center">
                  <Grid item>
                    {/* <Typography variant="h4" color="inherit">
                      {count}
                    </Typography> */}
                  </Grid>
                  {/* {percentage && (
                    <Grid item>
                      <Chip
                        variant="combined"
                        // color={color}
                        icon={
                          <>
                            {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                            {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                          </>
                        }
                        // label={`${percentage}%`}
                        sx={{ ml: 1.25, pl: 1 }}
                        size="small"
                      />
                    </Grid>
                  )} */}
                </Grid>
              </Stack>
            </MainCard>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Strategies;
