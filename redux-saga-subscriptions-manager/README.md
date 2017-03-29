# Example usages

There are three libraries in this repository.

- stomp-subscriptions
- redux-subscriptions
- redux-saga-subscriptions

They can be used separately to achieve 'reactive' application that is aware of changes on backend, without per case pooling/fetches.

It resolves problem that is as follow:

You have table of "Patients" let's say on the '8th' floor. 
So you want to see their heart-rates in real-time went you open given patient, you also want his data to be up to date.
Maybe there is more things to track then just heart-rate.

So normally you would do something like:

```javascript
class PatientsList extends React.Component {
    componentDidMount() {
      socket.on('patients', () => {
          //update.state/fetchData etc.
      });
    }
    
    componentWillUnmount() {
        socket.off('patients')
    }
    
    //...
}
```

But then if you had more components dependent on same data you would have to extract it to higher level component
 or just a top level component.
 
 ```javascript
class PatientsDataProvider extends React.Component {
    componentDidMount() {
     socket.on('patients', () => {
         //update.state
     });
    }
    
    componentWillUnmount() {
       socket.off('patients')
    }

    //...
}
```

So now as we have this logic of 'listening' to patients message - we need to also subscribe for example for specific floor info:

So we would extend this class with props passing etc. Imagine there will be another entity that we need to do the same for it:

We would have to duplicate exactly the same code, so instead I introduced: 
 SubscritionManager component - very simple component that abstracts this logic.
 
 ```jsx harmony

export default class SubscriptionManager extends React.Component {
  componentWillMount() {
    this.props.subscribe(this.props.payload);
  }

  componentWillUnmount() {
    this.props.unsubscribe(this.props.payload);
  }

  componentWillReceiveProps(newProps) {
    if (!isEqual(this.props.payload, newProps.payload)) {
      unsubscribe(this.props);
      subscribe(newProps);
    }
  }

  render() {
    return this.props.children;
  }
}
```
 
It's role is just to run subscribe action and unsubscribe when it's props changes it is mounted/unmounted.

So you get generic handling of 'subscribe/unsubscribe' and usage looks like this:

```javascript
import {SubsriptionManager} from '../components'
import {connect} from 'redux';

const mapDispatchToProps = ({
    subscribe: () => {
        socket.on('patients', () => {})
    }, 
    unsubscribe: () => {
        socket.off('patients');
    }
});

export const ProvidePatients = connect(null, mapDispatchToProps)(SubscriptionManager);
```

It looks better, and is generic, however the main benefit that we get is props passing:

```jsx harmony
import {SubsriptionManager} from '../components'

const mapDispatchToProps = ({
    subscribe: (filter) => {
        socket.on(`patients-${filter.floor}-floor`, () => {
        });
    }, 
    unsubscribe: (filter) => {
        socket.off(`patients-${filter.floor}-floor`);
    }
});

const mapStateToProps = (state, ownProps) => ({
    payload: ownProps
})

export const ProvidePatients = connect(null, mapDispatchToProps)(SubscriptionManager);


<ProvidePatients floor={8} />
```

You can probably already see where this is going : 
The manager will take care of subscribe/unsubscribe whenever the payload changes
So you just need to define, what you want track and how do you handle it.

Those are just examples, in samples I have extracted the actions for subscribe, unsubscribe to sagas.
So provider just dispatches action with payloads. So you can save them in state, handle it however you see fit in saga.

I hope SubscriptionManager - defends itself well.


The rest of the libraries are there to help you manage subscription/unsubscription running, restart handling etc.


