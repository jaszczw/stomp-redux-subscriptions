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
            <button onClick={this.removeFloor(floor)}>-</button>
            <p>Fetches for floor: {floor} and displays it</p>
            <ProvidePatients floor={floor}>
              <PatientsTableContainer floor={floor}/>
            </ProvidePatients>
          </div>
        ))}
        {floors2.map((floor) => (
          <div key={`${floor-2}`}>
            <button onClick={this.removeFloor2(floor)}>-</button>
            <p>Fetches for floor: {floor} displays all</p>
            <ProvidePatients floor={floor}>
                <PatientsTableContainer/>
            </ProvidePatients>
          </div>
        ))}
      </div>
    )
  }
}
