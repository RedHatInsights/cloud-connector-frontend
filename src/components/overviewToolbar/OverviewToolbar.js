import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import shallow from 'zustand/shallow';
import awesomeDebouncePromise from 'awesome-debounce-promise';

import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

import useConnectionsStore, { getFilters, resetFilters, setFilters } from '../../store/connectionsStore';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import createOverviewFilters from './createOverviewFilters';
//import generateOverviewChips from './generateOverviewChips';
import { Button } from '@patternfly/react-core';

const debouncedSetFilters = awesomeDebouncePromise(setFilters, 500);

const OverviewToolbar = ({ paginationConfig }) => {
  const intl = useEnhancedIntl();

  const filters = useConnectionsStore(getFilters, shallow);

  const [textFilters, setTextFilters] = useState({
    account_number: filters.account_number,
    client_id: filters.client_id,
  });

  const updateTextFilter = (name, value) => {
    setTextFilters((prevState) => ({ ...prevState, [name]: value }));
    debouncedSetFilters(name, value);
  };

  useEffect(() => {
    if (filters.account_number !== textFilters.account_number) {
      setTextFilters((prevState) => ({ ...prevState, account_number: filters.account_number }));
    }
  }, [filters.account_number]);

  return (
    <PrimaryToolbar
      className="cloud-connector-overview-toolbar"
      useMobileLayout
      pagination={paginationConfig}
      filterConfig={createOverviewFilters(updateTextFilter, textFilters, intl)}
      // activeFiltersConfig={{
      //   filters: generateOverviewChips({ ...filters, ...textFilters }, intl),
      //   onDelete: (_e, [chipGroup], deleteAll) => {
      //     if (deleteAll) {
      //       resetFilters();
      //       setTextFilters({ name: '' });
      //     } else {
      //       if (chipGroup.clear) {
      //         // text filters
      //         setTextFilters(chipGroup.value, '');
      //         setFilters(chipGroup.value, '');
      //       } else {
      //         // remove one value from an array
      //         const valueToRemove = chipGroup.chips[0].value;

      //         setFilters(
      //           chipGroup.value,
      //           filters[chipGroup.value].filter((val) => (val.value || val) !== valueToRemove)
      //         );
      //       }
      //     }
      //   },
      // }}
    >
      {filters.account_number && (
        <Button
          variant="link"
          isInline
          onClick={() => {
            resetFilters();
            setTextFilters({ account_number: '', client_id: '' });
          }}
        >
          Clear selection
        </Button>
      )}
    </PrimaryToolbar>
  );
};

OverviewToolbar.propTypes = { paginationConfig: PropTypes.object };

export default OverviewToolbar;
