// material-ui
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// project import
import NavGroup from './NavGroup';

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();
  const { symbol } = useParams();

  useEffect(() => {
    if (location.pathname.includes('/analyze/')) {
      console.log('fetching menu items');
      const fetchMenuItems = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5005/api/data/menu?token_symbol=' + symbol);
          const chartMenu = response.data.data;
          const walletItem = {
            id: 'topwallet',
            title: 'TopWallet',
            type: 'group',
            children: [
              {
                id: 'topwallet',
                title: 'TopWallet',
                type: 'item',
                url: `/analyze/${symbol}/topwallet`
              },
              {
                id: 'newwallet',
                title: 'NewWallet',
                type: 'item',
                url: `/analyze/${symbol}/newwallet`
              }
            ]
          };
          chartMenu.push(walletItem);
          setMenuItems(chartMenu);
        } catch (error) {
          console.error('Error fetching menu items:', error);
        }
      };
      fetchMenuItems();
    }
  }, [location.pathname, symbol]);
  console.log('menuItems:', menuItems);

  const navGroups = menuItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
