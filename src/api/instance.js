/* eslint-disable no-console */
import { addNotification } from '../store/notificationStore';
import generateConnections from '../test/__mocks__/connections';
import generateStatus from '../test/__mocks__/status';

const axios = require('axios');

const instance = axios.create();

const responseDataInterceptor = (response) => {
  if (response.data) {
    return response.data;
  }

  return response;
};

export const errorInterceptor = async (error) => {
  addNotification({
    variant: 'danger',
    title: error.message,
    description: error.response.data?.reason || JSON.stringify(error.response.data, null, 2),
    autoDismiss: false,
  });

  return Promise.reject(error);
};

instance.interceptors.response.use(responseDataInterceptor, errorInterceptor);

if (!process.env.CONNECTOR_API) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  instance.get = async (url, options) => {
    console.group(`GET ${url.replace('null', '')}`);
    console.log(JSON.stringify(options, null, 2));
    console.groupEnd();

    await sleep(1500);

    const data = generateConnections();

    switch (url.replace(/\/\d+\//g, '/id/')) {
      default:
        return {
          meta: { count: data.length },
          data,
        };
    }
  };

  instance.post = async (url, options) => {
    console.group(`POST ${url.replace('null', '')}`);
    console.log(JSON.stringify(options, null, 2));
    console.groupEnd();

    await sleep(1500);

    switch (url.replace(/\/\d+/g, '/id')) {
      case `${process.env.CONNECTOR_API}/api/cloud-connector/v1/connection/status`:
        return generateStatus();
      default:
        return {
          id: '1233',
          ...options,
        };
    }
  };

  instance.patch = async (url, options) => {
    console.group(`PATCH ${url.replace('null', '')}`);
    console.log(JSON.stringify(options, null, 2));
    console.groupEnd();

    await sleep(1500);

    switch (url.replace(/\/\d+/g, '/id')) {
      default:
        return options;
    }
  };

  instance.delete = async (url) => {
    console.group(`DELETE ${url.replace('null', '')}`);
    console.groupEnd();

    await sleep(1500);
  };
}

export default instance;
