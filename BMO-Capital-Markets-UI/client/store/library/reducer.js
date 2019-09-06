import { initialState } from './selectors';

import {
  SET_MOBILE_LAYOUT_STATUS,
  RESET_LIBRARY_FILTERS,
  SET_LIBRARY_SEARCH_API_RESULTS,
  SET_LIBRARY_LOADING,
  SET_LOCATION_FILTERS,
  SET_RESEARCH_FILTERS,
  SET_ADDITIONAL_FILTERS,
  SET_AUTHOR_FILTER,
  SET_LIBRARY_LAZY_LOADING,
  SET_LIBRARY_SEARCH_API_RESULTS_COUNT,
  RESET_GICS_TYPE,
  SET_GICS_TYPE,
  SET_CORP_PUBLICATION,
  SET_LIBRARY_IS_FORM_SORTED,
  SET_SHOW_MORE_OR_LESS,
  SET_INTRODUCTION_VISIBILITY,
  SET_REBRANDING_FILTERS,
  SET_PODCAST_AUTHOR_LIST
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MOBILE_LAYOUT_STATUS:
      return {
        ...state,
        mobileLayout: action.data
      };
    case SET_CORP_PUBLICATION:
      return {
        ...state,
        corpPublicationData: action.data.data.hits
      };
    case RESET_LIBRARY_FILTERS:
      return {
        ...state,
        ...action.data
      };
    case SET_LIBRARY_SEARCH_API_RESULTS:
      return {
        ...state,
        results: (action.append ? state.results.concat(action.data) : action.data),
        isFromSort: action.isFromSort || false
      };
    case SET_LIBRARY_IS_FORM_SORTED:
      return {
        ...state,
        isFromSort: action.data || false
      };
    case SET_LIBRARY_SEARCH_API_RESULTS_COUNT:
      return {
        ...state,
        count: action.data
      };
    case SET_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: action.data
      };
    case SET_LIBRARY_LAZY_LOADING:
      return {
        ...state,
        isLibraryLazyLoading: action.data
      };
    case SET_LOCATION_FILTERS:
      return {
        ...state,
        locationFilters: action.data
      };
    case SET_REBRANDING_FILTERS:
      return {
        ...state,
        rebrandingFilters: action.data
      };
    case SET_RESEARCH_FILTERS:
      return {
        ...state,
        researchFilters: action.data
      };
    case SET_ADDITIONAL_FILTERS:
      return {
        ...state,
        additionalFilters: action.data
      };
    case SET_AUTHOR_FILTER:
      return {
        ...state,
        personid: action.data
      };
    case SET_GICS_TYPE:
      return {
        ...state,
        gicsType: action.data
      };
    case RESET_GICS_TYPE:
      return {
        ...state,
        gicsType: ''
      };
    case SET_SHOW_MORE_OR_LESS:
      return {
        ...state,
        isShowMoreOrLess: action.data
      };
    case SET_INTRODUCTION_VISIBILITY:
      return {
        ...state,
        isIntroductionVisible: action.data
      };
    case SET_PODCAST_AUTHOR_LIST:
      return {
        ...state,
        podcastAuthorList: action.data
      };
    default:
      return state;
  }
};
