export const initialState = {
  results: [],
  stockResults: [],
  stockScreenerData: [],
  stockScreenerLoading: false,
  changeSummaryLoading: false,
  isResultLoading: false,
  stockScreenerTotal: 0,
  popularResults: [],
  last_fetched_notification_id: 0,
  mostRecentTotal: 0,
};

export const getResults = (state = initialState) => state.results;
export const getStockResults = (state = initialState) => state.stockResults;
export const stockScreenerData = (state = initialState) => state.stockScreenerData;
export const getStockScreenerLoading = (state = initialState) => state.stockScreenerLoading;
export const getChangeSummaryLoading = (state = initialState) => state.changeSummaryLoading;
export const getIsResultLoading = (state = initialState) => state.isResultLoading;
export const getStockScreenerTotal = (state = initialState) => state.stockScreenerTotal;
export const getPopularResults = (state = initialState) => state.popularResults;
export const getMostRecentTotal = (state = initialState) => state.mostRecentTotal;
