import { initialState } from './selectors';

import {
  SET_MOBILE_LAYOUT_FOR_BMO_RED,
  SET_BMORED_DROPDWON_LIST,
  SET_BMORED_RESULT_LIST,
  SET_BMORED_API_LOADING,
  SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING,
  SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING,
  SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING,
  SET_STOCK_PDF_DOWNLOAD_API_LOADING,
  SET_STOCK_EXCEL_DOWNLOAD_API_LOADING,
  SET_STOCK_PDF_DOWNLOAD_API_LOADING_FAILED,
  SET_STOCK_EXCEL_DOWNLOAD_API_LOADING_FAILED,
  SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING_FAILED,
  SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING_FAILED,
  SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING_FAILED,
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MOBILE_LAYOUT_FOR_BMO_RED:
      return {
        ...state,
        mobileLayout: action.data
      };
    case SET_BMORED_DROPDWON_LIST:
      return {
        ...state,
        dropDownList: action.data
      };
    case SET_BMORED_RESULT_LIST:
      return {
        ...state,
        resultList: action.data
      };
    case SET_BMORED_API_LOADING:
      return {
        ...state,
        bmoredLoading: action.data
      };
    case SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING:
      return {
        ...state,
        bmoredUniversalDownloadLoading: action.data
      };
    case SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING:
      return {
        ...state,
        bmoredIndividualDownloadLoading: action.data
      };
    case SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING:
      return {
        ...state,
        bmoredCompilationDownloadLoading: action.data
      };
    case SET_STOCK_PDF_DOWNLOAD_API_LOADING:
      return {
        ...state,
        bmoStockPdfDownloadLoading: action.data
      };
    case SET_STOCK_PDF_DOWNLOAD_API_LOADING_FAILED:
      return {
        ...state,
        bmoStockPdfDownloadLoadingFailed: action.data
      };
    case SET_STOCK_EXCEL_DOWNLOAD_API_LOADING_FAILED:
      return {
        ...state,
        bmoStockExcelDownloadLoadingFailed: action.data
      };
    case SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING_FAILED:
      return {
        ...state,
        bmoredCompilationDownloadLoadingFailed: action.data
      };
    case SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING_FAILED:
      return {
        ...state,
        bmoredUniverseDownloadLoadingFailed: action.data
      };
    case SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING_FAILED:
      return {
        ...state,
        bmoredIndividualDownloadLoadingFailed: action.data
      };
    case SET_STOCK_EXCEL_DOWNLOAD_API_LOADING:
      return {
        ...state,
        bmoStockExcelDownloadLoading: action.data
      };
    default:
      return state;
  }
};
