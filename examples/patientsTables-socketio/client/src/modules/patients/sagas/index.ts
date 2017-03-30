import { watchPatientsSubscription } from './subscribePatients';

export const patientsWatcher = function* () {
  yield [
    watchPatientsSubscription(),    
  ];
};

export default patientsWatcher;
