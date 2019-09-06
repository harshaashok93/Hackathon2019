import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import reducer from './reducer';

const configureStore = (initialState, history) => {
  const middleware = applyMiddleware(routerMiddleware(history));
  let thunkApplied = applyMiddleware(thunk);

  if (process.env.NODE_ENV === 'development') {
    thunkApplied = composeWithDevTools(thunkApplied);
  }

  return createStore(
    reducer,
    thunkApplied,
    compose(middleware),
    initialState
  );
};

export default configureStore;
