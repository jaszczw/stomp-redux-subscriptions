import * as React from 'react';
import { PatientViewModel } from '../viewModels';

interface Props {
  patient : PatientViewModel;
}

export const HeartRateWidgetComponent: React.SFC<Props>=({patient}: Props) => (
  <div>
    <span style={{'width': '100px', display: 'inline-block'}}>{patient.name}</span>
    <span style={{width: '33%'}}>heart-rate ({patient.hearthRate})</span>
  </div>
);
