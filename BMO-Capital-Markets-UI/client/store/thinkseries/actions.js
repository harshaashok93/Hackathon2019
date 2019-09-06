import {
  resultOK,
} from 'api/utils';

import {
  getResults,
} from 'api/thinkseries';

export const SET_THINK_SERIES_EVENTS = 'SET_THINK_SERIES_EVENTS';
export const SET_THINK_SERIES_VIDEOCASTS = 'SET_THINK_SERIES_VIDEOCASTS';
export const SET_THINK_SERIES_FLASHES = 'SET_THINK_SERIES_FLASHES';
export const IS_DATA_LOADING = 'IS_DATA_LOADING';

export function GET_THINK_SERIES_RESULTS(reqParameter) {
  return async (dispatch) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const result = await getResults(reqParameter);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data.events) {
        dispatch({
          type: SET_THINK_SERIES_EVENTS,
          data: {
            data: Object.assign([], result.data.events.data),
            total: result.data.events.total,
            currentPageNum: reqParameter.events.page || 1,
          }
        });
      }
      if (result.data.videocasts) {
        dispatch({
          type: SET_THINK_SERIES_VIDEOCASTS,
          data: {
            data: Object.assign([], result.data.videocasts.data),
            total: result.data.videocasts.total,
            currentPageNum: reqParameter.videocasts.page || 1,
          }
        });
      }
      if (result.data.flashes) {
        dispatch({
          type: SET_THINK_SERIES_FLASHES,
          data: {
            data: Object.assign([], result.data.flashes.data),
            total: result.data.flashes.total,
            currentPageNum: reqParameter.flashes.page || 1,
          }
        });
      }
    }
  };
}
