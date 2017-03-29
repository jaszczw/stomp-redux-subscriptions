import * as React from 'react';

export const PatientHeaderComponent : React.SFC<{}>  = () => {
  return (
    <thead>
      <tr>
        <th>
          Name
        </th>
        <th>
          Room
        </th>
        <th>
          Body Temperature
        </th>
        <th>
          Hearth Rate
        </th>
        <th>
          Hi Blood Pressure
        </th>
        <th>
          Low Blood Pressure
        </th>        
      </tr>
    </thead>
  );
}

