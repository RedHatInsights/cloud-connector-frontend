import React, { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import PropTypes from 'prop-types';

import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  List,
  ListItem,
  Title,
  Button,
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
} from '@patternfly/react-core';

import useConnectionsStore, {
  getLoading,
  getMetaData,
  getSelected,
  refreshList,
  selectConnection,
  setPage,
  setPerPage,
} from '../../store/connectionsStore';
import { getConnections } from '../../store/connectionsStore';
import OverviewToolbar from '../overviewToolbar/OverviewToolbar';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar/PrimaryToolbar';
import { EmptyResultComponent } from '../../shared/EmptyRowsComposable';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import overviewActionResolver from '../../pages/overview/overviewActionResolver';
import api from '../../api';

const ConnectionDetails = ({ status, dispatchers }) => {
  console.log(status, dispatchers);

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

const ConnectionDropdown = () => {
  const selected = useConnectionsStore(getSelected, shallow);
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
      dropdownItems={overviewActionResolver(intl)({ selected }).map((item) => (
        <DropdownItem key={item.title} onClick={item.onClick}>
          {item.title}
        </DropdownItem>
      ))}
    />
  );
};

const PanelContent = ({ expand }) => {
  const selected = useConnectionsStore(getSelected, shallow);

  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (selected) {
      expand(true);

      if (document.body.clientWidth > 767) {
        const element = document.getElementById('connection-header');
        element.scrollIntoView?.({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }

      setData(undefined);
      setError(undefined);

      api.statusConnection({ account: selected.account, node_id: selected.node }).then(setData).catch(setError);
    }
  }, [`${selected?.account}-${selected?.node}`]);

  if (!selected) {
    return (
      <DrawerPanelContent minSize="200px">
        <DrawerHead>
          <DrawerActions>
            <DrawerCloseButton onClick={console.log()} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody className="pf-u-text-align-center pf-u-color-200">Select a connection to see details</DrawerPanelBody>
      </DrawerPanelContent>
    );
  }

  return (
    <DrawerPanelContent minSize="550px">
      <DrawerHead>
        <Flex>
          <FlexItem className="pf-u-mr-lg">
            <div className="pf-u-color-200 pf-u-font-size-xs">connection</div>
            <Title headingLevel="h2" size="xl" id="connection-header">
              {selected.node}
            </Title>
          </FlexItem>
          <FlexItem>
            <div className="pf-u-color-200 pf-u-font-size-xs">account</div>
            <div>{selected.account}</div>
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }} className="pf-u-my-auto">
            <ConnectionDropdown />
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

PanelContent.propTypes = {
  expand: PropTypes.func,
};

const ConnectionDrawer = () => {
  const { total, page, perPage } = useConnectionsStore(getMetaData, shallow);
  const connections = useConnectionsStore(getConnections, shallow);
  const isLoading = useConnectionsStore(getLoading);
  const [isExpanded, expand] = useState(false);

  const intl = useEnhancedIntl();

  const paginationConfig = {
    itemCount: total,
    page,
    perPage,
    onSetPage: (_e, newPage) => setPage(newPage),
    onPerPageSelect: (_e, newPerPage) => setPerPage(newPerPage),
    'data-testid': 'pagination',
  };

  const paginationConfigBottom = {
    ...paginationConfig,
    dropDirection: 'up',
    variant: 'bottom',
    isCompact: false,
    className: 'pf-u-p-0',
  };

  useEffect(() => {
    !connections && refreshList();
  }, []);

  return (
    <Drawer isStatic isExpanded={isExpanded}>
      <DrawerContent panelContent={<PanelContent expand={expand} />}>
        <DrawerContentBody>
          <OverviewToolbar paginationConfig={paginationConfig} />
          {isLoading && (
            <div className="pf-u-text-align-center pf-u-mt-lg pf-u-mb-md">
              <Spinner size="xl" />
            </div>
          )}
          {!isLoading && total === 0 && <EmptyResultComponent />}
          {!isLoading && total > 0 && (
            <DataList>
              {connections.map((con) => (
                <DataListItem key={con.account}>
                  <DataListItemRow>
                    <DataListItemCells
                      dataListCells={[
                        <DataListCell key="cell">
                          <div className="pf-u-mb-xs">
                            <div className="pf-u-color-200 pf-u-font-size-xs">
                              {intl.formatMessage({ id: 'connection.account', defaultMessage: 'account' })}
                            </div>
                            {con.account}
                          </div>
                          <div className="pf-u-color-200 pf-u-font-size-xs">
                            {intl.formatMessage({ id: 'connection.connections', defaultMessage: 'connections' })}
                          </div>
                          <List variant="inline">
                            {con.connections.map((node) => (
                              <ListItem key={node}>
                                <Button variant="link" isInline onClick={() => selectConnection(con.account, node)}>
                                  {node}
                                </Button>
                              </ListItem>
                            ))}
                          </List>
                        </DataListCell>,
                      ]}
                    />
                  </DataListItemRow>
                </DataListItem>
              ))}
            </DataList>
          )}
          <PrimaryToolbar className="cloud-connector-bottom-toolbar" pagination={paginationConfigBottom} />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ConnectionDrawer;
