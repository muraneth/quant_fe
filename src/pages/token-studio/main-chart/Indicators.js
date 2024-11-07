
export const INDICATOR_OPTIONS = [
    {
      "volume":[
        'trade_usd_volume',
        'tx_usd_volume',
        'trade_token_volume',
        'tx_token_volume',
        'cex_deposit_token_volume',
        'filtered_addr_usd_volume',
        'filtered_addr_token_volume',
      ],
      "pbv":[
        'trade_usd_pbv',
        'tx_usd_pbv',
        'trade_token_pbv',
        'tx_token_pbv',
        'cex_deposit_token_pbv',
        'filtered_addr_usd_pbv',
        'filtered_addr_token_pbv',
        'wallet_cost_usd_pbv', 
        'filtered_addr_wallet_cost_usd_pbv',
      ],
      "price":[
        'ma_7',
        'ma_30',
        'ma_x',
        'volume_weighted_avg_price',
        'volume_weighted_rolling_price_7',
        'volume_weighted_rolling_price_30',
        'volume_weighted_rolling_price_x',
        'avg_cost',
        'filtered_address_avg_cost',
      ],
      "balance":[
        'cex_balance',
        'cex_balance_ratio',
        'filtered_addr_balance',
        'filtered_addr_balance_ratio',
        
      ],
    //   "holder":[
    //     'holder_count_1', // balance > 1 usd
    //     'holder_count_10', // balance > 10 usd
    //     'holder_count_x', // balance > x usd
    //   ],
      "pnl":[
        'un_pnl', // unrealized pnl
        'un_pnl_ratio', // unrealized pnl vs mcp ratio
        'un_pos_pnl', // unrealized positive pnl
        'un_neg_pnl', // unrealized negative pnl
        'un_pos_pnl_ratio', // unrealized positive pnl vs mcp ratio
        'un_neg_pnl_ratio', // unrealized negative pnl vs mcp ratio
      ],
      
  
    },
  ];