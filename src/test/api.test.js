import api from '../api';

import instance, { errorInterceptor } from '../api/instance';
import * as notifications from '../store/notificationStore';
import MockedInstance from './__mocks__/mockedInstance';

describe('api endpoint tests', () => {
  let mock;

  beforeEach(() => {
    mock = new MockedInstance(instance);
  });

  afterEach(() => {
    mock.reset();
  });

  it('implements connection api', async () => {
    await Promise.all([
      api.getListConnection({ id: '123' }),
      api.getListByAccountConnection({ account: '0980', id: '123' }),
      api.statusConnection({ id: '123' }),
      api.pingConnection('node-123'),
      api.reconnectConnection('node-123'),
      api.disconnectConnection('node-123'),
      api.resetStateConnection('node-123'),
    ]);

    expect(mock.history.get).toEqual([
      'https://test-api/api/cloud-connector/v1/connection?id=123',
      'https://test-api/api/cloud-connector/v1/connection/0980?id=123',
    ]);
    expect(mock.history.post).toEqual([
      'https://test-api/api/cloud-connector/v1/connection/status',
      'https://test-api/api/cloud-connector/v1/connection/node-123/ping',
      'https://test-api/api/cloud-connector/v1/connection/node-123/reconnect',
      'https://test-api/api/cloud-connector/v1/connection/node-123/disconnect',
      'https://test-api/api/cloud-connector/v1/connection/node-123/resetState',
    ]);
  });

  it('error notification creates a notification', async () => {
    expect.assertions(2);

    notifications.addNotification = jest.fn();

    try {
      await errorInterceptor({
        message: 'Returned 404',
        response: { data: { reason: 'endpoint does not exist' } },
      });
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(notifications.addNotification).toHaveBeenLastCalledWith({
        autoDismiss: false,
        description: 'endpoint does not exist',
        title: 'Returned 404',
        variant: 'danger',
      });
    }

    try {
      await errorInterceptor({
        message: 'Returned 404',
        response: { data: { request_id: '123' } },
      });
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(notifications.addNotification).toHaveBeenLastCalledWith({
        autoDismiss: false,
        description: `{
  "request_id": "123"
}`,
        title: 'Returned 404',
        variant: 'danger',
      });
    }
  });
});
