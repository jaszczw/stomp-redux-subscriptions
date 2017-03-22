import uuidV1 from 'uuid/v1';
import { getStompClient } from './stomp';
import { addHandler, removeHandler } from './handlersManager';
const timeout = 8000;
let getConnectionErrorTimeout = (emitter) => setTimeout(() => emitter({ error: 'Connection-error' }), timeout);
const createHandler = (emitter) => {
    let timer = getConnectionErrorTimeout(emitter);
    return (stomp) => (message) => {
        const data = JSON.parse(message.body);
        if (!data.heartBeat) {
            emitter(data);
            return;
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = getConnectionErrorTimeout(emitter);
        const target = message.headers['reply-to'];
        stomp.send(target, '');
    };
};
const createSubscription = (data, emitter) => {
    const subId = uuidV1();
    const replyTo = `/temp-queue/${subId}`;
    const dataPayload = JSON.stringify({ payload: data, subId });
    const headers = {
        'content-type': 'application/json',
        'reply-to': replyTo,
    };
    //Handler is created first - as we may need to notify about connection-error
    const handler = createHandler(emitter);
    getStompClient().then((stomp) => {
        stomp.send('/topic/create_subscription', dataPayload, headers);
        addHandler(replyTo, handler(stomp));
    }).catch((err) => {
        console.error('Failed to subscribe via stomp', err);
    });
    return {
        unsubscribe: () => {
            removeHandler(replyTo);
        }
    };
};
export const subscriptionsService = {
    createSubscription
};
//# sourceMappingURL=index.js.map