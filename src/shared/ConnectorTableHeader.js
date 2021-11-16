import React from 'react';
import PropTypes from 'prop-types';

import { Thead, Tr, Th } from '@patternfly/react-table';

const ConnectorTableHeader = ({ columns }) => (
  <Thead>
    <Tr>
      {columns.map((column, columnIndex) => (
        <Th key={columnIndex} modifier="wrap">
          {column.title || column}
        </Th>
      ))}
    </Tr>
  </Thead>
);

ConnectorTableHeader.propTypes = {
  columns: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          title: PropTypes.node,
        }),
        PropTypes.node,
      ])
    ),
    PropTypes.node,
  ]),
};

export default ConnectorTableHeader;
