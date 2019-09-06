import {
  resultOK,
} from 'api/utils';

import {
  researchLayoutAPI,
} from 'api/research';

export const SET_RESEARCH_LAYOUT_DATA = 'SET_RESEARCH_LAYOUT_DATA';
export const SET_RESEARCH_PAGE_LOADING = 'SET_RESEARCH_PAGE_LOADING';
export const SET_RESEARCH_LAYOUT_META_DATA = 'SET_RESEARCH_LAYOUT_META_DATA';
export const SET_RESEARCH_PAGE_META_DATA_LOADING = 'SET_RESEARCH_PAGE_META_DATA_LOADING';
export const SET_PUBLICATION_PRIVATE_VIEW = 'SET_PUBLICATION_PRIVATE_VIEW';

export function GET_RESEARCH_LAYOUT_DATA(pid, url) {
  return async (dispatch) => {
    dispatch({ type: SET_RESEARCH_PAGE_LOADING, data: true });
    const result = await researchLayoutAPI(pid, url);
    dispatch({ type: SET_RESEARCH_PAGE_LOADING, data: false });
    const { data } = result;
    if (!data) return;

    if (!resultOK(result)) {
      if (result.status === 404) {
        dispatch({ type: SET_RESEARCH_LAYOUT_DATA, data: Object.assign({}, data) });
        dispatch({ type: SET_PUBLICATION_PRIVATE_VIEW, data: typeof data.private_view === 'boolean' ? data.private_view : true });
      } else {
        dispatch({ type: SET_RESEARCH_LAYOUT_DATA, data: {} });
        dispatch({ type: SET_PUBLICATION_PRIVATE_VIEW, data: typeof data.private_view === 'boolean' ? data.private_view : true });
        return;
      }
    }

    dispatch({ type: SET_RESEARCH_LAYOUT_DATA, data: Object.assign({}, data) });
    dispatch({ type: SET_PUBLICATION_PRIVATE_VIEW, data: typeof data.private_view === 'boolean' ? data.private_view : true });
  };
}

export function GET_RESEARCH_LAYOUT_META_DATA(url) {
  return async (dispatch) => {
    dispatch({ type: SET_RESEARCH_PAGE_META_DATA_LOADING, data: true });
    const result = await researchLayoutAPI(null, url);
    dispatch({ type: SET_RESEARCH_PAGE_META_DATA_LOADING, data: false });
    const { data } = result;
    if (!resultOK(result)) {
      dispatch({ type: SET_RESEARCH_LAYOUT_META_DATA, data: {} });
      return;
    }
    if (!data) return;
    dispatch({ type: SET_RESEARCH_LAYOUT_META_DATA, data: Object.assign({}, data) });
  };
}
