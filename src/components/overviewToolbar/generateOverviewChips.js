const accountNumberFormatter = (value, intl) => ({
  category: intl.formatMessage({ id: 'overview.table.account_number', defaultMessage: 'Account number' }),
  clear: true,
  value: 'account_number',
  chips: [{ name: value }],
});

const clientIdFormatter = (value, intl) => ({
  category: intl.formatMessage({ id: 'overview.table.client_id', defaultMessage: 'Client ID' }),
  value: 'client_id',
  chips: [{ name: value }],
});

const formatters = {
  account_number: accountNumberFormatter,
  client_id: clientIdFormatter,
};

const generateOverviewChips = (filters, intl) =>
  Object.keys(filters)
    .map(
      (filter) =>
        filters[filter] && // is value
        !(Array.isArray(filters[filter]) && filters[filter].length === 0) && // is not an array
        formatters[filter] && // has formatter
        formatters[filter](filters[filter], intl)
    )
    .filter(Boolean);

export default generateOverviewChips;
