import React from 'react';
import PropTypes from 'prop-types';

import { TableComposable } from '@patternfly/react-table';

import ConnectorTableBody from './ConnectorTableBody';
import ConnectorTableHeader from './ConnectorTableHeader';

const ConnectorTable = ({ columns, rows, isLoading, total, actionResolver, EmptyState, ...rest }) => (
  <TableComposable {...rest}>
    <ConnectorTableHeader columns={columns} />
    <ConnectorTableBody
      columns={columns}
      isLoading={isLoading}
      total={total}
      actionResolver={actionResolver}
      rows={rows}
      EmptyState={EmptyState}
    />
  </TableComposable>
);

ConnectorTable.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  actionResolver: PropTypes.func,
  isLoading: PropTypes.bool,
  total: PropTypes.number,
  EmptyState: PropTypes.func,
};

export default ConnectorTable;
