import * as React from 'react';
import { connect } from 'react-redux'
import {createStructuredSelector} from 'reselect';

import {PatientsTableComponent} from './patientsTableComponent';
import {ReduxState} from '../../store';
import { getPatientsOnFloorViewModels } from './selectors';

const mapDispatchToProps = {
};

const mapStateToProps = createStructuredSelector<ReduxState, {floor?}, {patients}>({
    patients : getPatientsOnFloorViewModels
});

export const PatientsTableContainer = connect(mapStateToProps, mapDispatchToProps)(PatientsTableComponent);
