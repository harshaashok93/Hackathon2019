export const initialState = {
  mobileLayout: false,
  dropDownList: {},
  resultList: [],
  bmoredLoading: false,
  bmoredUniversalDownloadLoading: false,
  bmoredIndividualDownloadLoading: false,
  bmoredCompilationDownloadLoading: false,
  bmoStockExcelDownloadLoading: false,
  bmoStockPdfDownloadLoading: false,
  bmoStockPdfDownloadLoadingFailed: false,
  bmoStockExcelDownloadLoadingFailed: false,
  bmoredCompilationDownloadLoadingFailed: false,
  bmoredUniverseDownloadLoadingFailed: false,
  bmoredIndividualDownloadLoadingFailed: false
};

export const isMobileLayout = (state = initialState) => state.mobileLayout;
export const getdropdownList = (state = initialState) => state.dropDownList;
export const getResultList = (state = initialState) => state.resultList;
export const getBmoRedLoading = (state = initialState) => state.bmoredLoading;
export const getBmoredUniversalDownloadLoading = (state = initialState) => state.bmoredUniversalDownloadLoading;
export const getBmoredIndividualDownloadLoading = (state = initialState) => state.bmoredIndividualDownloadLoading;
export const getBmoredCompilationDownloadLoading = (state = initialState) => state.bmoredCompilationDownloadLoading;
export const getBmoStockExcelDownloadLoading = (state = initialState) => state.bmoStockExcelDownloadLoading;
export const getBmoStockPdfDownloadLoading = (state = initialState) => state.bmoStockPdfDownloadLoading;
export const getBmoStockPdfDownloadLoadingFailed = (state = initialState) => state.bmoStockPdfDownloadLoadingFailed;
export const getBmoStockExcelDownloadLoadingFailed = (state = initialState) => state.bmoStockExcelDownloadLoadingFailed;
export const getBmoredCompilationDownloadLoadingFailed = (state = initialState) => state.bmoredCompilationDownloadLoadingFailed;
export const getBmoredUniverseDownloadLoadingFailed = (state = initialState) => state.bmoredUniverseDownloadLoadingFailed;
export const getBmoredIndividualDownloadLoadingFailed = (state = initialState) => state.bmoredIndividualDownloadLoadingFailed;
