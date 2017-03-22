import * as React from 'react';
import { PatientsViewModel } from './viewModels';
import { PatientHeaderComponent } from './headerComponent';
import { PatientRowComponent } from './rowComponent';


interface Props {
  handlePatientsListRequest : () => void;
  patients : PatientsViewModel[];
}


export const PatientsTableComponent  : React.SFC<Props>=({patients}: Props) => {  
    return (
      <table>
        <PatientHeaderComponent/>
        <tbody>
          {
            patients.map((patient) => (
              <PatientRowComponent
                key={patient.id}
                patient={patient}
              />
            ))                                    
          }
        </tbody>
      </table>
    )
}
