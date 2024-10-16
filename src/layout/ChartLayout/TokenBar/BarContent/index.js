/* eslint-disable no-unused-vars */
// material-ui
import { Box, useMediaQuery, ButtonBase, List, ListItemText, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import Search from './Search';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'store/reducers/token';
import { getTokens,getToken } from 'server/tokenlist';


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

  
  useEffect(() => {
    console.log('tokenItem', tokenItem);

    getTokens().then((data) => {
  
       setTokens(data);
       setSelectedToken(data[0]);  
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
   
      setSelectedToken(value); // Update selected token based on search selection
      navigate(`/chart/${value.symbol}/${openItem}`); // Navigate to the selected token's page
      
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'auto', maxWidth: '100%' }}>
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
              {index < tokens.length - 1 && <Divider orientation="vertical" flexItem />}
            </Box>
          ))}
        </List>
      </Box>
      {!matchesXs && <Search onSearchSelect={handleSearchSelect} />}
    </>
  );
};

export default TokenContent;
