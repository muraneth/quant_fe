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
  Checkbox,
  Button
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
  { id: 'ma_7', name: 'MA7', need_fetch: false, window: 7, type: 'price', position: 0 },
  { id: 'ma_30', name: 'MA30', need_fetch: false, window: 30, type: 'price', position: 0 },
  //   { id: 'ma_x', name: 'MA_X', need_fetch: false,window:0 },
  { id: 'volume_weighted_avg_price', name: 'Volume Weighted Avg Price', need_fetch: false, type: 'price', position: 0 },
  { id: 'buy_avg_price', name: 'Buy Avg Price', need_fetch: false, type: 'price' },
  { id: 'sell_avg_price', name: 'Sell Avg Price', need_fetch: false, type: 'price' },
  { id: 'volume_weighted_rolling_price_7', name: 'Volume Weighted Rolling Price 7', need_fetch: true, type: 'price', position: 0 },
  { id: 'volume_weighted_rolling_price_30', name: 'Volume Weighted Rolling Price 30', need_fetch: true, type: 'price', position: 0 },
  { id: 'avg_cost', name: 'Avg Cost', need_fetch: true, type: 'price', position: 0 },
  { id: 'avg_cost_by_step', name: 'Avg Cost By Step', need_fetch: true, type: 'price', position: 0 },
  { id: 'filtered_address_avg_cost', name: 'Filtered Address Avg Cost', need_fetch: true, type: 'price', position: 0 },
  { id: 'avg_cost_ratio', name: 'Avg Cost Ratio', need_fetch: true, type: 'ratio', position: 0 }
];

const TRADE_PVB_INDICATORS = [
  { id: 'trade_usd_pbv', name: 'Trade USD Price by Volume', need_fetch: true, type: 'pbv', position: 0 },
  { id: 'trade_token_pbv', name: 'Trade Token Price by Volume', need_fetch: true, type: 'pbv', position: 0 },
  { id: 'filter_addr_usd_pbv', name: 'Filter Address USD Price by Volume', need_fetch: true, type: 'pbv', position: 0 },
  { id: 'filter_addr_token_pbv', name: 'Filter Address Token Price by Volume', need_fetch: true, type: 'pbv', position: 0 }
];

const PNL_INDICATORS = [
  { id: 'unrealized_pnl_mcp_ratio', name: 'Unrealized PnL Mcp Ratio', need_fetch: true, type: 'ratio', position: 0 },
  { id: 'unrealized_pos_pnl_mcp_ratio', name: 'Unrealized Pos PnL Mcp Ratio', need_fetch: true, type: 'ratio', position: 0 },
  { id: 'unrealized_neg_pnl_mcp_ratio', name: 'Unrealized Neg PnL Mcp Ratio', need_fetch: true, type: 'ratio', position: 0 },
  { id: 'unrealized_pnl_poolsize_ratio', name: 'Unrealized PnL Poolsize Ratio', need_fetch: true, type: 'ratio', position: 0 }
];
const POOL_INDICATORS = [
  { id: 'pool_size', name: 'Pool Size', need_fetch: true, type: 'pool', position: 0 },
  { id: 'pool_size_mcp_ratio', name: 'Pool Size Mcp Ratio', need_fetch: true, type: 'ratio', position: 0 },
  { id: 'pooled_token_total_supply_ratio', name: 'Pooled Token to Total Supply Ratio', need_fetch: true, type: 'ratio', position: 0 },
  { id: 'usd_volume_pool_size_ratio', name: 'USD Volume Pool Size Ratio', need_fetch: true, type: 'ratio', position: 0 },
  { id: 'token_volume_pool_size_ratio', name: 'Token Volume Pool Size Ratio', need_fetch: true, type: 'ratio', position: 0 }
];
const VOLUME_INDICATORS = [
  { id: 'usd_swap_volume', name: 'USD Swap Volume', need_fetch: true, type: 'volume', position: 1 },
  { id: 'token_swap_volume', name: 'Token Swap Volume', need_fetch: true, type: 'volume', position: 1 },
  { id: 'usd_tx_volume', name: 'USD Tx Volume', need_fetch: true, type: 'volume', position: 1 },
  { id: 'token_tx_volume', name: 'Token Tx Volume', need_fetch: true, type: 'volume', position: 1 }
];

const HOLDER_INDICATORS = [
  { id: 'holder_count', name: 'Holder Count', need_fetch: true, type: 'holder', position: 0 },
  // { id: 'holder_avg_mcp', name: 'Holder Avg MCP', need_fetch: true, type: 'holder' ,position:0},
  { id: 'holder_chg', name: 'Holder Chg', need_fetch: true, type: 'holder', position: 1 }
];
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
      <DialogTitle
        sx={{
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        Indicators
        <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pl: 1 }}>
        {/* Sidebar Icons */}
        <Box sx={{ display: 'flex' }}>
          {/* Sidebar (fixed icons) */}
          <Box
            sx={{
              width: '30px',
              flexDirection: 'column',
              alignItems: 'center',
              mr: 2,
              mt: 3,
              position: 'sticky'
            }}
          >
            <IconButton variant="outlined" color="primary" sx={{ mb: 2 }}>
              <AccountCircleIcon fontSize="medium" />
            </IconButton>
            <IconButton variant="outlined" color="primary" sx={{ mb: 2 }}>
              <TrendingUpIcon fontSize="medium" />
            </IconButton>
            {/* Other icons */}
          </Box>

          {/* Divider between sidebar and content */}
          <Divider orientation="vertical" flexItem />

          {/* Scrollable Content */}
          <Box
            sx={{
              flexGrow: 1,
              height: 500,
              width: 600,
              overflowY: 'auto' // Enables scrolling only for this area
            }}
          >
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

              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Tab label="Price" />
                <Tab label="PBV" />
                <Tab label="PNL" />
                <Tab label="Pool" />
                <Tab label="Volume" />
                <Tab label="Holder" />
              </Tabs>
            </Box>

            {/* List of Indicators */}
            <Box hidden={selectedTab !== 0}>{renderIndicatorList(PRICE_INDICATORS)}</Box>
            <Box hidden={selectedTab !== 1}>{renderIndicatorList(TRADE_PVB_INDICATORS)}</Box>
            <Box hidden={selectedTab !== 2}>{renderIndicatorList(PNL_INDICATORS)}</Box>
            <Box hidden={selectedTab !== 3}>{renderIndicatorList(POOL_INDICATORS)}</Box>
            <Box hidden={selectedTab !== 4}>{renderIndicatorList(VOLUME_INDICATORS)}</Box>
            <Box hidden={selectedTab !== 5}>{renderIndicatorList(HOLDER_INDICATORS)}</Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default IndicatorPopup;
