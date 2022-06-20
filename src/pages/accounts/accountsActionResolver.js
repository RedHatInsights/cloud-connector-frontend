import api from '../../api';
import { addNotification } from '../../store/notificationStore';

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
        onClick: () => {
          api.pingConnection(id);
          addNotification({
            variant: 'info',
            title: intl.formatMessage(
              {
                id: 'notification.ping',
                defaultMessage: 'Ping request for {id} was sent',
              },
              { id }
            ),
          });
        },
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.reconnect',
          defaultMessage: 'Reconnect',
        }),
        onClick: () => {
          api.reconnectConnection(id);
          addNotification({
            variant: 'info',
            title: intl.formatMessage(
              {
                id: 'notification.reconnectConnection',
                defaultMessage: 'Reconnect request for {id} was sent',
              },
              { id }
            ),
          });
        },
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.disconnect',
          defaultMessage: 'Disconnect',
        }),
        onClick: () => {
          api.disconnectConnection(id);
          addNotification({
            variant: 'info',
            title: intl.formatMessage(
              {
                id: 'disconnectConnection.ping',
                defaultMessage: 'Disconnect request for {id} was sent',
              },
              { id }
            ),
          });
        },
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.reset',
          defaultMessage: 'Reset state',
        }),
        onClick: () => {
          api.resetStateConnection(id);
          addNotification({
            variant: 'info',
            title: intl.formatMessage(
              {
                id: 'resetStateConnection.ping',
                defaultMessage: 'Reset state request for {id} was sent',
              },
              { id }
            ),
          });
        },
      },
    ];

export default accountsActionResolver;
