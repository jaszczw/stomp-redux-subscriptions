import {connect} from 'react-redux';
import SubscriptionManager from '../common/SubscriptionManager';
import { patientsSubscriptions  } from '../modules/patients/actions';

const mapStateToProps = (state, ownProps: ProvidePatientProps) => ({
   payload: {
      _id: ownProps.id
   }
});

const mapDispatchToProps = ({
   subscribe: patientsSubscriptions.subscribe,
   unsubscribe: patientsSubscriptions.unsubscribe,
});

export const ProvidePatient = connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager);

export default ProvidePatient;

// Additionally we could define custom props for the provider
export interface ProvidePatientProps {
   id: string;
}
