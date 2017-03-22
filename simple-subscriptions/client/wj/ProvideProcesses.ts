import {connect} from 'react-redux';
import SubscriptionManager from './SubscriptionManager';
import {unsubscribeProcesses, subscribeProcesses} from './actions';

const mapStateToProps = (state, ownProps: ProvideProcessesProps) => ({
  payload: ownProps.filter,
});

const mapDispatchToProps = (dispatch) => ({
  subscribe: (filter) => dispatch(subscribeProcesses(filter)),
  unsubscribe: (filter) => dispatch(unsubscribeProcesses(filter)),
});

export const ProvideProcesses = connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager);

export default ProvideProcesses;

export interface ProvideProcessesProps {
  filter?: Object;
}
