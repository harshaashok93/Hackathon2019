import { initialState } from './selectors';

import {
  SET_STRATEGY_DROPDWON_OPTIONS,
  SET_STRATEGY_RESULTS,
  SET_STRATEGY_SUB_NAV_OPTION,
  SET_STRATEGY_MOBILE_LAYOUT_STATUS,
  SET_STRATEGY_LOADING,
  SET_STRATEGY_DATE,
  SET_STRATEGY_MEDIA_API_RESULT,
  SET_STRATEGY_VIDEOCASTS_API_RESULT,
  SET_STRATEGY_MEDIA_LOADING,
  SET_STRATEGY_VIDEO_LOADING,
  SET_STRATEGY_LANDING_REPORTS,
  SET_STRATEGY_RESULT_TOTAL
} from './actions';

export default (state = initialState, action) => {
  let dataArray = [];
  if (action.count >= 0) {
    dataArray = action.count === 0 ? action.data : state.filterResults.concat(action.data);
  }
  switch (action.type) {
    case SET_STRATEGY_DROPDWON_OPTIONS:
      return {
        ...state,
        dropDownList: action.data,
      };
    case SET_STRATEGY_RESULTS:
      return {
        ...state,
        filterResults: dataArray
      };
    case SET_STRATEGY_SUB_NAV_OPTION:
      return {
        ...state,
        reportSubOption: action.data
      };
    case SET_STRATEGY_MOBILE_LAYOUT_STATUS:
      return {
        ...state,
        mobileLayout: action.data
      };
    case SET_STRATEGY_LOADING:
      return {
        ...state,
        isLoading: action.data
      };
    case SET_STRATEGY_MEDIA_LOADING:
      return {
        ...state,
        isMediaLoading: action.data
      };
    case SET_STRATEGY_VIDEO_LOADING:
      return {
        ...state,
        isVideoLoading: action.data
      };
    case SET_STRATEGY_DATE:
      return {
        ...state,
        fromDate: action.data.from,
        toDate: action.data.to,
      };
    case SET_STRATEGY_MEDIA_API_RESULT:
      return {
        ...state,
        mediaResult: action.data
      };
    case SET_STRATEGY_VIDEOCASTS_API_RESULT:
      return {
        ...state,
        videoResult: (action.data.currentPageNum === 0 ? action.data.data : state.videoResult.concat(action.data.data)),
        videocastTotal: action.data.total,
      };
    case SET_STRATEGY_RESULT_TOTAL:
      return {
        ...state,
        total: action.data
      };
    case SET_STRATEGY_LANDING_REPORTS:
      return {
        ...state,
        strategyLandingPage: action.data
      };
    default:
      return state;
  }
};
