import React from 'react';
import config from 'config';
import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  PageBuilder,
  LayoutContainer,
  ResearchLayoutBuilder,
  RoutePrivateContainer,
  AnalystsDetailBuilder,
} from 'containers';

import {
  AdminRegistrationPage,
  AdminEventRequests,//eslint-disable-line
  AdminEventCalendarPage,
  AdminSearchSelectionPage,
  HistoricalPdfPage
} from 'components';


let routesConfig;

if (process.env.SITE_ENV === 'corp') {
  routesConfig = require('./routes.config.corp.js').config;
} else {
  routesConfig = require('./routes.config.js').config;
}

const getRoutesComponentMapping = (history) => {
  return Object.keys(routesConfig).map((config) => {
    const item = routesConfig[config];
    return <Route exact path={item.route} history={history} component={item.component} />;
  });
};

/* eslint-disable */
const AppRoutes = ({ history }) => (
  <Switch>
    <LayoutContainer history={history}>
      <Switch>
        {getRoutesComponentMapping(history)}
        <Route exact path={'/research/:pid'} component={ResearchLayoutBuilder} />
        <Route exact path={`${config.analystURLPrefix}/:code`} component={AnalystsDetailBuilder} />
        {/*<RoutePrivateContainer path={'/profile/:subpage?'} component={ProfileLandingPage} />*/}
        <RoutePrivateContainer superUserOnly={true} path={'/admin/'} history={history} component={AdminRegistrationPage} />
        {/*<RoutePrivateContainer superUserOnly={true} path={'/admin-event-requests/'} component={AdminEventRequests} />*/}
        <RoutePrivateContainer superUserOnly={true} path={'/admin-event-calendar/'} component={AdminEventCalendarPage} />
        <RoutePrivateContainer superUserOnly={true} path={'/search-defaults/'} component={AdminSearchSelectionPage} />
        <Route exact path={'/pdf/:radarLink'} history={history} component={HistoricalPdfPage} />
        <Route path={'/*'} component={PageBuilder} />
      </Switch>
    </LayoutContainer>
  </Switch>
);

/* eslint-enable */

export default AppRoutes;
