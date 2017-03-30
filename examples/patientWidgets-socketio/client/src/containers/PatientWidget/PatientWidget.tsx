import React from 'react';
import { PatientViewModel } from './viewModels';

interface WidgetType extends React.SFC<{patient: PatientViewModel}> {}

interface Props {
  patient: PatientViewModel;
  Widget: WidgetType;
}

const MissingPatient = () => (<div>Missing patient data</div>);

export const PatientWidget: React.SFC<Props>=({patient, Widget}: Props) => (
  <div>
    { !patient && <MissingPatient /> }
    { patient && <Widget patient={patient} />  }
  </div>
);

