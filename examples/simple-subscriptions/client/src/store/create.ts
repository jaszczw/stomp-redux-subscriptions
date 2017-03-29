import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose} from 'redux';
import { rootReducers } from './reducer'
import rootSaga from './sagas';
import { ReduxState } from './reduxState'

// Add redux devtool support
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  thunkMiddleware,
  sagaMiddleware,
];

export const store = createStore<ReduxState>(
  rootReducers,
  composeEnhancers(
    applyMiddleware(...middlewares),
  ),
);

sagaMiddleware.run(rootSaga);