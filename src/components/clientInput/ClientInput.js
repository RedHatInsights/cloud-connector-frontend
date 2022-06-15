import React, { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';

import { SearchInput } from '@patternfly/react-core';

import useConnectionsStore, { getFilters, setClient } from '../../store/connectionsStore';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import awesomeDebouncePromise from 'awesome-debounce-promise';

const debouncedSetFilters = awesomeDebouncePromise(setClient, 500);

const ClientInput = (props) => {
  const intl = useEnhancedIntl();

  const filters = useConnectionsStore(getFilters, shallow);

  const [client_id, setClientId] = useState(filters.client_id);

  const updateTextFilter = (value, debounced = true) => {
    setClientId(value);
    debounced ? debouncedSetFilters(value) : setClient(value);
  };

  useEffect(() => {
    if (filters.client_id !== client_id) {
      setClientId(filters.client_id);
    }
  }, [filters.client_id]);

  return (
    <SearchInput
      placeholder={intl.formatMessage({
        id: 'overview.table.client_id.placeholder',
        defaultMessage: 'Find by client id',
      })}
      value={client_id}
      onChange={updateTextFilter}
      onClear={() => updateTextFilter('')}
      className="pf-u-mx-lg pf-u-mt-lg cloud-connector-connection-search"
      {...props}
    />
  );
};

export default ClientInput;
