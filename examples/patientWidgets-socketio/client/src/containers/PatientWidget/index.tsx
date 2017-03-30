import React from 'react';
import {PatientWidgetContainer} from './PatientWidgetContainer';
import {ProvidePatient} from '../ProvidePatient';

export default ({id, Widget}: {id: string, Widget}) => (
    <ProvidePatient id={id} >
      <PatientWidgetContainer id={id} Widget={Widget}/>
    </ProvidePatient>
);

export { PatientWidgetContainer };
