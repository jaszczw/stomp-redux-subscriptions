import * as React from 'react';
import { connect } from 'react-redux'
import { PatientsViewModel } from './viewModels';
import {PatientsTableComponent} from './patientsTableComponent'
import { ReduxState } from '../../store'
import { getAllPatientsViewModels } from './selectors'

const mapDispatchToProps = {
};

const mapStateToProps = (state : ReduxState) => {
  return {
    patients : getAllPatientsViewModels(state)
  }  
}

export const PatientsTableContainer = connect(mapStateToProps, mapDispatchToProps)(PatientsTableComponent);
