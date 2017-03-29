import {connect} from 'react-redux';
import SubscriptionManager from '../../common/SubscriptionManager';
import { patientsSubscriptions  } from '../../modules/patients/actions';

const mapStateToProps = (state, ownProps: ProvidePatientsProps) => ({
   payload: {floor: ownProps.floor}
});

const mapDispatchToProps = ({
   subscribe: patientsSubscriptions.subscribe,
   unsubscribe: patientsSubscriptions.unsubscribe,
});

export const ProvidePatients = connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager);

export default ProvidePatients;

// Additionally we could define custom props for the provider
export interface ProvidePatientsProps {
   floor: number;
}
