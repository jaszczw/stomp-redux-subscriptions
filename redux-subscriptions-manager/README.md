# Motivation

Let's consider a page which displays patients widgets.

```

 -----------------------------------------------
 |  [W1Patient1] | [W2Patient2] | [W3Patient1] |
 |  [W2Patient1] | [W1Patient2] | [W3Patient2] |
 -----------------------------------------------
```

With assumption that any widget can dispplay any patient and thats dynamically set in application.

Components Structure could look like this:
```typescript jsx
<Widgets>
    <Widget1 patientId={1}/>
    <Widget2 patientId={2}/>
    <Widget3 patientId={1}/>
    <Widget2 patientId={1}/>
    <Widget1 patientId={2}/>
</Widgets>
```
If we were to fetch data in each component - we would probably fetch same data N times.
If we were to fetch elsewhere we could end up fetching too much data for all kind of widgets

Our solutions are providers:

You wrap Component which expects data with Provider that 'subscribes/unsubsribes' with specific payload,
that for example specifies data filter or fields to select (think `graphql`) but just in JS ojbects.
```typescript jsx
const Widget1 => ({id}) =>
<ProvidePatient id={id}>
    <Widget1View id={id}/>
</ProvidePatient>
```
Exactly the same with all other components. Then by reducing subscriptions to single state and passing them to
sagas handling 'backend' communication, you can 'flatten' the requests. (or not will depend on your specific need)

Point is to do this you would have to write quite a boilerplate code that would look almost always the same.

This library solves exactly this - it provides you with a generic way of resolving -subscribe/unsubscribe and store action to state.

Usage looks like this:

```typescript jsx

import { createReducer } from 'redux-subscriptions-manager';

//reducer.ts
combineReducers<ReduxState>({
  ...,
  patientsSubscriptions : createReducer(PATIENTS_SUBSCRIPTIONS)
});

//actions.ts
import { subscriptionActions } from 'redux-subscriptions-manager';

export const patientsSubscriptions = subscriptionActions(PATIENTS_SUBSCRIPTIONS);


//selectors.ts
import { getSubscriptions } from 'redux-subscriptions-manager';

export const getPatientsSubscriptions = (state: ReduxState, payload) => 
  getSubscriptions(state.patientsSubscriptions, payload)
  
```

To use it you would have to have component with lifefecycle hooks attached.

Recommended approach with redux-bound SubscritionManagerComponent provided by us:
```typescript jsx
const mapStateToProps = (state, ownProps) => ({
   payload: {id: ownProps.id}
});

const mapDispatchToProps = ({
   subscribe: patientsSubscriptions.subscribe,
   unsubscribe: patientsSubscriptions.unsubscribe,
});

export const ProvidePatient = connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager);
```

 Our solution solves "couple" of issues that would occur in solution below, but you can do it completely by yourself as shown below:

```typescript jsx

//reactComponent.tsx (Recommended approach is with usage of SubscriptionManagerComponent that is also delivered, but it is not requirment.
class ProvidePatient extends React.Component {
    componentDidMount() {
      store.dispatch(patientsSubscriptions.subscribe({id: this.props.id}));
    }
    
    componentWillUnmount() {
       store.dispatch(patientsSubscriptions.unsubscribe({id: this.props.id}));
    }
...
}
```

With such use case you will have in state array of current subscriptions on view:

In our example it would be something like:
```
//console.log(store.getState())
{
    patientsSubscriptions: [{id: 1}, {id: 2}, {id: 1}, {id: 1}, {id: 2}, {id: 2}]
}
```
With use of selector:

```typescript jsx
const result = getPatientsSubscriptions(store.getState(), {id: 1});
//result === [{id: 1}, {id: 1}, {id: 1}]
```

The result isn't too astounding and could be achieved quite easily writing down whole code, but there is just no need for rewriting this each time we want to add subscriptions.


To see the full power of this library use it with conjuction with `redux-saga-subscriptions-manager` and you will see, full benefit of it.

You can also consider checking out the 'simple-example' in `examples/simple-subscriptions` folder








