import {
  resultOK,
} from 'api/utils';

import { downloadBlobFile } from 'utils';

import {
  getDropdownList,
  getResultList,
  downloadBmoRedLink,
  downloadStockScreenerExcelLink,
  downloadStockScreenerPdfLink,
} from 'api/bmored';

export const SET_MOBILE_LAYOUT_FOR_BMO_RED = 'SET_MOBILE_LAYOUT_FOR_BMO_RED';
export const SET_BMORED_DROPDWON_LIST = 'SET_BMORED_DROPDWON_LIST';
export const SET_BMORED_RESULT_LIST = 'SET_BMORED_RESULT_LIST';
export const SET_BMORED_API_LOADING = 'SET_BMORED_API_LOADING';
export const SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING = 'SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING';
export const SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING = 'SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING';
export const SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING = 'SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING';
export const SET_STOCK_PDF_DOWNLOAD_API_LOADING = 'SET_STOCK_PDF_DOWNLOAD_API_LOADING';
export const SET_STOCK_EXCEL_DOWNLOAD_API_LOADING = 'SET_STOCK_EXCEL_DOWNLOAD_API_LOADING';
export const SET_STOCK_PDF_DOWNLOAD_API_LOADING_FAILED = 'SET_STOCK_PDF_DOWNLOAD_API_LOADING_FAILED';
export const SET_STOCK_EXCEL_DOWNLOAD_API_LOADING_FAILED = 'SET_STOCK_EXCEL_DOWNLOAD_API_LOADING_FAILED';
export const SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING_FAILED = 'SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING_FAILED';
export const SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING_FAILED = 'SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING_FAILED';
export const SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING_FAILED = 'SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING_FAILED';

export function GET_BMO_RED_DROPDOWN_LIST() {
  return async (dispatch) => {
    const result = await getDropdownList();
    if (resultOK(result)) {
      if (result.data.data) {
        dispatch({ type: SET_BMORED_DROPDWON_LIST, data: Object.assign([], result.data.data) });
      } else {
        dispatch({ type: SET_BMORED_DROPDWON_LIST, data: {} });
      }
    } else {
      dispatch({ type: SET_BMORED_DROPDWON_LIST, data: {} });
    }
  };
}

export function GET_BMO_RED_RESULTS(data) {
  return async (dispatch) => {
    dispatch({ type: SET_BMORED_API_LOADING, data: true });
    const result = await getResultList(data);
    dispatch({ type: SET_BMORED_API_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        const data = result.data.data ? result.data.data.companyList : [];
        dispatch({ type: SET_BMORED_RESULT_LIST, data: Object.assign([], data) });
      } else {
        dispatch({ type: SET_BMORED_RESULT_LIST, data: [] });
      }
    } else {
      dispatch({ type: SET_BMORED_RESULT_LIST, data: [] });
    }
  };
}

export function DOWNLOAD_BMO_RED_LINK(linkType, bmIds) {
  return async (dispatch) => {
    dispatch({ type: `SET_BMORED_${linkType.toUpperCase()}_DOWNLOAD_API_LOADING`, data: true });
    downloadBmoRedLink({
      bm_ids: bmIds,
      download_type: linkType,
    }).then(r => {
      if (r.ok) {
        return r.blob();
      }
      return null;
    }).then((result) => {
      if (!result) {
        dispatch({ type: `SET_BMORED_${linkType.toUpperCase()}_DOWNLOAD_API_LOADING_FAILED`, data: true });
        return;
      }
      if (linkType === 'Universe') {
        downloadBlobFile({
          content: result,
          contentType: 'application/pdf',
          filename: 'BMORedUniverse.pdf'
        });
      } else if (linkType === 'Compilation') {
        downloadBlobFile({
          content: result,
          contentType: 'application/pdf',
          filename: 'BMORedCompliation.pdf'
        });
      } else if (linkType === 'Individual') {
        downloadBlobFile({
          content: result,
          contentType: 'application/zip',
          filename: 'BMORedIndividual.zip'
        });
      }
      dispatch({ type: `SET_BMORED_${linkType.toUpperCase()}_DOWNLOAD_API_LOADING`, data: false });
    }).catch(() => {
      dispatch({ type: `SET_BMORED_${linkType.toUpperCase()}_DOWNLOAD_API_LOADING`, data: false });
    });
  };
}

export function DOWNLOAD_STOCK_SCREENER_EXCEL_LINK(api, data) {
  return async (dispatch) => {
    dispatch({ type: SET_STOCK_EXCEL_DOWNLOAD_API_LOADING, data: true });
    const datadict = data;
    datadict.download = true;
    datadict.type = 'xlsx';
    downloadStockScreenerExcelLink(
      api,
      datadict,
    ).then(r => {
      if (r.ok) {
        return r.blob();
      }
      return null;
    }).then((result) => {
      dispatch({ type: SET_STOCK_EXCEL_DOWNLOAD_API_LOADING, data: false });
      if (!result) {
        dispatch({ type: SET_STOCK_EXCEL_DOWNLOAD_API_LOADING_FAILED, data: true });
        return;
      }
      downloadBlobFile({
        content: result,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: 'StockScreener.xlsx'
      });
    }).catch(() => {
      dispatch({ type: SET_STOCK_EXCEL_DOWNLOAD_API_LOADING, data: false });
    });
  };
}

export function DOWNLOAD_STOCK_SCREENER_PDF_LINK(api, data) {
  return async (dispatch) => {
    dispatch({ type: SET_STOCK_PDF_DOWNLOAD_API_LOADING, data: true });
    const datadict = data;
    datadict.download = true;
    datadict.type = 'pdf';
    downloadStockScreenerPdfLink(
      api,
      datadict,
    ).then(r => {
      if (r.ok) {
        return r.blob();
      }
      return null;
    }).then((result) => {
      if (!result) {
        dispatch({ type: SET_STOCK_PDF_DOWNLOAD_API_LOADING_FAILED, data: true });
        return;
      }
      downloadBlobFile({
        content: result,
        contentType: 'application/pdf',
        filename: 'StockScreener.pdf'
      });
      dispatch({ type: SET_STOCK_PDF_DOWNLOAD_API_LOADING, data: false });
    }).catch(() => {
      dispatch({ type: SET_STOCK_PDF_DOWNLOAD_API_LOADING, data: false });
    });
  };
}


export function SET_DOWNLOAD_FAILED(data) {
  return async (dispatch) => {
    if (data === 'stockScreenerPdf') {
      dispatch({ type: SET_STOCK_PDF_DOWNLOAD_API_LOADING_FAILED, data: false });
      dispatch({ type: SET_STOCK_PDF_DOWNLOAD_API_LOADING, data: false });
    }
    if (data === 'stockScreenerExcel') {
      dispatch({ type: SET_STOCK_EXCEL_DOWNLOAD_API_LOADING_FAILED, data: false });
      dispatch({ type: SET_STOCK_EXCEL_DOWNLOAD_API_LOADING, data: false });
    }
    if (data === 'bmoRedUniverse') {
      dispatch({ type: SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING_FAILED, data: false });
      dispatch({ type: SET_BMORED_UNIVERSE_DOWNLOAD_API_LOADING, data: false });
    }
    if (data === 'bmoRedCompilation') {
      dispatch({ type: SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING_FAILED, data: false });
      dispatch({ type: SET_BMORED_COMPILATION_DOWNLOAD_API_LOADING, data: false });
    }
    if (data === 'bmoRedIndividual') {
      dispatch({ type: SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING_FAILED, data: false });
      dispatch({ type: SET_BMORED_INDIVIDUAL_DOWNLOAD_API_LOADING, data: false });
    }
  };
}
