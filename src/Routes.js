import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import SectionLoader from './components/loaders/SectionLoader';

const Overview = lazy(() => import(/* webpackChunkName: "overviewPage" */ './pages/Overview'));

export const routes = {
  overview: {
    path: '/',
  },
  connection: {
    path: '/connection/:id',
  },
};

export const replaceRouteId = (path, id) => path.replace(':id', id);

const Routes = () => (
  <Suspense fallback={<SectionLoader />}>
    <Switch>
      <Route path={routes.overview.path} component={Overview} />
      <Redirect to={routes.overview.path} />
    </Switch>
  </Suspense>
);

export default Routes;
