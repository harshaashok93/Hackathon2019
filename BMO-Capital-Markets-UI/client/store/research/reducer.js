import { initialState } from './selectors';

import {
  SET_RESEARCH_LAYOUT_DATA,
  SET_RESEARCH_PAGE_LOADING,
  SET_RESEARCH_LAYOUT_META_DATA,
  SET_RESEARCH_PAGE_META_DATA_LOADING,
  SET_PUBLICATION_PRIVATE_VIEW
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_RESEARCH_LAYOUT_DATA:
      return {
        ...state,
        researchLayoutData: Object.assign({}, action.data)
      };
    case SET_RESEARCH_LAYOUT_META_DATA:
      return {
        ...state,
        researchLayoutMetaData: Object.assign({}, action.data)
      };
    case SET_RESEARCH_PAGE_LOADING:
      return {
        ...state,
        loading: action.data
      };
    case SET_RESEARCH_PAGE_META_DATA_LOADING:
      return {
        ...state,
        metaDataLoading: action.data
      };
    case SET_PUBLICATION_PRIVATE_VIEW:
      return {
        ...state,
        isPrivateView: action.data
      };
    default:
      return state;
  }
};
