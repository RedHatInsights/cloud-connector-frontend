import React from 'react';
import shallow from 'zustand/shallow';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

import useConnectionsStore, { getMetaData } from '../store/connectionsStore';
import useEnhancedIntl from '../shared/useEnhancedIntl';
import ErrorState from '../shared/ErrorState';
import ConnectionDrawer from '../components/drawer/ConnectionDrawer';

const Overview = () => {
  const intl = useEnhancedIntl();

  const { error } = useConnectionsStore(getMetaData, shallow);

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle
          title={intl.formatMessage({
            id: 'overview.title',
            defaultMessage: 'Connections',
          })}
        />
      </PageHeader>
      {error && <ErrorState />}
      {!error && (
        <Section type="content">
          <ConnectionDrawer />
        </Section>
      )}
    </React.Fragment>
  );
};

export default Overview;
