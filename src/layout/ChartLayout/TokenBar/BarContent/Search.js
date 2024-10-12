

// assets
import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import axios from 'axios';
import { Box, FormControl, Autocomplete, TextField, InputAdornment } from '@mui/material';


// ==============================|| HEADER CONTENT - SEARCH ||============================== //


const Search = ({ onSearchSelect }) => {
  const [open, setOpen] = React.useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      await sleep(1e3); // For demo purposes.
      setLoading(false);

      setOptions([...topFilms]);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };
  // Handle search input change
  const handleInputChange = (event, value) => {
    setSearchTerm(value);
  



    // Fetch data if search term is not empty
    if (value) {
      axios
        .get(`http://127.0.0.1:5005/api/data/getTokensBySymbol`, { params: { symbol: value } })
        .then((response) => {
          setResults(response.data.data?response.data.data:[]);  // assuming the API returns an array of items
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
        });
    } else {
      setResults([]); // Clear results if the search term is empty
    }
  };
  const handleOptionSelect = (event, value) => {
    if (onSearchSelect) {
      onSearchSelect(value); // Pass the selected value to the parent component
    }
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <Autocomplete
          freeSolo
          options={results.map((item) => item)}  // assuming the items have a 'name' field
          inputValue={searchTerm}
          onInputChange={handleInputChange}
          onChange={handleOptionSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              // placeholder="Ctrl + K"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: -0.5 }}>
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </FormControl>
    </Box>
  );
};

export default Search;

