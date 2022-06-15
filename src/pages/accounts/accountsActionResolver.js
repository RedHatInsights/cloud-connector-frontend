import api from '../../api';

const accountsActionResolver =
  (intl) =>
  // eslint-disable-next-line no-unused-vars
  ({ id }) =>
    [
      {
        title: intl.formatMessage({
          id: 'overview.actions.ping',
          defaultMessage: 'Ping',
        }),
        onClick: () => api.pingConnection(id),
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.reconnect',
          defaultMessage: 'Reconnect',
        }),
        onClick: () => api.reconnectConnection(id),
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.disconnect',
          defaultMessage: 'Disconnect',
        }),
        onClick: () => api.disconnectConnection(id),
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.reset',
          defaultMessage: 'Reset state',
        }),
        onClick: () => api.resetStateConnection(id),
      },
    ];

export default accountsActionResolver;
