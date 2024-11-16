import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const httpClient = axios.create({
  // baseURL: `http://127.0.0.1:5005`,  // Include 'http://' here
  baseURL: `https://www.matrixcipher.com/`
});

export const get = async (url, headers) => {
  try {
    const response = await httpClient.get(url, { headers }); // Correct placement for headers
    return response.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const post = async (url, headers, params) => {
  try {
    const response = await httpClient.post(url, params, { headers }); // Correct placement for headers
    return response.data;
  } catch (error) {
    console.error('Request error:', error);
  }
};
// export const request = async (
//   url,
//   option: AxiosRequestConfig = {
//     method: HttpMethod.GET,
//     headers: {},
//   },
// ): Promise<T> => {
//   const { params, method, headers } = option;
//   console.log('request', url, params, method);
//   let uri = url;
//   if (!uri.startsWith('http')) {
//     uri = uri;
//   }
//   let options: AxiosRequestConfig = {
//     url: uri,
//     method,
//     headers,
//   };
//   if (method === 'get' || method === 'delete') {
//     options = {
//       ...options,
//       url: `${uri}${params ? '?' : ''}${getQuery(params)}`,
//     };
//   } else {
//     options = {
//       ...options,
//       data: JSON.stringify(params),
//     };
//   }

//   try {
//     const response = await httpClient(options);
//     return await checkCode(response.data);
//   } catch (error) {
//     console.error('Request error:', error);
//     throw error;
//   }
// };

// export const post = async (
//   url: string,
//   params?: any,
//   headers = { 'Content-Type': 'application/json' },
// ): Promise<any> =>
//   request(url, {
//     method: HttpMethod.POST,
//     params,
//     headers,
//   });
