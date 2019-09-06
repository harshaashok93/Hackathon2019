import {
  resultOK,
} from 'api/utils';

import {
  getDropDownResults,
  getMediaResults,
  getVideoResults,
  getStrategyReportResult
} from 'api/strategy';

export const SET_STRATEGY_DROPDWON_OPTIONS = 'SET_STRATEGY_DROPDWON_OPTIONS';
export const SET_STRATEGY_RESULTS = 'SET_STRATEGY_RESULTS';
export const SET_STRATEGY_MOBILE_LAYOUT_STATUS = 'SET_STRATEGY_MOBILE_LAYOUT_STATUS';
export const SET_STRATEGY_SUB_NAV_OPTION = 'SET_STRATEGY_SUB_NAV_OPTION';
export const SET_STRATEGY_LOADING = 'SET_STRATEGY_LOADING';
export const SET_STRATEGY_MEDIA_LOADING = 'SET_STRATEGY_MEDIA_LOADING';
export const SET_STRATEGY_VIDEO_LOADING = 'SET_STRATEGY_VIDEO_LOADING';
export const SET_STRATEGY_DATE = 'SET_STRATEGY_DATE';
export const SET_STRATEGY_MEDIA_API_RESULT = 'SET_STRATEGY_MEDIA_API_RESULT';
export const SET_STRATEGY_VIDEOCASTS_API_RESULT = 'SET_STRATEGY_VIDEOCASTS_API_RESULT';
export const SET_STRATEGY_LANDING_REPORTS = 'SET_STRATEGY_LANDING_REPORTS';
export const SET_STRATEGY_RESULT_TOTAL = 'SET_STRATEGY_RESULT_TOTAL';

export function GET_STRATEGY_DROPDOWN_RESULT_LIST(data) {
  return async (dispatch) => {
    let isDataLoaded = false;
    if (!isDataLoaded) {
      dispatch({ type: SET_STRATEGY_LOADING, data: true });
    }
    const result = await getDropDownResults(data);
    isDataLoaded = true;
    dispatch({ type: SET_STRATEGY_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_STRATEGY_RESULTS, data: Object.assign([], result.data.data.publications), count: data.from });
        if (result.data.data.sub_filters) {
          dispatch({ type: SET_STRATEGY_DROPDWON_OPTIONS, data: Object.assign([], result.data.data.sub_filters) });
        }
        if (result.data.data) {
          dispatch({ type: SET_STRATEGY_RESULT_TOTAL, data: result.data.data.total || 0 });
        }
      }
    }
  };
}

export function GET_STRATEGY_MEDIA_RESULTS(url, landingPage) {
  return async (dispatch) => {
    let isDataLoaded = false;
    setTimeout(() => {
      if (!isDataLoaded) {
        dispatch({ type: SET_STRATEGY_MEDIA_LOADING, data: true });
      }
    }, 1000);
    const result = await getMediaResults(url);
    isDataLoaded = true;
    dispatch({ type: SET_STRATEGY_MEDIA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        if (landingPage) {
          dispatch({ type: SET_STRATEGY_MEDIA_API_RESULT, data: Object.assign([], result.data.data.slice(0, 3)) });
        } else {
          dispatch({ type: SET_STRATEGY_MEDIA_API_RESULT, data: Object.assign([], result.data.data) });
        }
      }
    }
  };
}

export function GET_STRATEGY_VIDEOCASTS_RESULTS(url, videocastReqParameter, landingPage) {
  return async (dispatch) => {
    dispatch({ type: SET_STRATEGY_VIDEO_LOADING, data: true });
    const result = await getVideoResults(url, videocastReqParameter);
    dispatch({ type: SET_STRATEGY_VIDEO_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({
          type: SET_STRATEGY_VIDEOCASTS_API_RESULT,
          data: {
            data: (landingPage ? Object.assign([], result.data.data.slice(0, 3)) : Object.assign([], result.data.data)),
            total: result.data.total,
            currentPageNum: videocastReqParameter.page || 0,
          }
        });
      }
    } else {
      dispatch({
        type: SET_STRATEGY_VIDEOCASTS_API_RESULT,
        data: {
          data: [],
          total: 0,
          currentPageNum: 0,
        }
      });
    }
  };
}

export function GET_STRATEGY_REPORTS_RESULT(data) {
  return async (dispatch) => {
    const result = await getStrategyReportResult(data);
    if (resultOK(result)) {
      if (result.data && result.data.data) {
        dispatch({ type: SET_STRATEGY_LANDING_REPORTS, data: Object.assign([], result.data.data.publications) });
      }
    }
  };
}
