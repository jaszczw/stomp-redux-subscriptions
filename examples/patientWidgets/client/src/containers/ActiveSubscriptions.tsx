import {connect} from "react-redux";
import _groupBy from 'lodash/groupBy';
import {getPatientsSubscriptionsState} from "../modules/patients/selectors";
import * as React from "react";

const mapStateToProps = (state,props) => ({
  subs: _groupBy(getPatientsSubscriptionsState(state), '_id')
});


export const ActiveSubscriptions = connect(mapStateToProps, null)(({subs}) =>
  <div style={{clear: 'both'}}>
    Active subscriptions: { Object.keys(subs).join(', ') }
  </div>
);
