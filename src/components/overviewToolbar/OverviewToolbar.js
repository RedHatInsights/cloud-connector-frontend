import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import shallow from 'zustand/shallow';
import awesomeDebouncePromise from 'awesome-debounce-promise';

import { InputGroup, InputGroupText, SearchInput, TextInput } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

import useConnectionsStore, { getFilters, setAccount } from '../../store/connectionsStore';
import useEnhancedIntl from '../../shared/useEnhancedIntl';

const debouncedSetFilters = awesomeDebouncePromise(setAccount, 500);

const OverviewToolbar = ({ paginationConfig }) => {
  const intl = useEnhancedIntl();

  const filters = useConnectionsStore(getFilters, shallow);

  const [account_number, setAccountNumber] = useState(filters.account_number);

  const updateTextFilter = (value, debounced = true) => {
    setAccountNumber(value);
    debounced ? debouncedSetFilters(value) : setAccount(value);
  };

  useEffect(() => {
    if (filters.account_number !== account_number) {
      setAccountNumber(filters.account_number);
    }
  }, [filters.account_number]);

  return (
    <PrimaryToolbar className="cloud-connector-overview-toolbar" useMobileLayout pagination={paginationConfig}>
      <div>
        <InputGroup>
          <InputGroupText variant="plain">
            {intl.formatMessage({ id: 'connection.account', defaultMessage: 'Account:' })}
          </InputGroupText>
          <SearchInput
            aria-label={intl.formatMessage({
              id: 'overview.table.account_number.placeholder',
              defaultMessage: 'Find by account number',
            })}
            placeholder="i.e. 9253845"
            value={account_number}
            onChange={updateTextFilter}
            onClear={() => updateTextFilter('', false)}
            className="cloud-connector-search-input"
          />
        </InputGroup>
      </div>
    </PrimaryToolbar>
  );
};

OverviewToolbar.propTypes = { paginationConfig: PropTypes.object };

export default OverviewToolbar;
