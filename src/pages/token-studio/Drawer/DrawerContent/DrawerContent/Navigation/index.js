// material-ui
import { Box, Typography, List } from '@mui/material';
import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getTokens } from 'data-server/tokenlist';

import NavItem from './NavItem';


// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [menuItems, setMenuItems] = useState([]);

  const [tokens, setTokens] = useState([]);
  const drawerOpen = true;
  const { openItem } = useSelector((state) => state.sidebar);

  const dispatch = useDispatch();

  // Initialize selectedToken from localStorage if available, otherwise default to 'NPC'
  const [selectedToken, setSelectedToken] = useState();

  const { tokenItem } = useSelector((state) => state.token);

  const getBarTokens = (data) => {
    const barTokens = data.slice(0, 10);

    if (tokenItem) {
      const token = barTokens.find((item) => item.symbol === tokenItem.symbol);
      if (!token) {
        barTokens.push(tokenItem);
      }
    }

    return barTokens;
  };

  const handleSearchSelect = (value) => {
    if (value) {
      setTokens((prevTokens) => {
        const newTokens = [...prevTokens];
        newTokens[newTokens.length - 1] = value;
        return newTokens;
      });
      handleClick(value);
    }
  };

  useEffect(() => {
    getTokens().then((data) => {
      const menuItems = data.map((token) => ({
        id: token.symbol,
        title: token.symbol,
        type: 'item',
        icon: 'studio-default',
        url: `/studio/${token.symbol}`,
      }));
      setMenuItems(menuItems);
    });
  }, []);

  const navGroups = menuItems.map((item) => {
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      <NavItem key={item.id} item={item} level={1} />
    </List>;
  });

  return (
    <Box sx={{ pt: 2 }}>
      {menuItems.map((item) => (
        <List key={item.id} sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}>
          <NavItem item={item} level={1} />
        </List>
      ))}
    </Box>
  );
};

export default Navigation;
