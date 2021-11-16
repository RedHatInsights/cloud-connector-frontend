import React from 'react';
import shallow from 'zustand/shallow';
import PropTypes from 'prop-types';

import { Td, Tr } from '@patternfly/react-table';

import useEnhancedIntl from './useEnhancedIntl';
import useConnectionsStore, { getFilters, resetFilters } from '../store/connectionsStore';
import ConnectorEmptyState from './ConnectorEmptyState';

export const EmptyResultComponent = () => {
  const intl = useEnhancedIntl();

  const filters = useConnectionsStore(getFilters, shallow);

  const showFilterButtons = Object.values(filters).find((filter) => filter?.length || filter === true);

  return (
    <ConnectorEmptyState
      showFilterButtons={Boolean(showFilterButtons)}
      title={intl.formatMessage({ id: 'empty.state.overview.title', defaultMessage: 'No connections found' })}
      filterDescription={intl.formatMessage({
        id: 'empty.state.overview.description',
        defaultMessage: 'No connections match the filter criteria. Remove all filters or clear all filters to show results.',
      })}
      resetFilters={resetFilters}
    />
  );
};

const EmptyRowsComposable = ({ Component = EmptyResultComponent, columns }) => (
  <Tr>
    <Td colSpan={columns?.length}>
      <Component />
    </Td>
  </Tr>
);

EmptyRowsComposable.propTypes = {
  Component: PropTypes.elementType,
  columns: PropTypes.array,
};

export default EmptyRowsComposable;
