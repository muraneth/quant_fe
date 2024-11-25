import { get, post } from './httpClient';

const CACHE_KEY = 'tokensCache';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export const getTokens = async () => {
  try {
    const response = await get('/data/api/token/tokens');
    return response?.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const getToken = async (symbol) => {
  try {
    const response = await get(`/data/api/token?symbol=${symbol}`);
    return response?.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const searchToken = async (symbol) => {
  try {
    const response = await get(`/data/api/token/searchToken?key=${symbol}`);
    return response?.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const getTokenInfo = async (symbol) => {
  try {
    const response = await get(`/data/api/token/getTokenInfo?symbol=${symbol}`);
    return response?.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};
