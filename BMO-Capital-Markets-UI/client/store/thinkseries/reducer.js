import { initialState } from './selectors';

import {
  SET_THINK_SERIES_EVENTS,
  SET_THINK_SERIES_VIDEOCASTS,
  SET_THINK_SERIES_FLASHES,
  IS_DATA_LOADING
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_DATA_LOADING:
      return {
        ...state,
        isLoading: action.data
      };
    case SET_THINK_SERIES_EVENTS:
      return {
        ...state,
        events: action.data.currentPageNum === 1 ? action.data.data : state.events.concat(action.data.data),
        eventTotal: action.data.total,
      };
    case SET_THINK_SERIES_VIDEOCASTS:
      return {
        ...state,
        videocats: action.data.currentPageNum === 1 ? action.data.data : state.videocats.concat(action.data.data),
        videocastTotal: action.data.total,
      };
    case SET_THINK_SERIES_FLASHES:
      return {
        ...state,
        flashes: action.data.currentPageNum === 1 ? action.data.data : state.flashes.concat(action.data.data),
        flashTotal: action.data.total,
      };
    default:
      return state;
  }
};
