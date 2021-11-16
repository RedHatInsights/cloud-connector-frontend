import React, { useCallback, useEffect, useState } from 'react';

import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';

import './userTypeahead.scss';

import useConnectionsStore, { getFilters, setFilters } from '../../store/overviewStore';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import shallow from 'zustand/shallow';
import getUsersApi from '../../api/getUsers';

const UserTypeahead = () => {
  const [isOpen, open] = useState();
  const [options, setOptions] = useState();
  const intl = useEnhancedIntl();
  const filters = useConnectionsStore(getFilters, shallow);
  const getUsers = useCallback(getUsersApi(), []);

  useEffect(async () => {
    const results = await getUsers();

    setOptions(results);
  }, []);

  const onFilter = async (value) => {
    setOptions();
    const results = await getUsers(value);
    setOptions(results);
  };

  const placeholder = intl.formatMessage({ id: 'overview.table.commander.placeholder', defaultMessage: 'Filter by commander' });

  const addValue = (value) => {
    const option = options.find((option) => option.label === value);
    const shouldRemove = filters.incident_commander.find((option) => option.label === value);

    if (!shouldRemove) {
      setFilters('incident_commander', [...filters.incident_commander, option]);
    } else {
      setFilters(
        'incident_commander',
        filters.incident_commander.filter((v) => v.value !== option.value)
      );
    }
  };

  return (
    <Select
      variant={SelectVariant.typeaheadMulti}
      typeAheadAriaLabel={placeholder}
      onToggle={() => open(!isOpen)}
      onSelect={(_, value) => addValue(value)}
      onClear={() => setFilters('incident_commander', [])}
      selections={filters.incident_commander.map(({ label }) => label)}
      isOpen={isOpen}
      placeholderText={placeholder}
      onTypeaheadInputChanged={onFilter}
      onFilter={() => null}
      className="rca-toolbar-option"
    >
      {options?.map((option, index) => <SelectOption key={index} value={option.label} />) || [
        <SelectOption key="loading" value="Loading data..." isDisabled isPlaceholder />,
      ]}
    </Select>
  );
};

export default UserTypeahead;
