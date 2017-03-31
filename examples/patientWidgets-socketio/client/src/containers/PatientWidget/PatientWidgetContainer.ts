import { connect } from 'react-redux'
import {createStructuredSelector} from 'reselect';

import {ReduxState} from '../../store';
import {getPatientViewModel} from './selectors';
import {PatientWidget} from './PatientWidget';

const mapDispatchToProps = {
};

const mapStateToProps = createStructuredSelector<ReduxState, {id, Widget}, {patient}>({
    patient : getPatientViewModel
});

export const PatientWidgetContainer = connect(mapStateToProps, mapDispatchToProps)(PatientWidget);
