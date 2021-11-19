import instance from './instance';

const connectionsApi = {
  getList: (params) => instance.get(`${process.env.CONNECTOR_API}/api/cloud-connector/v1/connection`, { params }),
  getListByAccount: ({ account, ...params }) =>
    instance.get(`${process.env.CONNECTOR_API}/api/cloud-connector/v1/connection/${account}`, {
      params,
    }),
  status: (params) => instance.post(`${process.env.CONNECTOR_API}/api/cloud-connector/v1/connection/status`, params),
};

const nameApiFunctions = (object, key) =>
  Object.keys(object).reduce((acc, curr) => ({ ...acc, [`${curr}${key}`]: object[curr] }), {});

const api = {
  ...nameApiFunctions(connectionsApi, 'Connection'),
};

export default api;
