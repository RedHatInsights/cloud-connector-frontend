import React from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';
import { MemoryRouter, useLocation } from 'react-router-dom';

const ShowCurrentHref = () => {
  const { pathname } = useLocation();

  return <span data-testid="currentPathname">{pathname}</span>;
};

export const TestWrapper = ({ children, initialEntries, initialIndex = 0 }) => (
  <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
    <IntlProvider locale="en">
      <React.Fragment>
        {children}
        <ShowCurrentHref />
      </React.Fragment>
    </IntlProvider>
  </MemoryRouter>
);

TestWrapper.propTypes = {
  children: PropTypes.node,
  initialEntries: PropTypes.array,
  initialIndex: PropTypes.number,
};

export default TestWrapper;
