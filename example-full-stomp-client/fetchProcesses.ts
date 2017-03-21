import {actionsIDs} from '../constants';
import {getProcesses} from 'app/modules/processes/services/processesQueryService';
import {ProcessDomainModel} from '../models/ProcessDomainModel';
import {setOutdated} from './setOutdated';
import {ReduxState} from 'app/store';

export const fetchedProcesses = (processes: ProcessDomainModel[], queryObject?): FetchedProcessesAction => ({
  type: actionsIDs.FETCHED_PROCESSES,
  payload: {processes, queryObject},
});

export const fetchProcesses = (queryObject?) => (dispatch, getState: () => ReduxState) => {
  const { processes : oldProcessesState } = getState();

  getProcesses(queryObject)
    .then((processes) => {
      const setOutdatedAction = setOutdated(processes, oldProcessesState, queryObject);
      if (setOutdatedAction) { dispatch(setOutdatedAction); }
      dispatch(fetchedProcesses(processes, queryObject));
    });
};

export interface FetchedProcessesAction {
  payload: {
    processes: ProcessDomainModel[];
    queryObject?: Object;
  };
  type: string;
}
