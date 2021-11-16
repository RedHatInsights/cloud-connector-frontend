import overviewFormatters from './overviewFormatters';

const createOverviewRows = (connections, intl) =>
  connections.map((connection) => ({
    cells: Object.keys(connection).map(
      (key) => overviewFormatters(connection[key], key, connection, intl)?.() || 'Not available'
    ),
    connection,
  }));

export default createOverviewRows;
