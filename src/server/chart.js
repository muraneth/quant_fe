import { get, post } from './httpClient';

// 审批列表
export const getChartList = async () => {
  try {
    const response = await get(`/api/token/menu`);
    return response.data;
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};
