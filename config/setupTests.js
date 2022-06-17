import React from 'react';

import '@testing-library/jest-dom/extend-expect';

global.React = React;

global.mockApi = () => {
  const mockFn = jest.fn().mockImplementation(
    () =>
      new Promise((res, rej) => {
        mockFn.resolve = res;
        mockFn.reject = rej;
      })
  );

  return mockFn;
};

process.env.CONNECTOR_API = 'https://test-api';

Element.prototype.scrollIntoView = () => {};
