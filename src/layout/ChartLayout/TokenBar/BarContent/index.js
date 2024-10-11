/* eslint-disable no-unused-vars */
// material-ui
import { Box, useMediaQuery, ButtonBase, List, ListItemText, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import Search from './Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'store/reducers/token';

// ==============================|| HEADER - CONTENT ||============================== //

const TokenContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [tokens, setTokens] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Initialize selectedToken from localStorage if available, otherwise default to 'NPC'
  const [selectedToken, setSelectedToken] = useState(localStorage.getItem('selectedToken') || 'NPC'); 
  const { tokenItem } = useSelector((state) => state.token);

  useEffect(() => {
    dispatch(selectToken({ tokenItem: selectedToken }));
    // Save the selected token to localStorage whenever it changes
    localStorage.setItem('selectedToken', selectedToken);
  }, [selectedToken, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5005/api/data/tokens');
        setTokens(response.data.data ? response.data.data : ['NPC', 'ANDY']);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (symbol) => {
    setSelectedToken(symbol); // Update the selected token state
    navigate(`/analyze/${symbol}/chart`); // Navigate to the selected token's page
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'auto', maxWidth: '100%' }}>
        <List sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          {tokens.map((symbol, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <ButtonBase
                onClick={() => handleClick(symbol)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  backgroundColor: tokenItem === symbol ? 'primary.main' : 'transparent',
                  color: tokenItem === symbol ? 'gray' : 'text.primary',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'gray',
                  },
                }}
              >
                <ListItemText primary={symbol} />
              </ButtonBase>
              {index < tokens.length - 1 && <Divider orientation="vertical" flexItem />}
            </Box>
          ))}
        </List>
      </Box>
      {!matchesXs && <Search />}
    </>
  );
};

export default TokenContent;
