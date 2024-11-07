import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Checkbox, Button } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';

import { getTokens } from 'data-server/tokenlist';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags({ onSelect }) {
  const [tokens, setTokens] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);

  useEffect(() => {
    getTokens().then((data) => {
      if (!data || data.length === 0) {
        return;
      }
      setTokens(data);
      setSelectedTokens([data[0]]);
    });
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedTokens(newValue);
    if (onSelect) {
      console.log('selected tokens', newValue);

      onSelect(newValue.map((token) => token.symbol));
    }
  };

  return (
    <div>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={tokens}
        value={selectedTokens}
        onChange={handleChange}
        disableCloseOnSelect
        getOptionLabel={(option) => option.symbol}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
              {option.symbol}
            </li>
          );
        }}
        style={{ width: 500 }}
        renderInput={(params) => <TextField {...params} label="Checkboxes" placeholder="Favorites" />}
      />
      {/* <Button variant="contained" onClick={handleSelectAll} sx={{ mt: 2 }}>
        Select All Tokens
      </Button> */}
    </div>
  );
}
