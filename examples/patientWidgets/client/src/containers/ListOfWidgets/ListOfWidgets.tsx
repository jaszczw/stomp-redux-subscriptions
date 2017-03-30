import React from 'react';
import PatientWidget from '../PatientWidget';
import { HeartRateWidgetComponent } from '../PatientWidget/components/HeartRateWidgetComponent';
import { TemperatureWidgetComponent } from '../PatientWidget/components/TemperatureWidgetComponent';

export class ListOfWidgets extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      widgets: [
        {id: '1', Widget: TemperatureWidgetComponent, type: 't'},
        {id: '1', Widget: HeartRateWidgetComponent, type: 'h'},
        {id: '3', Widget: TemperatureWidgetComponent, type: 't'},
        {id: '4', Widget: TemperatureWidgetComponent, type: 't'},
        {id: '5', Widget: TemperatureWidgetComponent, type: 't'},
        {id: '2', Widget: TemperatureWidgetComponent, type: 't'},
        {id: '2', Widget: HeartRateWidgetComponent, type: 'h'},
        {id: '3', Widget: HeartRateWidgetComponent, type: 'h'},
        {id: '4', Widget: HeartRateWidgetComponent, type: 'h'},
        {id: '5', Widget: HeartRateWidgetComponent, type: 'h'},
      ],
    };
  }

  removeWidget = (index) => () => {
    const widgets = this.state.widgets.slice();
    widgets.splice(index, 1);
    this.setState({widgets});
  }

  // Unique key in map is very importarnt - as sub/unsub could trigger service action on backend multiple times if it werent'
  render(){
    return (
      <div>
        {this.state.widgets.map((widget, i) => (
          <div key={widget.type+widget.id} style={{'float': 'left', padding: '10px', 'textAlign': 'center'}}>
            <PatientWidget {...widget}/>
            <button onClick={this.removeWidget(i)}>-</button>
            <br/><br/>
          </div>
        ))}
      </div>
    );
  }
};
