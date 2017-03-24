import React from 'react';
import {ProvidePatients} from './providePatients';
import {PatientsTableContainer} from './patientsTableContainer';

export default class MulitplePatientsTables extends React.Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      floors: [1,2],
      floors2: [1,2]
    };
  }

  removeFloor = (floor) => () => {
    this.setState({floors: this.state.floors.filter(f => f!=floor)});
  };
  removeFloor2 = (floor) => () => {
    this.setState({floors2: this.state.floors2.filter(f => f!=floor)});
  };

  render() {
    const {floors, floors2} = this.state;
    return (
      <div>
        {floors.map((floor) => (
          <div key={floor}>
            <p>{floor}</p>
            <button onClick={this.removeFloor(floor)}>-</button>
            <ProvidePatients floor={floor}>
              <PatientsTableContainer/>
            </ProvidePatients>
          </div>
        ))}
        {floors2.map((floor) => (
          <div key={`${floor-2}`}>
            <p>{floor}</p>
            <button onClick={this.removeFloor2(floor)}>-</button>
            <ProvidePatients floor={floor}>
              <PatientsTableContainer/>
            </ProvidePatients>
          </div>
        ))}
      </div>
    )
  }
}
