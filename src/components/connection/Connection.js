import React, { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Title,
  Spinner,
  FlexItem,
  Flex,
  DrawerActions,
  DrawerCloseButton,
  TextContent,
} from '@patternfly/react-core';

import useConnectionsStore, { getFilters } from '../../store/connectionsStore';
import api from '../../api';
import { routes } from '../../Routes';
import { createQuery } from '../../shared/updateQuery';
import ConnectionDetails from './ConnectionDetails';
import ConnectionDropdown from './ConnectionDropdown';

const Connection = ({ expand, ...props }) => {
  const filters = useConnectionsStore(getFilters, shallow);

  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (filters.client_id) {
      expand(true);

      if (document.body.clientWidth > 767) {
        const element = document.getElementById('connection-header');
        element.scrollIntoView?.({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }

      setData(undefined);
      setError(undefined);

      api.statusConnection({ node_id: filters.client_id }).then(setData).catch(setError);
    }
  }, [filters.client_id]);

  if (!filters.client_id) {
    return (
      <DrawerPanelContent minSize="200px" {...props}>
        <DrawerHead>
          <DrawerActions>
            <DrawerCloseButton onClick={() => expand(false)} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody className="pf-u-text-align-center pf-u-color-200">
          {!filters.account_number ? 'Select an account to see a list of connections' : 'Select a connection to see details'}
        </DrawerPanelBody>
      </DrawerPanelContent>
    );
  }

  return (
    <DrawerPanelContent minSize="550px" {...props}>
      <DrawerHead>
        <Flex>
          <FlexItem className="pf-u-mr-lg">
            <div className="pf-u-color-200 pf-u-font-size-xs">connection</div>
            <Title headingLevel="h2" size="xl" id="connection-header">
              {filters.client_id}
            </Title>
          </FlexItem>
          {data && (
            <FlexItem>
              <div className="pf-u-color-200 pf-u-font-size-xs">account</div>
              <TextContent>
                <Link
                  to={{
                    pathname: routes.accounts.path,
                    search: createQuery(data.account, filters.client_id),
                  }}
                >
                  {data.account}
                </Link>
              </TextContent>
            </FlexItem>
          )}
          <FlexItem align={{ default: 'alignRight' }} className="pf-u-my-auto">
            <ConnectionDropdown id={filters.client_id} />
          </FlexItem>
        </Flex>
        <DrawerActions>
          <DrawerCloseButton onClick={() => expand(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        {!data && !error && (
          <div className="pf-u-text-align-center pf-u-mt-lg pf-u-mb-md">
            <Spinner size="xl" />
          </div>
        )}
        {error && (
          <div className="pf-u-text-align-center pf-u-color-200">
            Unable to receive data. Check your connection and try again.
          </div>
        )}
        {data && <ConnectionDetails {...data} />}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};

Connection.propTypes = {
  expand: PropTypes.func,
};

export default Connection;
