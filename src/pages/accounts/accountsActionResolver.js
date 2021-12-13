const accountsActionResolver =
  (intl) =>
  // eslint-disable-next-line no-unused-vars
  ({ connection }) =>
    [
      {
        title: intl.formatMessage({
          id: 'overview.actions.ping',
          defaultMessage: 'Ping',
        }),
        onClick: console.log,
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.reconnect',
          defaultMessage: 'Reconnect',
        }),
        onClick: console.log,
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.disconnect',
          defaultMessage: 'Disconnect',
        }),
        onClick: console.log,
      },
      {
        title: intl.formatMessage({
          id: 'overview.actions.reset',
          defaultMessage: 'Reset state',
        }),
        onClick: console.log,
      },
    ];

export default accountsActionResolver;
