import { initialState } from './selectors';

import {
  SET_POP_UP_IDX,
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_POP_UP_IDX:
      return {
        ...state,
        idx: action.idx
      };
    default:
      return state;
  }
};
