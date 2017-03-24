import * as React from 'react';
import { connect } from 'react-redux'
import { PatientsViewModel } from './viewModels';
import {PatientsTableComponent} from './patientsTableComponent'
import { ReduxState } from '../../store'
import { getPatientsOnFloorViewModels } from './selectors'

const mapDispatchToProps = {
};

const mapStateToProps = (state : ReduxState, ownProps) => {
  return {
    patients : getPatientsOnFloorViewModels(state, ownProps)
  }  
}

export const PatientsTableContainer = connect(mapStateToProps, mapDispatchToProps)(PatientsTableComponent);
