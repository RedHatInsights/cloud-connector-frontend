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
  Dropdown,
  DropdownToggle,
  DropdownToggleAction,
  DropdownItem,
  FlexItem,
  Flex,
  DescriptionList,
  Label,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  DrawerActions,
  DrawerCloseButton,
  TextContent,
} from '@patternfly/react-core';

import useConnectionsStore, { getFilters } from '../../store/connectionsStore';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import overviewActionResolver from '../../pages/accounts/accountsActionResolver';
import api from '../../api';
import { routes } from '../../Routes';
import { createQuery } from '../../shared/updateQuery';

const ConnectionDetails = ({ status, dispatchers }) => {
  return (
    <React.Fragment>
      <div className="pf-u-color-200 pf-u-font-size-xs pf-u-mb-xs">status</div>
      <Label>{status}</Label>
      <div className="pf-u-color-200 pf-u-font-size-xs pf-u-mb-xs pf-u-mt-md">dispatchers</div>
      {Object.keys(dispatchers).map((key) => {
        const value = dispatchers[key];
        const keys = Object.keys(value);

        return (
          <React.Fragment key={key}>
            <Title headingLevel="h3" size="md" className="pf-u-mt-md pf-u-mb-sm">
              {key}
            </Title>
            <DescriptionList
              columnModifier={{
                default: '2Col',
              }}
            >
              {!keys.length && <div className="pf-u-color-200">Not available</div>}
              {keys.map((key) => (
                <DescriptionListGroup key={key}>
                  <DescriptionListTerm>{key}</DescriptionListTerm>
                  <DescriptionListDescription>{value[key]}</DescriptionListDescription>
                </DescriptionListGroup>
              ))}
            </DescriptionList>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

ConnectionDetails.propTypes = {
  status: PropTypes.oneOf(['connected', 'disconnected']),
  dispatchers: PropTypes.object,
};

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
