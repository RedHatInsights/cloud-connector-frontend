import React, { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';

import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Button,
  Spinner,
  List,
  ListItem,
} from '@patternfly/react-core';

import useConnectionsStore, {
  getAccountConnections,
  getFilters,
  getLoading,
  getMetaData,
  refreshList,
  setClient,
  setAccount,
  setPage,
  setPerPage,
} from '../../store/connectionsStore';
import { getConnections } from '../../store/connectionsStore';
import OverviewToolbar from '../overviewToolbar/OverviewToolbar';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar/PrimaryToolbar';
import EmptyResultComponent from '../../shared/EmptyResultComponent';
import useEnhancedIntl from '../../shared/useEnhancedIntl';
import Connection from '../connection/Connection';
import ClientInput from '../clientInput/ClientInput';

const ConnectionDrawer = () => {
  const { total, page, perPage } = useConnectionsStore(getMetaData, shallow);
  const filters = useConnectionsStore(getFilters, shallow);
  const connections = useConnectionsStore(getConnections, shallow);
  const account_connections = useConnectionsStore(getAccountConnections, shallow);
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
    refreshList(Object.fromEntries(new URLSearchParams(window.location.search).entries()));
  }, []);

  return (
    <Drawer isStatic isExpanded={isExpanded}>
      <DrawerContent panelContent={<Connection expand={expand} account={filters.account_number} />}>
        <DrawerContentBody>
          <OverviewToolbar {...(!filters.account_number && { paginationConfig })} />
          {isLoading && !filters.account_number && (
            <div className="pf-u-text-align-center pf-u-mt-lg pf-u-mb-md">
              <Spinner size="xl" />
            </div>
          )}
          {!isLoading && !filters.account_number && total === 0 && <EmptyResultComponent />}
          {!isLoading && !filters.account_number && total > 0 && (
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
                          <Button variant="link" isInline onClick={() => setAccount(String(con.account))}>
                            {intl.formatMessage(
                              { id: 'connection.connections.total', defaultMessage: '{length} connections' },
                              { length: con.connections_count }
                            )}
                          </Button>
                        </DataListCell>,
                      ]}
                    />
                  </DataListItemRow>
                </DataListItem>
              ))}
            </DataList>
          )}
          {filters.account_number && (
            <DataList>
              <DataListItem key={filters.account_number}>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="cell">
                        <PrimaryToolbar className="pf-u-p-0 connections-toolbar pf-u-mb-md" pagination={paginationConfig}>
                          <div className="pf-u-mb-xs">
                            <ClientInput className="cloud-connector-inpage-client-input" />
                          </div>
                        </PrimaryToolbar>
                        <div className="pf-u-color-200 pf-u-font-size-xs">
                          {intl.formatMessage({ id: 'connection.connections', defaultMessage: 'connections' })}
                        </div>
                        <List isPlain isBordered>
                          {!isLoading &&
                            account_connections?.map((node) => (
                              <ListItem key={node}>
                                <Button variant="link" isInline onClick={() => setClient(node)}>
                                  {node}
                                </Button>
                              </ListItem>
                            ))}
                          {isLoading && (
                            <div className="pf-u-text-align-center pf-u-mt-lg pf-u-mb-md">
                              <Spinner size="xl" />
                            </div>
                          )}
                          {!isLoading && total === 0 && <EmptyResultComponent />}
                        </List>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            </DataList>
          )}
          {!isLoading && <PrimaryToolbar className="cloud-connector-bottom-toolbar" pagination={paginationConfigBottom} />}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ConnectionDrawer;
