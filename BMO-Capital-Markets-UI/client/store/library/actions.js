import {
  resultOK,
} from 'api/utils';

import {
  getSearchResults,
  getCorpPublication,
  updateRebrandingIntroVisibilty
} from 'api/library';

import {
  setRebrandingBanner
} from 'api/auth';

import orderBy from 'lodash/orderBy';

export const SET_MOBILE_LAYOUT_STATUS = 'SET_MOBILE_LAYOUT_STATUS';
export const RESET_LIBRARY_FILTERS = 'RESET_LIBRARY_FILTERS';
export const SET_LIBRARY_SEARCH_API_RESULTS = 'SET_LIBRARY_SEARCH_API_RESULTS';
export const SET_LIBRARY_LOADING = 'SET_LIBRARY_LOADING';
export const SET_LOCATION_FILTERS = 'SET_LOCATION_FILTERS';
export const SET_AUTHOR_FILTER = 'SET_AUTHOR_FILTER';
export const SET_REBRANDING_FILTERS = 'SET_REBRANDING_FILTERS';
export const SET_RESEARCH_FILTERS = 'SET_RESEARCH_FILTERS';
export const SET_ADDITIONAL_FILTERS = 'SET_ADDITIONAL_FILTERS';
export const SET_LIBRARY_LAZY_LOADING = 'SET_LIBRARY_LAZY_LOADING';
export const SET_LIBRARY_SEARCH_API_RESULTS_COUNT = 'SET_LIBRARY_SEARCH_API_RESULTS_COUNT';
export const RESET_GICS_TYPE = 'RESET_GICS_TYPE';
export const SET_GICS_TYPE = 'SET_GICS_TYPE';
export const SET_CORP_PUBLICATION = 'SET_CORP_PUBLICATION';
export const SET_LIBRARY_IS_FORM_SORTED = 'SET_LIBRARY_IS_FORM_SORTED';
export const SET_SHOW_MORE_OR_LESS = 'SET_SHOW_MORE_OR_LESS';
export const SHOW_REBRANDING_INTRO = 'SHOW_REBRANDING_INTRO';
export const SET_PODCAST_AUTHOR_LIST = 'SET_PODCAST_AUTHOR_LIST';


export function UPDATE_SHOW_MORE_OR_LESS_FILTER() {
  return (dispatch, getState) => {
    const { library } = getState();
    localStorage.personalizedData = JSON.stringify({ isShowMoreOrLess: !library.isShowMoreOrLess });
    dispatch({ type: SET_SHOW_MORE_OR_LESS, data: !library.isShowMoreOrLess });
  };
}


export function GET_CORP_PUBLICATION(apiDataVal) {
  return async (dispatch) => {
    dispatch({ type: SET_LIBRARY_LOADING, data: true });
    const result = await getCorpPublication(apiDataVal);
    dispatch({ type: SET_CORP_PUBLICATION, data: result });
    dispatch({ type: SET_LIBRARY_LOADING, data: false });
  };
}

let prevLibSearchResData = '';

export function GET_LIBRARY_SEARCH_RESULTS(apiData, data, { append, isFromSort = false }) {
  return async (dispatch, getState) => {
    let isDataLoaded = false;
    const { library } = getState();
    setTimeout(() => {
      if (!isDataLoaded && !append) {
        dispatch({ type: SET_LIBRARY_LOADING, data: true });
      }
    }, 1000);
    if (append) {
      dispatch({ type: SET_LIBRARY_LAZY_LOADING, data: true });
    }
    prevLibSearchResData = JSON.stringify(data);
    const result = await getSearchResults(apiData, data);
    isDataLoaded = true;
    if (prevLibSearchResData !== JSON.stringify(data)) return false;

    dispatch({ type: (append ? SET_LIBRARY_LAZY_LOADING : SET_LIBRARY_LOADING), data: false });
    if (resultOK(result)) {
      if (result.data.hits) {
        const { podcastAuthorList } = library;
        dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS, data: Object.assign([], result.data.hits.hits), append, isFromSort });
        dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS_COUNT, data: result.data.hits.total });
        const authorList = [];
        let resultList = [];
        result.data.hits.hits.map(res => {
          const analyst = res._source.analysts[0];
          const isAnalystAlreadyAvailable = append ? podcastAuthorList.find(author => author.key === analyst.person_id) || authorList.find(author => author.key === analyst.person_id) : authorList.find(author => author.key === analyst.person_id);
          if (!isAnalystAlreadyAvailable) {
            authorList.push({ key: analyst.person_id, value: analyst.person_id, text: analyst.display_name });
          }
        });
        resultList = append ? [...podcastAuthorList, ...authorList] : authorList;
        dispatch({ type: SET_PODCAST_AUTHOR_LIST, data: orderBy(resultList, 'text') });
      } else {
        dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS, data: null });
        dispatch({ type: SET_LIBRARY_IS_FORM_SORTED, data: null });
        dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS_COUNT, data: 0 });
      }
    } else {
      dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS, data: null });
      dispatch({ type: SET_LIBRARY_IS_FORM_SORTED, data: null });
      dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS_COUNT, data: 0 });
    }
    return null;
  };
}

export function UPDATE_REBRANDING_INTRO_VISIBILITY(isLoggedIn) {
  return async (dispatch) => {
    if (isLoggedIn) {
      const result = await updateRebrandingIntroVisibilty();
      if (resultOK(result)) {
        dispatch({ type: SHOW_REBRANDING_INTRO, data: false });
      }
    } else {
      setRebrandingBanner();
      dispatch({ type: SHOW_REBRANDING_INTRO, data: false });
    }
  };
}
