import { get, post } from './httpClient';

// 审批列表
export const getChartList = async () => {
  try {
    const response = await get(`/data/api/token/menu`);
    return response?.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const getChartData = async (postData) => {
  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  try {
    const response = await post(
      `/data/api/data/chart`,
      {
        Authorization: `${token}`,
        Uid: `${uid}`
      },
      postData
    );

    return response?.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const getChartDataSync = (postData) => {
  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  try {
    const response = post(
      `/data/api/data/chart`,
      {
        Authorization: `${token}`,
        Uid: `${uid}`
      },
      postData
    );

    return response?.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};
