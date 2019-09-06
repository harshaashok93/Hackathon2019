import { initialState } from './selectors';

import {
  SET_AUTO_SUGGEST_RESULTS,
  RESET_AUTOSUGGEST_RESULTS,
  RESET_SEARCH_TYPE,
  SET_SEARCH_TYPE,
  SET_MOST_OFTEN_SEARCH
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTO_SUGGEST_RESULTS:
      return {
        ...state,
        results: action.data,
      };
    case RESET_AUTOSUGGEST_RESULTS:
      return {
        ...state,
        results: {}
      };
    case SET_SEARCH_TYPE:
      return {
        ...state,
        searchEvent: Object.assign({}, action.data)
      };
    case RESET_SEARCH_TYPE:
      return {
        ...state,
        searchEvent: {}
      };
    case SET_MOST_OFTEN_SEARCH:
      return {
        ...state,
        oftenSearch: action.data,
      };
    default:
      return state;
  }
};
