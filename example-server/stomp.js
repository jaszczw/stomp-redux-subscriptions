// import SockJS from 'sockjs-client';
const WebSocket = require('ws');
const stomp = require('webstomp-client');
const uuid = require('uuid/v1');

const client = new WebSocket('ws://127.0.0.1:15674/ws');
let wsclient = stomp.over(client, {
    binary: false,
    debug: true,
    heartbeat: {incoming: 5000, outgoing: 5000},
});

//TODO WJ: reconnect on failure - handle (or not)
const stompClient = new Promise((resolve, reject) => wsclient.connect({
    login: 'guest',
    passcode: 'guest',
}, () => {
    resolve(wsclient);
}));

const handlers = {};

const getTempQueueId = (body) => `/temp-queue/${body.payload.type}.listener.${uuid()}`;

const createChangeNotification = (client, target) =>
    (data) => {
        //TODO WJ: Can be extended with specific 'data' (type etc., crud action...)
        client.send(target, '{}', {
            'content-type': 'application/json'
        });
    };

const createChangesSubscription = function (client, target, body) {
    const entity = body.payload.entity;
    const notifyChange = createChangeNotification(client, target);
    const subscription = client.subscribe(`/topic/${entity}`, notifyChange);

    notifyChange();
    return subscription;
};

const createHeartBeat = (client, target, body, subscription) => {
    const tempQueueId = getTempQueueId(body);
    let nextTimeout;

    const heartBeat = () => {
        if(!client.connected){
            return;
        }

        client.send(`${target}`, '{"heartBeat": true}', {
            'content-type': 'application/json',
            'reply-to': tempQueueId
        });

        nextTimeout = setTimeout(() => subscription.unsubscribe(), 8000);
    };

    heartBeat();

    handlers[tempQueueId] = () => {
        clearTimeout(nextTimeout);
        setTimeout(heartBeat, 5000);
    };
};

const createPublisher = (data, client) => {
    const target = data.headers['reply-to'];
    const body = JSON.parse(data.body);

    const subscription = createChangesSubscription(client, target, body);
    createHeartBeat(client, target, body, subscription);
};

stompClient.then(client => {
    client.subscribe('/topic/create_subscription', (data) => {
        createPublisher(data, client);
    });

    client.onreceive = (message) => {
        const handler = handlers[message.headers.subscription];
        if (handler) {
            handler(message);
        }
    };
});

module.exports = stompClient;
