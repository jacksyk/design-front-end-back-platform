// 运行时配置
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

import type { RequestConfig } from 'umi';

import { RequestOptions } from '@umijs/max';
import { Modal, message } from 'antd';
// import VConsole from 'vconsole';

// new VConsole();

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const request: RequestConfig = {
  errorConfig: {
    errorHandler(res: any) {
      if (res.response.status === 401) {
        // 使用 Modal 提示用户
        Modal.error({
          title: '登录已过期',
          content: '您的登录状态已过期，请重新登录',
          okText: '确定',
          onOk: () => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          },
        });
      } else {
        message.error(res.response.statusText);
      }
    },
    errorThrower() {},
  },
  requestInterceptors: [
    (config: RequestOptions) => {
      // 从localStorage中获取token
      const token = localStorage.getItem('token');

      config.baseURL = 'https://www.shuyikang.online:3000';
      // config.baseURL = 'http://localhost:3000';
      // 如果token存在，将其添加到请求头中
      if (token) {
        config.headers = {
          ...config.headers,
          token,
        };
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      console.log('response', response);
      return response;
    },
  ],
};
