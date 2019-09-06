import { initialState } from './selectors';
import {
  SET_ANALYST_PROFILE_LINKS,
  SET_SECTOR_DATA,
  SET_SECTOR_DATA_LOADING,
  SET_SELECTED_SECTOR_ID,
  SET_ANALYSTS_DATA,
  SET_ANALYSTS_DATA_LOADING,
  SET_SUB_SECTOR_OPTIONS,
  SET_COVERAGE_OVERLAY_DATA,
  SET_ANALYSTS_DETAIL_DATA,
  SET_ANALYSTS_DETAIL_LOADING,
  SET_COVERAGE_OVERLAY_LOADING,
  SET_COMP_TICKER_FROM_DEPARTMENT,
  SET_SELECTED_SECTOR_ID_TYPE,
  SET_COVERAGE_OVERLAY_CHECK,
} from './actions';

export default (state = initialState, action) => {
  let coverageDataArray = [];
  if (action.count) {
    coverageDataArray = action.count === 1 ? action.data.data : state.getSectorData.concat(action.data.data);
  }
  switch (action.type) {
    case SET_ANALYST_PROFILE_LINKS:
      return {
        ...state,
        analystProfileLinks: (action && action.data ? action.data.data : null)
      };
    case SET_COMP_TICKER_FROM_DEPARTMENT:
      return {
        ...state,
        deptSetTicker: action.data
      };
    case SET_SUB_SECTOR_OPTIONS:
      return {
        ...state,
        subSectors: action.data
      };
    case SET_SECTOR_DATA:
      return {
        ...state,
        getSectorData: coverageDataArray,
        coverageDataArrayTotal: action.data.count,
        showCannabis: action.showCannabis
      };
    case SET_COVERAGE_OVERLAY_DATA:
      return {
        ...state,
        coverageData: (action && action.data ? action.data.data : null)
      };
    case SET_SECTOR_DATA_LOADING:
      return {
        ...state,
        isSectorDataLoading: action.data
      };
    case SET_COVERAGE_OVERLAY_LOADING:
      return {
        ...state,
        isOverLayLoading: action.data
      };
    case SET_SELECTED_SECTOR_ID:
      return {
        ...state,
        selectedSectorId: action.data
      };
    case SET_ANALYSTS_DATA:
      return {
        ...state,
        getAnalystsData: action.data
      };
    case SET_ANALYSTS_DATA_LOADING:
      return {
        ...state,
        isAnalystsDataLoading: action.data
      };
    case SET_ANALYSTS_DETAIL_DATA:
      return {
        ...state,
        analystsDetailData: action.data
      };
    case SET_ANALYSTS_DETAIL_LOADING:
      return {
        ...state,
        analystsLoading: action.data
      };
    case SET_SELECTED_SECTOR_ID_TYPE:
      return {
        ...state,
        selectedSectorIsSubsector: action.data
      };
    case SET_COVERAGE_OVERLAY_CHECK:
      return {
        ...state,
        coverageOverlayCheck: action.data
      };
    default:
      return state;
  }
};
