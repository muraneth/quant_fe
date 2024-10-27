// material-ui
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// project import
import NavGroup from './NavGroup';

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();

  const { tokenItem } = useSelector((state) => state.token);

  useEffect(() => {
    console.log('fetching menu items');
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5005/api/token/menu?token_symbol=' + tokenItem.symbol);
        const chartMenu = response?.data?.data;

        setMenuItems(chartMenu);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, [tokenItem]);

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
