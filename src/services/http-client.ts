'use client';

import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import { CLIENT_VARS } from '@/constants/client-only';
import type { StatusCode } from '@/enums/http-status';

export type ResponseBase<T> = {
  status: StatusCode;
  message?: string;
  data: T;
};

class HttpClient {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: CLIENT_VARS.API_URL + '/api',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        accept: 'application/json',
      },
      withCredentials: true,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          return Promise.resolve({
            data: {
              status: error.response.status,
              message: error.response.data?.message ?? error.message,
              data: error.response.data,
            },
          });
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ResponseBase<T>> {
    const response = await this.axiosInstance.get(url, config);
    return response.data as ResponseBase<T>;
  }

  async post<T, K = never>(url: string, data?: K, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data as ResponseBase<T>;
  }

  async makeSSE<K = never>(url: string, data?: K, config?: AxiosRequestConfig): Promise<Response> {
    const fullUrl = `${this.axiosInstance.defaults.baseURL}${url}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    };

    // Add config headers if they exist and are valid strings
    if (config?.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }

    return fetch(fullUrl, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
      keepalive: false,
    });
  }

  async put<T, K = never>(url: string, data?: K, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data as ResponseBase<T>;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.delete(url, config);
    return response.data as ResponseBase<T>;
  }
}

const httpClient = new HttpClient();

export default httpClient;
