import {connect} from 'react-redux';
import SubscriptionManager from '../../common/SubscriptionManager';
import { subscribePatients, unsubscribePatients  } from '../../modules/patients/actions';

const mapStateToProps = (state, ownProps: any) => ({
   payload: {floor: ownProps.floor}
});

const mapDispatchToProps = (dispatch) => ({
   subscribe: (payload) => dispatch(subscribePatients(payload)),
   unsubscribe: (payload) => dispatch(unsubscribePatients(payload)),
});

export const ProvidePatients = connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager);

export default ProvidePatients;

// Additionally we could define custom props for the provider
export interface ProvidePatientsProps {

}