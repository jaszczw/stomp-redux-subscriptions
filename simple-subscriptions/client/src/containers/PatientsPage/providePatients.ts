import {connect} from 'react-redux';
import SubscriptionManager from '../../common/SubscriptionManager';
import { subscribePatients, unsubscribePatients  } from '../../modules/patients/actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
   subscribe: () => dispatch(subscribePatients()),
   unsubscribe: () => dispatch(unsubscribePatients()),
});

export const ProvidePatients = connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager);

export default ProvidePatients;

// Additionally we could define custom props for the provider
export interface ProvidePatientsProps {

}