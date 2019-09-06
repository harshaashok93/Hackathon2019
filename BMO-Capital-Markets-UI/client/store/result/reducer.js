import { initialState } from './selectors';

import {
  SET_API_RESULT,
  SET_TOP_15_API_RESULT,
  SET_SCREENER_RESULT,
  SET_STOCKSCREENER_API_LOADING,
  SET_CHANGESUMMARY_API_LOADING,
  IS_RESULT_LOADING,
  SET_POPULAR_RESULT,
  SET_TOTAL_MOST_RECENT_RESULT,
  SET_LAST_FETCHED_NOTIFICATION_ID
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_API_RESULT:
      return {
        ...state,
        results: action.data,
      };
    case SET_POPULAR_RESULT:
      return {
        ...state,
        popularResults: action.data,
      };
    case SET_TOP_15_API_RESULT:
      return {
        ...state,
        stockResults: action.data
      };
    case SET_SCREENER_RESULT:
      return {
        ...state,
        stockScreenerData: (action.count && action.count === 1) ? action.data.Data : (action.data.Data ? state.stockScreenerData.concat(action.data.Data) : []), //eslint-disable-line
        stockScreenerTotal: action.data ? action.data.Total : 0,
      };
    case SET_STOCKSCREENER_API_LOADING:
      return {
        ...state,
        stockScreenerLoading: action.data
      };
    case SET_CHANGESUMMARY_API_LOADING:
      return {
        ...state,
        changeSummaryLoading: action.data
      };
    case IS_RESULT_LOADING:
      return {
        ...state,
        isResultLoading: action.data
      };
    case SET_TOTAL_MOST_RECENT_RESULT:
      return {
        ...state,
        mostRecentTotal: action.data
      };
    case SET_LAST_FETCHED_NOTIFICATION_ID:
      return {
        ...state,
        last_fetched_notification_id: action.data
      };
    default:
      return state;
  }
};
