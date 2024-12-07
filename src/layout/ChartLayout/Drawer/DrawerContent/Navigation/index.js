// material-ui
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// project import
import NavGroup from './NavGroup';

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { group } from 'd3';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();

  const { tokenItem } = useSelector((state) => state.token);

  useEffect(() => {
    console.log('fetching menu items');
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5005/data/api/base/indicatorList');
        const chartCatogery = response?.data?.data;

        var chartList = [];
        for (var i = 0; i < chartCatogery.length; i++) {
          var cate = chartCatogery[i];
          var groups = cate.groups;
          if (!groups) {
            continue;
          }
          for (var j = 0; j < groups.length; j++) {
            var group = groups[j];
            if (!group.indicators) {
              continue;
            }
            chartList.push({
              id: cate.category,
              title: cate.category,
              type: 'group',
              children: group.indicators.map((indicator) => {
                return {
                  id: indicator.handler_name,
                  name: indicator.name,
                  handler_name: indicator.handler_name,
                  type: 'item',
                  url: `/chart/${tokenItem.symbol}/${indicator.handler_name}`
                };
              })
            });
          }
        }

        setMenuItems(chartList);
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
