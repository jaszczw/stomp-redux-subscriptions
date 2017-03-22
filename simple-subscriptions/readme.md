# 07 Reactive Polling

In this sample we will replace our Patients Subscription with one that support reactive polling.  
  - We will create sagas to handle reactive polling
  - We will introduce changes into Patients Subscriptions.
  - No more changes needed to implement this.

Summary steps:

- Install sagas npm packages
- Create rective polling sagas.
- Update PatientsSubscription.


# Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (v6.10.0) if they are not already installed on your computer.

> Verify that you are running at least node v6.x.x and npm 3.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Project structure

We will end up with the following project structure:

First level

.
├───client
└───server

Second level (client app)

```javascript
.
│   app.tsx     // entry point
│   index.html
└───src
    ├───common
           subscriptionManager.ts
    ├───containers
    │   └───PatientsPage
    │         headercomponent.tsx
    │         index.ts    
    │         patientsTableComponents.ts
    │         patientsTableContainer.ts    
    │         rowComponents.ts
    │         selectors.ts
    │         providePatients.ts
    │         viewModels.d.ts    
    ├───modules
    │   └───patients
    │       └───services    
    │       │     allIds.ts
    │       │     byIds.ts
    │       │     index.ts        
    │       └───sagas
    │             index.ts
    │             subscribePatients.ts    
    │       └───services
    │             index.ts
    │             mockData.ts
    │             patientsDomainModel.ts
    │             patientsService.ts
    │        actions.ts
    │        constants.ts
    │        mappers.ts
    │        models.ts    
    │        selectors.ts
    ├───store
    │     create.ts
    │     index.ts
    │     reducer.ts
    │     selector.ts
```


## Steps to build it

- Let's start by installing redux-saga npm packages.

```cmd
npm install redux-saga --save
```

```cmd
npm install @types/redux-saga --save-dev
```

- We are going to remove the thunk thatn handled the fetch patients and move it to a saga.

Let's remove the thunk from the actions file, and add the action.

_./src/modules/patients/actions.ts_

```diff
import { actionsIDs } from './constants';
import { PatientsDomainModel } from './services/patientsDomainModel'
import { PatientsStateModel, FetchedPatientsAction } from './models'
import { mapPatientToStateModel } from './mappers'
import { getPatients } from './services/patientsService';


export const fetchedPatients = (patients: PatientsStateModel[], queryObject?): FetchedPatientsAction => ({
  type: actionsIDs.FETCHED_PATIENTS,
 payload: {patients},
});

+ export const subscribePatients = () => ({
+   type: actionsIDs.PROCESSES_SUBSCRIPTION,
+  method: SUBSCRIPTIONS_SUBSCRIBE});

+ export const unsubscribePatients = () => ({
+   type: actionsIDs.PROCESSES_SUBSCRIPTION,
+   payload: filter ? {filter} : null,
+   method: SUBSCRIPTIONS_UNSUBSCRIBE});


- export const fetchPatients = () => (dispatch) => {  
-  getPatients()
-    .then((patients : PatientsDomainModel[]) => {
-      const patientsState : PatientsStateModel[] = patients.map(mapPatientToStateModel);
-      dispatch(fetchedPatients(patientsState));
-    })
-};
```

Let's define a saga to request the fetch patients.

_./src/modules/sagas/fetchPatients.ts_

```javascript
import { call, put } from 'redux-saga/effects';
import { getPatients } from '../services/patientsService'
import { fetchedPatients } from '../actions'


export const fetchPatients = function *() {
  const patients = yield call(getPatients);
  yield put(fetchedPatients(patients));
};
```

- Let's add two new consts to define de Subscribe and Unsubscribe commands

_./src/modules/sagas/cosntants.ts_

```diff
export const prefix = 'demoapp/patients';

export const actionsIDs = {
  FETCHED_PATIENTS: `${prefix}/fetched-patients`,
+ PATIENTS_SUBSCRIPTION: `${prefix}/patients-subscriptions`,
};

+ export const START_SUBSCRIBE = 'START_SUBSCRIBE';
+ export const STOP_SUBSCRIBE = 'STOP_SUBSCRIBE';

```

- It's time to define the saga that will handle the reactive polling.

_./src/modules/sagas/subscribePatients.ts_

```javascript
import { takeLatest, take, call, race, fork, put, cancel} from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';

import { fetchPatients } from './fetchPatients';
import {STOP_SUBSCRIBE, START_SUBSCRIBE} from '../constants';

export const POOLING_TIMEOUT_MS = 5000; //in ms

const createChannel = (payload?) => eventChannel((emit) => {
	const interval = setInterval(() =>
		Promise.resolve(fetchPatients()).then(emit),
		POOLING_TIMEOUT_MS
	);

	return () => {clearInterval(interval)}; //Cleanup
});

export const startSubscription = function *() {
	yield call(fetchPatients);
	const channel = createChannel();

	while (true) {
		const {action, cancel} = yield race({
			action: take(channel),
			cancel: take(STOP_SUBSCRIBE),
		});

		if (action) {
			yield action;
		}

		if (cancel) {
			channel.close();
			return;
		}
	}
};

export const watchPatientsSubscription = function *() {
  yield takeLatest(START_SUBSCRIBE, startSubscription);
};
```

- Now it's time to expose all the sagas

_./src/modules/patients/sagas/index.ts_

```javascript
import { watchPatientsSubscription } from './subscribePatients';

export const patientsWatcher = function* () {
  yield [
    watchPatientsSubscription(),    
  ];
};

export default patientsWatcher;
```

- For the sake of future extensiblity let's create a root saga container under our _store_ folder.

_./src/store/sagas.ts_

```javascript
import patientsSagas from '../modules/patients/sagas'

function* rootSaga() : IterableIterator<any> {
  yield [
    patientsSagas()
  ];
}

export default rootSaga;
```

- It's time to setup the saga middleware in our project and launch the patients saga we have defined.

_./src/store/create.ts_

```diff
import thunkMiddleware from 'redux-thunk';
+ import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose} from 'redux';
import { rootReducers } from './reducer'
+ import rootSaga from './sagas';
import { ReduxState } from './reduxState'

// Add redux devtool support
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

+ const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  thunkMiddleware,
+  sagaMiddleware,
];

export const store = createStore<ReduxState>(
  rootReducers,
  composeEnhancers(
    applyMiddleware(...middlewares),
  ),
);

+ sagaMiddleware.run(rootSaga);
```

- Let's update our _ProvidePatients.ts_ to subscribe / unsubscribe from our patients saga.

```diff
import {connect} from 'react-redux';
import SubscriptionManager from '../../common/SubscriptionManager';
- import { fetchPatients } from '../../modules/patients/actions';
+ import { subscribePatients, unsubscribePatients  } from '../../modules/patients/actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
-   subscribe: () => dispatch(fetchPatients()),
+   subscribe: () => dispatch(subscribePatients()),
+   unsubscribe: () => dispatch(unsubscribePatients()),
});

export const ProvidePatients = connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager);

export default ProvidePatients;

// Additionally we could define custom props for the provider
export interface ProvidePatientsProps {

}
```

- We can run the sample and check that the table is being displayed, the UI will get updated every 5 seconds.

```cmd
npm start
```

