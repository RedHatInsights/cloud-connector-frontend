import React from 'react';
import PropTypes from 'prop-types';

import { Tr, Td } from '@patternfly/react-table';

const ConnectorTableRow = ({ rowIndex, columns, row, actionResolver }) => (
  <Tr key={rowIndex}>
    {row.cells.map((cell, cellIndex) => (
      <Td
        key={`${rowIndex}_${cellIndex}`}
        dataLabel={columns[cellIndex].dataLabel || columns[cellIndex].title || columns[cellIndex]}
      >
        {cell.title || cell}
      </Td>
    ))}
    {actionResolver && <Td key={`${rowIndex}_actions`} actions={{ items: actionResolver(row) }} />}
  </Tr>
);

ConnectorTableRow.propTypes = {
  columns: PropTypes.array,
  row: PropTypes.object,
  actionResolver: PropTypes.func,
  rowIndex: PropTypes.number,
};

export default ConnectorTableRow;
