import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import config from '@/config';
import { AuthResponse } from '@/types';

const API_URL = config.apiUrl;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  timeout: config.apiTimeout,
});

$api.interceptors.request.use(requestConfig => {
  const token = localStorage.getItem('token');

  if (token) {
    requestConfig.headers.set('Authorization', `Bearer ${token}`);
  } else {
    requestConfig.headers.delete('Authorization');
  }

  return requestConfig;
});

$api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._isRetry) {
      return Promise.reject(error);
    }

    originalRequest._isRetry = true;

    try {
      const response = await axios.get<AuthResponse>('/user/refresh', {
        baseURL: API_URL,
        timeout: config.apiTimeout,
        withCredentials: true,
      });
      const token = response.data.accessToken;

      localStorage.setItem('token', token);
      originalRequest.headers.set('Authorization', `Bearer ${token}`);

      return await $api.request(originalRequest);
    } catch {
      localStorage.removeItem('token');
      return Promise.reject(error);
    }
  }
);

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

export default $api;
