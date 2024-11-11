import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tabs,
  Tab,
  Box,
  Divider,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';

// Sample data for indicators
const PRICE_INDICATORS = [
  { id: 'ma_7', name: 'MA7', need_fetch: false, window: 7, type: 'price' },
  { id: 'ma_30', name: 'MA30', need_fetch: false, window: 30, type: 'price' },
  //   { id: 'ma_x', name: 'MA_X', need_fetch: false,window:0 },
  { id: 'volume_weighted_avg_price', name: 'Volume Weighted Avg Price', need_fetch: false, type: 'price' },
  { id: 'buy_avg_price', name: 'Buy Avg Price', need_fetch: false, type: 'price' },
  { id: 'sell_avg_price', name: 'Sell Avg Price', need_fetch: false, type: 'price' },
  { id: 'volume_weighted_rolling_price_7', name: 'Volume Weighted Rolling Price 7', need_fetch: true, type: 'price' },
  { id: 'volume_weighted_rolling_price_30', name: 'Volume Weighted Rolling Price 30', need_fetch: true, type: 'price' },
  { id: 'avg_cost', name: 'AvgCost', need_fetch: true, type: 'price' },
  { id: 'avg_cost_by_step', name: 'AvgCostByStep', need_fetch: true, type: 'price' },
  { id: 'filtered_address_avg_cost', name: 'FilteredAddressAvgCost', need_fetch: true, type: 'price' }
];

const TRADE_PVB_INDICATORS = [
  { id: 'trade_usd_pbv', name: 'Trade USD Price by Volume', need_fetch: true, type: 'pbv' },
  { id: 'trade_token_pbv', name: 'Trade Token Price by Volume', need_fetch: true, type: 'pbv' },
  { id: 'filter_addr_usd_pbv', name: 'Filter Address USD Price by Volume', need_fetch: true, type: 'pbv' },
  { id: 'filter_addr_token_pbv', name: 'Filter Address Token Price by Volume', need_fetch: true, type: 'pbv' }
];
const HOLDER_INDICATORS = [{ id: 'holder_chg', name: 'Holder Change', need_fetch: true, type: 'holder' }];

const IndicatorPopup = ({ open, onClose, setSelectedIndicators }) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleToggle = (indicator) => {
    const currentIndex = checkedItems.indexOf(indicator);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(indicator);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
    setSelectedIndicators(newChecked);
  };

  const renderIndicatorList = (indicators) => (
    <List>
      {indicators.map((indicator) => (
        <ListItem key={indicator.id} button onClick={() => handleToggle(indicator)}>
          <Checkbox edge="start" checked={checkedItems.includes(indicator)} tabIndex={-1} disableRipple />
          <ListItemText primary={indicator.name} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.0)' // Optional: Adjusts backdrop opacity
        }
      }}
    >
      <DialogTitle>
        Indicators
        <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Sidebar Icons */}
        <Box sx={{ display: 'flex' }}>
          {/* Sidebar (optional icons) */}
          <Box sx={{ flexGrow: 1, height: 500, width: 600 }}>
            {/* Search Bar */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: theme.palette.gray.main,
                padding: '8px 0'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SearchIcon sx={{ mr: 1 }} />
                <TextField placeholder="Search" variant="standard" fullWidth />
              </Box>

              <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                <Tab label="Price" />
                <Tab label="PBV" />
              </Tabs>
              <Divider sx={{ my: 2 }} />
            </Box>

            {/* List of Indicators */}
            <Box hidden={selectedTab !== 0}>{renderIndicatorList(PRICE_INDICATORS)}</Box>
            <Box hidden={selectedTab !== 1}>{renderIndicatorList(TRADE_PVB_INDICATORS)}</Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default IndicatorPopup;
