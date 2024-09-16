/* eslint-disable no-unused-vars */

// material-ui
import { Box, useMediaQuery, ButtonBase, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import Search from './Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// ==============================|| HEADER - CONTENT ||============================== //

const TokenContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const username = localStorage.getItem('username');
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5005/api/data/tokens');
        setTokens(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (symbol) => {
    setSelectedToken(symbol);
    navigate(`/analyze/${symbol}/chart`);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <List sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          {tokens.map((symbol, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <ButtonBase
                onClick={() => handleClick(symbol)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  backgroundColor: selectedToken === symbol ? 'primary.main' : 'transparent',
                  color: selectedToken === symbol ? 'gray' : 'text.primary',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'gray'
                  }
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
