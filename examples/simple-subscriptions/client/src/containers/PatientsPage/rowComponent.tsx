import * as React from 'react';
import { PatientsViewModel } from './viewModels';

interface Props {
  patient : PatientsViewModel;
}

export const PatientRowComponent : React.SFC<Props> = ({patient}: Props) => {
  return (
    <tr>
      <td>
        <span>{patient.patient}</span>
      </td>
      <td>
        <span>{patient.room}</span>
      </td>
      <td>
        <span>{patient.bodyTemperature}</span>
      </td>
      <td>
        <span style={ patient.hearthRate > 100 ? {color: 'red'}: null}>{patient.hearthRate}</span>
      </td>
      <td>
        <span>{patient.hiBloodPressure}</span>
      </td>
      <td>
        <span>{patient.loBloodPressure}</span>
      </td>      
    </tr>
  );
}

