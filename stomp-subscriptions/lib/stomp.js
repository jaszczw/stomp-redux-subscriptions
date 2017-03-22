import { client } from 'webstomp-client';
import { getHandler } from './handlersManager';
let retryCount = 0;
let pendingConnection = false;
const retryIncrement = 5000; // 5seconds
const getRetryTimer = () => Math.min(retryIncrement * 6, retryIncrement * (retryCount + 1));
const connect = () => new Promise((resolve, reject) => {
    if (pendingConnection) {
        console.log('I shouldnt land here');
        reject();
    }
    pendingConnection = true;
    const wsclient = client('ws://127.0.0.1:15674/ws', {
        binary: false,
        debug: true,
        heartbeat: { incoming: 5000, outgoing: 5000 },
    });
    const retryTimer = getRetryTimer();
    const errorCallback = () => {
        reject();
        console.log(`We will retry connection in ${retryTimer} seconds`);
        setTimeout(() => {
            pendingConnection = false;
            localStompPromise = connect();
        }, retryTimer);
    };
    const connectCallback = () => {
        retryCount = 0;
        pendingConnection = false;
        const extStompClient = wsclient;
        extStompClient.onreceive = unhandledHandler;
        resolve(wsclient);
    };
    return wsclient.connect({
        login: 'guest',
        passcode: 'guest',
    }, connectCallback, errorCallback);
});
let localStompPromise = connect();
const unhandledHandler = (message) => {
    const subscription = message.headers.subscription;
    const handler = getHandler(subscription);
    if (handler) {
        handler(message);
    }
};
export const getStompClient = () => localStompPromise;
//# sourceMappingURL=stomp.js.map