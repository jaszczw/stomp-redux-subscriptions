import { takeLatest, take, call, race, fork, put, cancel} from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';

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
			cancel: take(actionsIDs.STOP_SUBSCRIBE),
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
  yield takeLatest(actionsIDs.START_SUBSCRIBE, startSubscription);
};
