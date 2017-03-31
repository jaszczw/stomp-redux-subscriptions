# API

High-level description of API.

```typescript
  exports {
      createSubscriptionWatcher: (options : SubscriptionOptions, createChannel) => handler;
      createStartHandler: (stopSubActions: string[]) => (createChannel: any) => handler
      createSubscriptionHandler: (selector: (state: any, payload: any) => handler
      createErrorHandler: (startType: any, stopType: any, reconnectTimeout?: number) => handler
  }
      
interface SubscriptionOptions {
  subIdentifier: string;
  selector: ((state, payload) => any[]) | ((state) => any[]);
  startType?: string;
  stopType?: string;
  errorType?: string;
}

interface handler extends GeneratorFunction;
```

## Use cases:

Library works best together with `redux-subscriptions-manager` - reduced state, but can be used without it.

Problem it solves: maintaining multiple subscriptions with different payloads, handling cleanup and creation for actions.

Below you there is very simple approach of handling each Action .START_SUBSCRIBE starting polling and stopping it on STOP_SUBSCRIBE.

It doesn't allow for multiple subscriptions based on payload, duplicate subscriptions will run twice. Creating and destroying is written down by hand.

```typescript

const createChannel = (payload?) => eventChannel((emit) => {
    const interval = setInterval(() =>
        Promise.resolve(fetch()).then(emit),
        1000
    );

    return () => {clearInterval(interval)}; //Cleanup
});

export const startSubscription = function *() {
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

With the same constraints but with library abstracting start/stop, code would look as below:

```typescript

const createChannel = (payload?) => eventChannel((emit) => {
    const interval = setInterval(() =>
        Promise.resolve(fetch()).then(emit),
        1000
    );

    return () => {clearInterval(interval)}; //Cleanup
});

export const watchPatientsSubscription = function *() {
    const startHandler = createStartHandler([STOP_SUBSCRIBE]);
    yield takeLatest(START_SUBSCRIBE, startHandler(createChannel));
};
```

This simplifies things quite a bit.

With this approach you can either change implementation from pooling to socket just by modifing the `createChannel` method.
You can also add state maintained subscriptions, which allow you for example to wrap each component that needs the `entity` and be
sure that it will start pooling/fetching/listening to this only once, per unique payload.

If you decided to use this library together with `redux-subscriptions-manager` and state managed by it.

After applying `redux-subscriptions-manager` to your subscriptions you may change the usage to match more complete one that is
 
instead of:
 ```typescript jsx
export const watchPatientsSubscription = function *() {
    const startHandler = createStartHandler([STOP_SUBSCRIBE]);
    yield takeLatest(START_SUBSCRIBE, startHandler(createChannel));
};
```
 
use:

 ```typescript jsx
export const watchPatientsSubscription = createSubscriptionWatcher({
    subIdentifier: PATIENTS_SUBSCRIPTIONS,
    selector: getPatientsSubscriptions
  }, createChannel);
```

Code about would work with assumption that:

There are actions of `type: PATIENTS_SUBSCRIPTIONS` dispatched with methods argument of
`SUBSCRIBE/UNSBUSCRIBE` from `redux-subscriptions-manager` and optional `payload`.
(Exactly what library creates when used as in readme);

From selector it expects that it will take `(globalState, payload) => any[]`.

The Start action will be dispatched when there was action with method `SUBSCRIBE` and we've got first entry in the resulting array.
The Stop action will be dispatched when there was action with method `UNSBUSCRIBE` and we've got nothing left in the resulting array.

See examples/simple-subscriptions for consulting. But you can imagine that for example:

Given state after reducing equal
```typescript 
{
    patientsSubState: [{id:1}, {id: 2}];
}
```
and action:
```typescript
{
  type: PATIENTS_SUBSCRIPTIONS,
  method: SUBSCRIBE,
  payload: {id: 2}
}
```

Depending on selector passed -> 
```typescript
const anySub = (state, payload )= > state;
const idSub = (state, payload )= > _filter(state, payload);

```

`anySub(state)// [{id: 1},{id: 2}]` meaning there was subscriptions, so we do not create new one (don't call createChannel) 
`idSub(state) // [{id: 2]` meaning we created first subscription of it kind so we call createChannel.

So you can see that you can modify subscriptions handling quite easily depending on your need.



//TODO WJ: Bollock
You can imagine extensivness of this approach with:

patientsSubState: [{fields: ['name','category']}, {{fields: ['name', 'age']];

getMergedFields = (state, payload) => 
mergeFields(state) // ['name', 'name','category','age']
.getDiff(payload) //['age']

Returing it would mean we call createChannel - which could then for example attach field to the listeners.





