import { takeLatest, take, call, race, fork, put, cancel} from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createStartHandler } from 'redux-saga-subscriptions';

export const POOLING_TIMEOUT_MS = 5000; //in ms

const createChannel = (payload?) => eventChannel((emit) => {
	Promise.resolve(fetchPatients()).then(emit);

	const interval = setInterval(() =>
		Promise.resolve(fetchPatients()).then(emit),
		POOLING_TIMEOUT_MS
	);

	return () => {clearInterval(interval)}; //Cleanup
});

export const watchPatientsSubscription = function *() {
	const startHandler = createStartHandler([actionsIDs.STOP_SUBSCRIBE]);
	yield takeLatest(actionsIDs.START_SUBSCRIBE, startHandler(createChannel));
};
