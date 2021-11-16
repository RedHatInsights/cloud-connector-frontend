import React from 'react';
import PropTypes from 'prop-types';

import { Tbody } from '@patternfly/react-table';

import LoadingRowsComposable from './LoadingRowsComposable';
import EmptyRowsComposable from './EmptyRowsComposable';
import ConnectorTableRow from './ConnectorTableRow';

const ConnectorTableBody = ({ columns, rows, actionResolver, isLoading, total, EmptyState }) => (
  <Tbody>
    {isLoading && <LoadingRowsComposable columns={columns} />}
    {!isLoading && total === 0 && <EmptyRowsComposable columns={columns} Component={EmptyState} />}
    {!isLoading &&
      total > 0 &&
      rows?.map((row, rowIndex) => (
        <ConnectorTableRow row={row} key={rowIndex} rowIndex={rowIndex} columns={columns} actionResolver={actionResolver} />
      ))}
  </Tbody>
);

ConnectorTableBody.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  actionResolver: PropTypes.func,
  isLoading: PropTypes.bool,
  total: PropTypes.number,
  EmptyState: PropTypes.func,
};

export default ConnectorTableBody;
