import React from 'react';

import Section from '@redhat-cloud-services/frontend-components/Section';
import { Card, CardBody } from '@patternfly/react-core';

import Loader from './Loader';

const SectionLoader = () => {
  return (
    <Section type="content" role="progressbar">
      <Card>
        <CardBody>
          <Loader height="400px" />
        </CardBody>
      </Card>
    </Section>
  );
};

export default SectionLoader;
