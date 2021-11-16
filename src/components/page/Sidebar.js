import React from 'react';
import { useHistory } from 'react-router-dom';

import { Nav, NavItem, NavList, PageSidebar } from '@patternfly/react-core';

import { routes } from '../../Routes';
import useEnhancedIntl from '../../shared/useEnhancedIntl';

const Sidebar = (props) => {
  const { push } = useHistory();
  const intl = useEnhancedIntl();

  return (
    <PageSidebar
      {...props}
      nav={
        <Nav aria-label="Nav">
          <NavList>
            <NavItem itemId={0} isActive onClick={() => push(routes.overview.path)} to={routes.overview.path} preventDefault>
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
