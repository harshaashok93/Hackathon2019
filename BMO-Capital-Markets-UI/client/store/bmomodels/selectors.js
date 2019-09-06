export const initialState = {
  mobileLayout: false,
  dropDownList: {},
  resultList: [],
  isLoading: false,
  bmoModelTotal: 0,
};

export const isMobileLayout = (state = initialState) => state.mobileLayout;
export const getdropdownList = (state = initialState) => state.dropDownList;
export const getResultList = (state = initialState) => state.resultList;
export const isLoading = (state = initialState) => state.isLoading;
export const getBMOMOdelTotal = (state = initialState) => state.bmoModelTotal;
