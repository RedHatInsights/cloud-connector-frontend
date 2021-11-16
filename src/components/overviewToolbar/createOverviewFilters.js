const createOverviewFilters = (onChangeText, textValues, intl) => ({
  items: [
    {
      label: intl.formatMessage({ id: 'overview.table.account_number', defaultMessage: 'Account number' }),
      value: 'account_number',
      filterValues: {
        placeholder: intl.formatMessage({
          id: 'overview.table.account_number.placeholder',
          defaultMessage: 'Filter by account number',
        }),
        value: textValues.account_number,
        onChange: (_e, value) => onChangeText('account_number', value),
      },
    },
    {
      label: intl.formatMessage({ id: 'overview.table.client_id', defaultMessage: 'Client ID' }),
      value: 'client_id',
      filterValues: {
        placeholder: intl.formatMessage({
          id: 'overview.table.client_id.placeholder',
          defaultMessage: 'Filter by client ID',
        }),
        value: textValues.client_id,
        onChange: (_e, value) => onChangeText('client_id', value),
      },
    },
  ],
});

export default createOverviewFilters;
