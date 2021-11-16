import React from 'react';
import PropTypes from 'prop-types';

import { Bullseye, Spinner } from '@patternfly/react-core';
import { Td, Tr } from '@patternfly/react-table';

const LoadingRowsComposable = ({ columns }) => (
  <Tr>
    <Td colSpan={columns?.length}>
      <Bullseye className="pf-u-mt-xl pf-u-mb-xl">
        <Spinner size="xl" />
      </Bullseye>
    </Td>
  </Tr>
);

LoadingRowsComposable.propTypes = {
  columns: PropTypes.array,
};

export default LoadingRowsComposable;
