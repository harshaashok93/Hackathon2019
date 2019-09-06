export const initialState = {
  dropDownList: [],
  filterResults: [],
  filterOption: '',
  mobileLayout: false,
  subOption: '',
  isLoading: false,
  reportSubOption: '',
  fromDate: '',
  toDate: '',
  mediaResult: [],
  videoResult: [],
  isMediaLoading: false,
  isVideoLoading: false,
  strategyLandingPage: [],
  total: 0,
  videocastTotal: 0,
};

export const getDropDownList = (state = initialState) => state.dropDownList;
export const getFilterResults = (state = initialState) => state.filterResults;
export const isMobileLayout = (state = initialState) => state.mobileLayout;
export const getReportSubOption = (state = initialState) => state.reportSubOption;
export const isLoading = (state = initialState) => state.isLoading;
export const getMediaLoading = (state = initialState) => state.isMediaLoading;
export const getVideoLoading = (state = initialState) => state.isVideoLoading;
export const getFilterOption = (state = initialState) => state.filterOption;
export const getFromDate = (state = initialState) => state.fromDate;
export const getToDate = (state = initialState) => state.toDate;
export const getMediaResult = (state = initialState) => state.mediaResult;
export const getVideoResult = (state = initialState) => state.videoResult;
export const getStrategyLandingPage = (state = initialState) => state.strategyLandingPage;
export const getTotal = (state = initialState) => state.total;
export const getVideocastTotal = (state = initialState) => state.videocastTotal;
