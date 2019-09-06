import { initialState } from './selectors';

import {
  SET_LIBRARY_DATE,
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LIBRARY_DATE:
      return {
        ...state,
        fromDate: action.data.fromDate,
        toDate: action.data.toDate,
      };
    default:
      return state;
  }
};
