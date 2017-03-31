import * as React from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {store} from './store'
import {ListOfWidgets} from './containers/ListOfWidgets';
import {ActiveSubscriptions} from './containers/ActiveSubscriptions';

const rootEl = document.getElementById('app');

render(
  <Provider store={store}>
    <div>
      <ListOfWidgets/>
      <ActiveSubscriptions/>
    </div>
  </Provider>
  , rootEl);
