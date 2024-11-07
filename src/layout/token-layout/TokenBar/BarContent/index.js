/* eslint-disable no-unused-vars */
// material-ui
import { Box, useMediaQuery, ButtonBase, List, ListItemText, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import Search from './Search2';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'store/reducers/token';
import { getTokens } from 'data-server/tokenlist';
import { over } from 'lodash';


// ==============================|| HEADER - CONTENT ||============================== //

const TokenContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [tokens, setTokens] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize selectedToken from localStorage if available, otherwise default to 'NPC'
  const [selectedToken, setSelectedToken] = useState();

  const { tokenItem } = useSelector((state) => state.token);
  const { openItem } = useSelector((state) => state.menu);
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
  useEffect(() => {
    getTokens().then((data) => {
      setTokens(getBarTokens(data));
      setSelectedToken(tokenItem ? tokenItem : data[0]);
    });
  }, []);

  const handleClick = (item) => {
    setSelectedToken(item); // Update the selected token state
    dispatch(selectToken({ tokenItem: item }));
    localStorage.setItem('selectedToken', item);
    navigate(`/chart/${item.symbol}/${openItem}`); // Navigate to the selected token's page
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

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '100%',
          // overflowX: 'auto' 
          
        }}
      >
        <List sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          {tokens.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <ButtonBase
                onClick={() => handleClick(item)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  backgroundColor: selectedToken?.symbol === item?.symbol ? 'primary.main' : 'transparent',
                  color: selectedToken?.symbol === item?.symbol ? 'gray' : 'text.primary',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'gray'
                  }
                }}
              >
                <ListItemText primary={item.symbol} />
              </ButtonBase>
              {index < tokens.length && <Divider orientation="vertical" flexItem />}
            </Box>
          ))}
        </List>
      </Box>
      {!matchesXs && <Search onSearchSelect={handleSearchSelect} />}
    </>
  );
};

export default TokenContent;
