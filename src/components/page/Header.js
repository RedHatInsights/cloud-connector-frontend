import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import {
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  PageToggleButton,
  Brand,
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/js/icons/bars-icon';

import '../../assets/logo.svg';
import { routes } from '../../Routes';

const Header = ({ isNavOpen, onNavToggle }) => {
  const { push } = useHistory();

  return (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton variant="plain" aria-label="Global navigation" isNavOpen={isNavOpen} onNavToggle={onNavToggle}>
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand
          href="/"
          onClick={(e) => {
            e.preventDefault();
            push(routes.accounts.path);
          }}
        >
          <React.Fragment>
            <Brand src="/public/logo.svg" alt="Red Hat logo" className="cloud-connector-logo" />
            <span className="pf-u-ml-md cloud-connector-logo-text">Cloud Connector</span>
          </React.Fragment>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent />
    </Masthead>
  );
};

Header.propTypes = {
  isNavOpen: PropTypes.bool.isRequired,
  onNavToggle: PropTypes.func.isRequired,
};

export default Header;
