import React from 'react';
import shallow from 'zustand/shallow';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

import useConnectionsStore, { getMetaData } from '../store/connectionsStore';
import useEnhancedIntl from '../shared/useEnhancedIntl';
import ErrorState from '../shared/ErrorState';
import ConnectionsList from '../components/connections/ConnectionsList';

const Connections = () => {
  const intl = useEnhancedIntl();

  const { error } = useConnectionsStore(getMetaData, shallow);

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle
          title={intl.formatMessage({
            id: 'connections.title',
            defaultMessage: 'Connections',
          })}
        />
      </PageHeader>
      {error && <ErrorState />}
      {!error && (
        <Section type="content">
          <ConnectionsList />
        </Section>
      )}
    </React.Fragment>
  );
};

export default Connections;
