import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import Page from './components/page/Page';
import Routes from './Routes';
import NotificationsPortal from './components/notificationsPortal/NotificationsPortal';

import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './app.scss';

const App = () => {
  return (
    <IntlProvider locale="en">
      <React.Fragment>
        <NotificationsPortal />
        <Router basename="/">
          <Page>
            <Routes />
          </Page>
        </Router>
      </React.Fragment>
    </IntlProvider>
  );
};

export default App;
