import * as React from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {store} from './store'
import MulitplePatientsTables from './containers/PatientsPage/MultiplePatientsTables';

const rootEl = document.getElementById('app');

render(
  <Provider store={store}>
    <MulitplePatientsTables/>
  </Provider>
  , rootEl);