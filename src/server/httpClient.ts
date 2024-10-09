import { message, notification } from 'antd';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { getQuery, getUrl } from '@/utils/url';
import {
  extractFilenameFromContentDisposition,
  getCurrentLang,
} from '@/utils/utils';
import { $t } from '@/locales';

import { HttpMethod } from './HttpType';

interface CustomHeaders {
  'Accept-Language'?: string; // Optional
  'Content-Type'?: string; // Optional
  'user-name'?: string; // Optional
  [key: string]: string | undefined; // Allows any other string properties
}

type FetchSSEHeaders = Omit<CustomHeaders, 'Accept-Language' | 'Content-Type'>;

interface FetchSSEType {
  path: string;
  postData: Record<string, any>;
  headers: FetchSSEHeaders;
  handleData?: (data: string, controller: AbortController) => void;
}

let controller: AbortController | null;

interface ResponseType {
  code: number;
  message: string;
  data: any;
}

export const checkCode = (data: ResponseType): Promise<ResponseType> =>
  new Promise((resolve, reject) => {
    if (typeof data === 'string') {
      message.info(data);
      reject(new Error('Response is a string'));
      return;
    }
    if (data.code < 0) {
      notification.error({
        message: $t('pages.interactiveModelList.qinQiuShiBai'),
        description: data.message,
      });
      reject(new Error(data.message));
    } else {
      // 无权限 code 100004
      if (data.code !== 0 && data.message) {
        notification.error({
          message: $t('pages.interactiveModelList.qinQiuShiBai'),
          description: data.message,
        });
      }
      resolve(data);
    }
  });

const protocol = import.meta.env.VITE_USE_HTTPS === 'true' ? 'https' : 'http';
const httpClient = axios.create({
  baseURL: `${protocol}://${import.meta.env.VITE_PROXY_HOST || '10.31.25.164:31223'}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Accept-Language'] = getCurrentLang() || 'zh-CN';
    return config;
  },
  error => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    console.log('Request error:', error);
    if (error.response && error.response.status === 401) {
      window.location.href = `/?t=${new Date().getTime()}`;
    }
    return Promise.reject(error);
  },
);

export const request = async <T = any>(
  url: string,
  option: AxiosRequestConfig = {
    method: HttpMethod.GET,
    headers: {},
  },
): Promise<T> => {
  const { params, method, headers } = option;
  console.log('request', url, params, method);
  let uri = url;
  if (!uri.startsWith('http')) {
    uri = uri;
  }
  let options: AxiosRequestConfig = {
    url: uri,
    method,
    headers,
  };
  if (method === 'get' || method === 'delete') {
    options = {
      ...options,
      url: `${uri}${params ? '?' : ''}${getQuery(params)}`,
    };
  } else {
    options = {
      ...options,
      data: JSON.stringify(params),
    };
  }

  try {
    const response = await httpClient(options);
    return await checkCode(response.data);
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

export const post = async (
  url: string,
  params?: any,
  headers = { 'Content-Type': 'application/json' },
): Promise<any> =>
  request(url, {
    method: HttpMethod.POST,
    params,
    headers,
  });
