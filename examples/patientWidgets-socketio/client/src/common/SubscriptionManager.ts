import React, { PropTypes } from 'react';
import isEqual from 'lodash/isEqual';

const subscribe = (props) => {
  props.subscribe(props.payload);
};

const unsubscribe = (props) => {
  props.unsubscribe(props.payload);
};

export default class SubscriptionManager extends React.Component<SubscriptionManagerProps, {}> {
  static propTypes = {
    children: PropTypes.node,
    payload: PropTypes.any,
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
  };

  componentWillMount() {
    subscribe(this.props);
  }

  componentWillUnmount() {
    unsubscribe(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (!isEqual(this.props.payload, newProps.payload)) {
      unsubscribe(this.props);
      subscribe(newProps);
    }
  }

  render() {
    return this.props.children || null;
  }
}

export interface SubscriptionManagerProps {
  children: React.ReactElement<any> | null;
  payload: any | undefined;
  subscribe(payload?: any): void | any;
  unsubscribe(payload?: any): void | any;
}
