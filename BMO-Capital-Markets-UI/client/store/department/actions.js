import {
  resultOK,
} from 'api/utils';

import {
  getAnalystProfileLinks,
  getCoverageSectorData,
  getAnalystsData,
  getCoverageOverlay,
  getAnalystDetail
} from 'api/department';

export const SET_ANALYST_PROFILE_LINKS = 'SET_ANALYST_PROFILE_LINKS';
export const SET_SECTOR_DATA = 'SET_SECTOR_DATA';
export const SET_SECTOR_DATA_LOADING = 'SET_SECTOR_DATA_LOADING';
export const SET_COVERAGE_OVERLAY_LOADING = 'SET_COVERAGE_OVERLAY_LOADING';
export const SET_SELECTED_SECTOR_ID = 'SET_SELECTED_SECTOR_ID';
export const SET_ANALYSTS_DATA = 'SET_ANALYSTS_DATA';
export const SET_ANALYSTS_DATA_LOADING = 'SET_ANALYSTS_DATA_LOADING';
export const SET_SELECTED_ANALYSTS_SECTOR_ID = 'SET_SELECTED_ANALYSTS_SECTOR_ID';
export const SET_SUB_SECTOR_OPTIONS = 'SET_SUB_SECTOR_OPTIONS';
export const SET_COVERAGE_OVERLAY_DATA = 'SET_COVERAGE_OVERLAY_DATA';
export const SET_ANALYSTS_DETAIL_DATA = 'SET_ANALYSTS_DETAIL_DATA';
export const SET_ANALYSTS_DETAIL_LOADING = 'SET_ANALYSTS_DETAIL_LOADING';
export const SET_COMP_TICKER_FROM_DEPARTMENT = 'SET_COMP_TICKER_FROM_DEPARTMENT';
export const SET_SELECTED_SECTOR_ID_TYPE = 'SET_SELECTED_SECTOR_ID_TYPE';
export const SET_COVERAGE_OVERLAY_CHECK = 'SET_COVERAGE_OVERLAY_CHECK';

export function GET_ANALYST_PROFILE_LINKS(number) {
  return async (dispatch) => {
    const result = await getAnalystProfileLinks(number);
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ANALYST_PROFILE_LINKS, data: Object.assign([], result.data) });
      } else {
        dispatch({ type: SET_ANALYST_PROFILE_LINKS, data: [] });
      }
    } else {
      dispatch({ type: SET_ANALYST_PROFILE_LINKS, data: null });
    }
  };
}
export function GET_COVERAGE_OVERLAY(data) {
  return async (dispatch) => {
    dispatch({ type: SET_COVERAGE_OVERLAY_LOADING, data: true });
    const result = await getCoverageOverlay(data);
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_COVERAGE_OVERLAY_DATA, data: Object.assign([], result.data) });
      } else {
        dispatch({ type: SET_COVERAGE_OVERLAY_DATA, data: [] });
      }
    } else {
      dispatch({ type: SET_COVERAGE_OVERLAY_DATA, data: null });
    }
    dispatch({ type: SET_COVERAGE_OVERLAY_LOADING, data: false });
  };
}

export function SET_COVERAGE_OVERLAY(data) {
  return async (dispatch) => {
    dispatch({ type: SET_COVERAGE_OVERLAY_CHECK, data });
  };
}

export function GET_OUR_DEPARTMENT_SECTOR_DATA(callType, data) {
  return async (dispatch, getState) => {
    const { department } = getState();
    let isDataLoaded = false;
    if (!isDataLoaded) {
      dispatch({ type: SET_SECTOR_DATA_LOADING, data: true });
    }
    const result = await getCoverageSectorData(data);
    isDataLoaded = true;
    if (resultOK(result)) {
      dispatch({ type: SET_SECTOR_DATA_LOADING, data: false });
      if (result.data) {
        dispatch({ type: SET_SECTOR_DATA, data: Object.assign([], result.data), count: data.count, showCannabis: (callType === 'load' ? (result.data.show_cannabis_message || department.showCannabis) : result.data.show_cannabis_message) });
      } else {
        dispatch({ type: SET_SECTOR_DATA, data: [], count, showCannabis: false });
      }
    } else {
      dispatch({ type: SET_SECTOR_DATA_LOADING, data: false });
      dispatch({ type: SET_SECTOR_DATA, data: [], showCannabis: false });
    }
  };
}

export function GET_OUR_DEPARTMENT_ANALYSTS_DATA(data) {
  return async (dispatch) => {
    let isDataLoaded = false;
    setTimeout(() => {
      if (!isDataLoaded) {
        dispatch({ type: SET_ANALYSTS_DATA_LOADING, data: true });
      }
    }, 1000);
    const result = await getAnalystsData(data);
    isDataLoaded = true;
    if (resultOK(result)) {
      dispatch({ type: SET_ANALYSTS_DATA_LOADING, data: false });
      if (result.data) {
        dispatch({ type: SET_ANALYSTS_DATA, data: Object.assign([], result.data) });
      } else {
        dispatch({ type: SET_ANALYSTS_DATA, data: [] });
      }
    } else {
      dispatch({ type: SET_ANALYSTS_DATA_LOADING, data: false });
      dispatch({ type: SET_ANALYSTS_DATA, data: null });
    }
  };
}

export function SET_SECTOR_ID(data) {
  return async (dispatch) => {
    dispatch({ type: SET_SELECTED_SECTOR_ID, data: data.sectorId });
    dispatch({ type: SET_SELECTED_SECTOR_ID_TYPE, data: data.isLastLevel ? data.isLastLevel : false });
  };
}

export function GET_ANALYSTS_DETAIL_DATA(d) {
  return async (dispatch) => {
    dispatch({ type: SET_ANALYSTS_DETAIL_LOADING, data: true });
    const result = await getAnalystDetail(d);
    dispatch({ type: SET_ANALYSTS_DETAIL_LOADING, data: false });
    const { data } = result;
    if (!resultOK(result)) {
      dispatch({ type: SET_ANALYSTS_DETAIL_DATA, data: {} });
      return;
    }
    if (!data) return;
    dispatch({ type: SET_ANALYSTS_DETAIL_DATA, data: Object.assign({}, result.data.data) });
  };
}
