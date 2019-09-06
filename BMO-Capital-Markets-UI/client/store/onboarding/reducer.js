import { initialState } from './selectors';

import {
  SET_ONBOARDING_ALL_SECTORS,
  SET_ONBOARDING_SUB_SECTORS,
  SET_ONBOARDING_SCREEN_INDEX,
  SET_ONBOARDING_ANALYSTS_INFORMATION,
  SET_ONBOARD_SUBMIT_RESPONSE,
  RESET_ONBOARDING_DATA,
  SET_PAGE_SEQUENCE,
  SET_ANALYST_DATA_LOADING
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ONBOARDING_ALL_SECTORS:
      return {
        ...state,
        sectors: Object.assign([], action.data)
      };
    case SET_ONBOARDING_SUB_SECTORS:
      return {
        ...state,
        subSectors: Object.assign([], action.data)
      };
    case SET_PAGE_SEQUENCE:
      return {
        ...state,
        pageSequence: action.data
      };
    case SET_ONBOARDING_ANALYSTS_INFORMATION:
      return {
        ...state,
        analysts: Object.assign([], action.data)
      };
    case SET_ONBOARDING_SCREEN_INDEX:
      return {
        ...state,
        screenIndex: action.data
      };
    case SET_ANALYST_DATA_LOADING:
      return {
        ...state,
        isLoading: action.data
      };
    case SET_ONBOARD_SUBMIT_RESPONSE:
      return {
        ...state,
        success: action.data
      };
    case RESET_ONBOARDING_DATA:
      return {
        ...state,
        sectors: [],
        subSectors: [],
        analysts: []
      };
    default:
      return state;
  }
};
