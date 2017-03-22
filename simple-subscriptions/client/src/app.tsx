import * as React from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PatientsTableContainer } from './containers/PatientsPage';
import { ProvidePatients } from './containers/PatientsPage/providePatients'
import {store} from './store'


const rootEl = document.getElementById('app');

render(
   <Provider store={store}>
      <ProvidePatients>
        <PatientsTableContainer/>
      </ProvidePatients>
   </Provider>      
  , rootEl);