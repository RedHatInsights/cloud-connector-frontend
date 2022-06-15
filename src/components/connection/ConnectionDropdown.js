import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, DropdownToggle, DropdownToggleAction, DropdownItem } from '@patternfly/react-core';

import useEnhancedIntl from '../../shared/useEnhancedIntl';
import overviewActionResolver from '../../pages/accounts/accountsActionResolver';

const ConnectionDropdown = ({ id }) => {
  const [isOpen, open] = useState(false);
  const intl = useEnhancedIntl();

  return (
    <Dropdown
      onSelect={() => {
        open(false);
      }}
      position="right"
      toggle={
        <DropdownToggle
          splitButtonItems={[
            <DropdownToggleAction key="action" onClick={() => open(!isOpen)}>
              {intl.formatMessage({
                id: 'connection.header.actions',
                defaultMessage: 'Actions',
              })}
            </DropdownToggleAction>,
          ]}
          splitButtonVariant="action"
          onToggle={() => open(!isOpen)}
        />
      }
      isOpen={isOpen}
      dropdownItems={overviewActionResolver(intl)({ id }).map((item) => (
        <DropdownItem key={item.title} onClick={item.onClick}>
          {item.title}
        </DropdownItem>
      ))}
    />
  );
};

ConnectionDropdown.propTypes = {
  id: PropTypes.string,
};

export default ConnectionDropdown;
