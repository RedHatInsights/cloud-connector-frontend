import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { PageSection, Page as PFPage } from '@patternfly/react-core';

import Header from './Header';
import Sidebar from './Sidebar';

const Page = ({ children }) => {
  const [isNavOpen, setOpen] = useState(true);

  return (
    <PFPage
      header={<Header isNavOpen={isNavOpen} onNavToggle={() => setOpen(!isNavOpen)} />}
      sidebar={<Sidebar isNavOpen={isNavOpen} />}
    >
      <PageSection className="pf-u-p-0">{children}</PageSection>
    </PFPage>
  );
};

Page.propTypes = {
  children: PropTypes.node,
};

export default Page;
