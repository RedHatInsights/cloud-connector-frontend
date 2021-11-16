const createOverviewColumns = (intl) => [
  {
    title: intl.formatMessage({ id: 'overview.table.account_number', defaultMessage: 'Account number' }),
  },
  {
    title: intl.formatMessage({ id: 'overview.table.connections', defaultMessage: 'Connections' }),
  },
];

export default createOverviewColumns;
