import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Nav, NavItem, NavList, PageSidebar } from '@patternfly/react-core';

import { routes } from '../../Routes';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import { resetFilters } from '../../store/connectionsStore';

const Sidebar = (props) => {
  const { push } = useHistory();
  const intl = useEnhancedIntl();

  const { pathname } = useLocation();

  return (
    <PageSidebar
      {...props}
      nav={
        <Nav aria-label="Nav">
          <NavList>
            <NavItem
              itemId={0}
              isActive={pathname.startsWith('/accounts')}
              onClick={() => {
                resetFilters();
                push(routes.accounts.path);
              }}
              to={routes.accounts.path}
              preventDefault
            >
              {intl.formatMessage({
                id: 'sidebar.connections.title',
                defaultMessage: 'Accounts',
              })}
            </NavItem>
            <NavItem
              itemId={1}
              isActive={pathname.startsWith('/connections')}
              onClick={() => {
                resetFilters();
                push(routes.connections.path);
              }}
              to={routes.connections.path}
              preventDefault
            >
              {intl.formatMessage({
                id: 'sidebar.connections.title',
                defaultMessage: 'Connections',
              })}
            </NavItem>
          </NavList>
        </Nav>
      }
    />
  );
};

export default Sidebar;
