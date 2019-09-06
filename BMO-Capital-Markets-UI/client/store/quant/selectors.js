export const initialState = {
  quantData: {},
  tipsData: {},
  pricedDate: '',
  focalPointReports: [],
  marketElementReports: [],
  commentaryReports: [],
  focalPointTotalCount: 0,
  marketElementTotalCount: 0,
  commentaryTotalCount: 0,
  lastUpdateDate: '',
};

export const getQuantData = (state = initialState) => state.quantData;
export const getTipsData = (state = initialState) => state.tipsData;
export const getQuantPricedDate = (state = initialState) => state.pricedDate;
export const getFocalPointReports = (state = initialState) => state.focalPointReports;
export const getmMrketElementReports = (state = initialState) => state.marketElementReports;
export const getCommentaryReports = (state = initialState) => state.commentaryReports;
export const getFocalPointTotalCount = (state = initialState) => state.focalPointTotalCount;
export const getMarketElementTotalCount = (state = initialState) => state.marketElementTotalCount;
export const getCommentaryTotalCount = (state = initialState) => state.commentaryTotalCount;
export const getLastUpdateDate = (state = initialState) => state.lastUpdateDate;
