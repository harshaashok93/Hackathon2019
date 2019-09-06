import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { env } from 'config';
import { DumbledoreLintContainer } from 'containers';
import Perf from 'react-addons-perf';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from 'store/configure';
import AppRoutes from 'routes';
import { createBrowserHistory } from 'history';

require('./styles/app.scss');

const root = document.getElementById('app');
const history = createBrowserHistory();
const store = configureStore({}, history);
const isDev = env === 'local';

if (isDev) {
  window.Perf = Perf;
}

const App = () => {
  return (
    <AppContainer>
      <Provider store={store} key={Math.random()}>
        <ConnectedRouter history={history} key={Math.random()}>
          <AppRoutes history={history} />
        </ConnectedRouter>
      </Provider>
    </AppContainer>
  );
};

if (module.hot) {
  module.hot.accept();
}

export default App;