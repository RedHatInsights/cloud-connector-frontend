import buildURL from 'axios/lib/helpers/buildURL';

class MockedInstance {
  constructor(instance) {
    this.instance = instance;
    this.originalAdapter = instance.adapter;
    this.history = { get: [], post: [], patch: [], delete: [] };
    this.instance.defaults.adapter = this.adapter;
    this.onGets = {};
  }

  onGet = (url, result) => {
    this.onGets[url] = result;
  };

  adapter = (request) => {
    this.history[request.method].push(request.method === 'get' ? buildURL(request.url, request.params) : request.url);

    const url = new URL(request.url);

    if (this.onGets[url.pathname]) {
      return Promise.resolve(this.onGets[url.pathname]);
    }

    return Promise.resolve({ data: {} });
  };

  reset = () => {
    this.instance.defaults.adapter = this.originalAdapter;
  };
}

export default MockedInstance;
