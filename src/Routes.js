import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import SectionLoader from './components/loaders/SectionLoader';

const Accounts = lazy(() => import(/* webpackChunkName: "overviewPage" */ './pages/Accounts'));
const Connections = lazy(() => import(/* webpackChunkName: "overviewPage" */ './pages/Connections'));

export const routes = {
  connections: {
    path: '/connections',
  },
  accounts: {
    path: '/accounts',
  },
};

export const replaceRouteId = (path, id) => path.replace(':id', id);

const Routes = () => (
  <Suspense fallback={<SectionLoader />}>
    <Switch>
      <Route path={routes.accounts.path} component={Accounts} />
      <Route path={routes.connections.path} component={Connections} />
      <Redirect to={routes.accounts.path} />
    </Switch>
  </Suspense>
);

export default Routes;
