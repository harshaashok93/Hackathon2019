import {
  resultOK,
} from 'api/utils';

import {
  getResults,
  getScreenerResults,
  getResultsMethodPost
} from 'api/results';

export const SET_API_RESULT = 'SET_API_RESULT';
export const SET_TOP_15_API_RESULT = 'SET_TOP_15_API_RESULT';
export const SET_SCREENER_RESULT = 'SET_SCREENER_RESULT';
export const SET_STOCKSCREENER_API_LOADING = 'SET_STOCKSCREENER_API_LOADING';
export const SET_CHANGESUMMARY_API_LOADING = 'SET_CHANGESUMMARY_API_LOADING';
export const IS_RESULT_LOADING = 'IS_RESULT_LOADING';
export const SET_POPULAR_RESULT = 'SET_POPULAR_RESULT';
export const SET_TOTAL_MOST_RECENT_RESULT = 'SET_TOTAL_MOST_RECENT_RESULT';
export const SET_LAST_FETCHED_NOTIFICATION_ID = 'SET_LAST_FETCHED_NOTIFICATION_ID';

export function GET_RESULTS(url) {
  return async (dispatch) => {
    dispatch({ type: IS_RESULT_LOADING, data: true });
    const result = await getResults(url);
    dispatch({ type: IS_RESULT_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data && result.data.hits) {
        dispatch({ type: SET_API_RESULT, data: Object.assign([], result.data.hits.hits) });
      } else if (result.data && result.data.CompanyList) {
        dispatch({ type: SET_TOP_15_API_RESULT, data: Object.assign([], result.data.CompanyList) });
      } else if (result.data) {
        dispatch({ type: SET_API_RESULT, data: Object.assign({}, result.data) });
      }
    }
  };
}

export function GET_POPULAR_RESULTS(url) {
  return async (dispatch) => {
    dispatch({ type: IS_RESULT_LOADING, data: true });
    const result = await getResults(url);
    dispatch({ type: IS_RESULT_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data && result.data.hits) {
        dispatch({ type: SET_POPULAR_RESULT, data: Object.assign([], result.data.hits.hits) });
      }
    }
  };
}

export function GET_RESULTS_METHOD_POST(url, data) {
  return async (dispatch) => {
    dispatch({ type: SET_CHANGESUMMARY_API_LOADING, data: true });
    const result = await getResultsMethodPost(url, data);
    dispatch({ type: SET_CHANGESUMMARY_API_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data && result.data.hits) {
        dispatch({ type: SET_API_RESULT, data: Object.assign([], result.data.hits.hits) });
      } else if (result.data && result.data.CompanyList) {
        dispatch({ type: SET_TOP_15_API_RESULT, data: Object.assign([], result.data.CompanyList) });
      } else if (result.data) {
        dispatch({ type: SET_API_RESULT, data: Object.assign({}, result.data) });
      }
    }
  };
}

export function SET_STOCK_SCREENER_DATA(url, data) {
  return async (dispatch) => {
    dispatch({ type: SET_STOCKSCREENER_API_LOADING, data: true });
    const result = await getScreenerResults(url, data);
    dispatch({ type: SET_STOCKSCREENER_API_LOADING, data: false });
    if (resultOK(result)) {
      dispatch({ type: SET_SCREENER_RESULT, data: Object.assign({}, result.data), count: data.count });
    } else {
      dispatch({ type: SET_SCREENER_RESULT, data: Object.assign({}, { Data: [] }), count: 0 });
    }
  };
}

export function GET_MOST_RECENT_DATA(url, data) {
  return async (dispatch, getState) => {
    const { result } = getState();
    const dataVal = data;
    dataVal.last_fetched_notification_id = result.last_fetched_notification_id;
    dispatch({ type: IS_RESULT_LOADING, data: true });
    const resultData = await getResultsMethodPost(url, dataVal);
    dispatch({ type: IS_RESULT_LOADING, data: false });
    if (resultOK(resultData)) {
      if (resultData.data && resultData.data.data) {
        if (data.page_number === 1) {
          dispatch({ type: SET_API_RESULT, data: Object.assign([], resultData.data.data) });
          dispatch({ type: SET_LAST_FETCHED_NOTIFICATION_ID, data: resultData.data.last_fetched_notification_id || 0 });
        } else {
          dispatch({ type: SET_API_RESULT, data: Object.assign([], result.results.concat(resultData.data.data)) });
        }
        dispatch({ type: SET_TOTAL_MOST_RECENT_RESULT, data: resultData.data.total_pages || 0 });
      } else {
        dispatch({ type: SET_API_RESULT, data: [] });
        dispatch({ type: SET_TOTAL_MOST_RECENT_RESULT, data: 0 });
      }
    } else {
      dispatch({ type: SET_API_RESULT, data: [] });
      dispatch({ type: SET_TOTAL_MOST_RECENT_RESULT, data: 0 });
    }
  };
}
