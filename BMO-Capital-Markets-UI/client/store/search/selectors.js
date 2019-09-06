export const initialState = {
  results: {},
  searchEvent: {
    type: '',
    oftenSearch: [],
  }
};

export const getSearchResults = (state = initialState) => state.results;
export const getSearchEvent = (state = initialState) => state.searchEvent;
export const getOftenSearch = (state = initialState) => state.oftenSearch;
