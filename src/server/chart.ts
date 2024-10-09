import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';

import {
  ExamineSearchParams,
  ExamineSubmitParams,
} from '@/pages/examineCenter/interface';

import { ApiResponse, HttpMethod } from './HttpType';
import { request } from './httpClient';

// 审批列表
export const getExamineListApi = async (
  params: ExamineSearchParams,
): Promise<ApiResponse<any>> => {
  return request('/api/v1/audit/list', {
    params,
    method: HttpMethod.POST,
  });
};
// 审批详情
export const getExamineDetailApi = async (
  id: string | undefined,
): Promise<ApiResponse<any>> => {
  return request(`/api/v1/audit/${id}`, {
    method: HttpMethod.GET,
  });
};

// 审批提交
export const examineSubmitApi = async (
  params: ExamineSubmitParams,
): Promise<ApiResponse<any>> => {
  return request(`/api/v1/audit/${params.id}`, {
    params,
    method: HttpMethod.POST,
  });
};
