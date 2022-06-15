import React, { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { Card, CardBody, Drawer, DrawerContent, Text, TextContent } from '@patternfly/react-core';

import useConnectionsStore, { getFilters, setClient } from '../../store/connectionsStore';
import Connection from '../connection/Connection';
import ClientInput from '../clientInput/ClientInput';

const ConnectionsList = () => {
  const filters = useConnectionsStore(getFilters, shallow);

  useEffect(() => {
    const clientId = Object.fromEntries(new URLSearchParams(window.location.search).entries()).client_id;

    if (clientId) {
      setClient(clientId);
    }
  }, []);

  return (
    <Card isPlain className="pf-u-background-color-100">
      <CardBody className="pf-u-p-0">
        <ClientInput />
        {!filters.client_id && (
          <TextContent>
            <Text className="pf-u-text-align-center pf-u-color-200 pf-u-my-lg">{'Find by client id to see the connection'}</Text>
          </TextContent>
        )}
        {filters.client_id && (
          <Drawer isStatic isExpanded>
            <DrawerContent
              panelContent={<Connection expand={(isOpen) => !isOpen && setClient('')} hasNoBorder minSize="100%" />}
            />
          </Drawer>
        )}
      </CardBody>
    </Card>
  );
};

export default ConnectionsList;
