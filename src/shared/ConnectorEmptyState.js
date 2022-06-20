import React from 'react';
import PropTypes from 'prop-types';

import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

import useEnhancedIntl from './useEnhancedIntl';

const ConnectorEmptyState = ({ title, showFilterButtons, resetFilters, filterDescription, hideIcon }) => {
  const intl = useEnhancedIntl();

  return (
    <EmptyState variant="small">
      {!hideIcon && <EmptyStateIcon icon={SearchIcon} />}
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      {showFilterButtons && (
        <React.Fragment>
          <EmptyStateBody>{filterDescription}</EmptyStateBody>
          <Button variant="link" onClick={resetFilters}>
            {intl.formatMessage({
              id: 'empty.state.overview.clearAllFilters',
              defaultMessage: 'Clear all filters',
            })}
          </Button>
        </React.Fragment>
      )}
    </EmptyState>
  );
};

ConnectorEmptyState.propTypes = {
  title: PropTypes.node,
  showFilterButtons: PropTypes.bool,
  resetFilters: PropTypes.func,
  filterDescription: PropTypes.node,
  hideIcon: PropTypes.bool,
};

export default ConnectorEmptyState;
