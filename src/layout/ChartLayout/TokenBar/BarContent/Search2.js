// assets
import { SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Box, FormControl, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { searchToken } from 'data-server/tokenlist';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = ({ onSearchSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  useEffect(() => {
    searchToken('')
      .then((response) => {
        setResults(response ? response : []); // assuming the API returns an array of items
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, []);

  // Handle search input change
  const handleInputChange = (event, value) => {
    setSearchTerm(value);
    // Fetch data if search term is not empty
    if (value) {
      searchToken(value)
        .then((response) => {
          setResults(response ? response : []); // assuming the API returns an array of items
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
      console.log('select value', value);
      const selectedObject = results.find((item) => item.symbol === value);

      onSearchSelect(selectedObject);
      // onSearchSelect(value); // Pass the selected value to the parent component
    }
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <Autocomplete
          freeSolo
          options={results.map((item) => item.symbol)} // assuming the items have a 'name' field
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
                )
              }}
            />
          )}
        />
      </FormControl>
    </Box>
  );
};

export default Search;
