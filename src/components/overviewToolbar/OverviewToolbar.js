import React, { useState } from 'react';
import PropTypes from 'prop-types';
import shallow from 'zustand/shallow';
import awesomeDebouncePromise from 'awesome-debounce-promise';

import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

import useConnectionsStore, { getFilters, resetFilters, setFilters } from '../../store/connectionsStore';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import createOverviewFilters from './createOverviewFilters';
import generateOverviewChips from './generateOverviewChips';

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

  return (
    <PrimaryToolbar
      useMobileLayout
      pagination={paginationConfig}
      filterConfig={createOverviewFilters(updateTextFilter, textFilters, intl)}
      activeFiltersConfig={{
        filters: generateOverviewChips({ ...filters, ...textFilters }, intl),
        onDelete: (_e, [chipGroup], deleteAll) => {
          if (deleteAll) {
            resetFilters();
            setTextFilters({ name: '' });
          } else {
            if (chipGroup.clear) {
              // text filters
              setTextFilters(chipGroup.value, '');
              setFilters(chipGroup.value, '');
            } else {
              // remove one value from an array
              const valueToRemove = chipGroup.chips[0].value;

              setFilters(
                chipGroup.value,
                filters[chipGroup.value].filter((val) => (val.value || val) !== valueToRemove)
              );
            }
          }
        },
      }}
    />
  );
};

OverviewToolbar.propTypes = { paginationConfig: PropTypes.object };

export default OverviewToolbar;
