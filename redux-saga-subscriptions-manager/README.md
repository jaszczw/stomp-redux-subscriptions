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
