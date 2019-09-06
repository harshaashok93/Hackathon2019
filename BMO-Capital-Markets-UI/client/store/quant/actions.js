import {
  resultOK,
} from 'api/utils';

import {
  getQuantData,
  getTipsData,
  getQuantSectionData
} from 'api/quant';

export const SET_QUANT_DATA = 'SET_QUANT_DATA';
export const SET_TIPS_DATA = 'SET_TIPS_DATA';
export const SET_QUANT_FOCAL_POINT = 'SET_QUANT_FOCAL_POINT';
export const SET_QUANT_MARKET_ELEMENT = 'SET_QUANT_MARKET_ELEMENT';
export const SET_QUANT_COMMENTARY = 'SET_QUANT_COMMENTARY';
export const SET_QUANT_FOCAL_POINT_TOTAL = 'SET_QUANT_FOCAL_POINT_TOTAL';
export const SET_QUANT_MARKET_ELEMENT_TOTAL = 'SET_QUANT_MARKET_ELEMENT_TOTAL';
export const SET_QUANT_COMMENTARY_TOTAL = 'SET_QUANT_COMMENTARY_TOTAL';

export function GET_QUANT_DATA() {
  return async (dispatch) => {
    const result = await getQuantData();
    const { data } = result.data;
    if (!resultOK(result)) {
      dispatch({ type: SET_QUANT_DATA, data: {} });
      return;
    }
    if (!data) return;
    dispatch({ type: SET_QUANT_DATA, data: result.data });
  };
}
export function GET_TIPS_DATA() {
  return async (dispatch) => {
    const result = await getTipsData();
    const { data } = result;
    if (!resultOK(result)) {
      dispatch({ type: SET_TIPS_DATA, data: {} });
      return;
    }
    if (!data) return;
    dispatch({ type: SET_TIPS_DATA, data: Object.assign({}, data) });
  };
}

export function GET_QUANT_FOCAL_POINT(data) {
  return async (dispatch) => {
    const result = await getQuantSectionData(data);
    if (resultOK(result) && result.data) {
      dispatch({ type: SET_QUANT_FOCAL_POINT, data: Object.assign([], result.data.data || []) });
      dispatch({ type: SET_QUANT_FOCAL_POINT_TOTAL, data: result.data.total });
    }
  };
}
export function GET_QUANT_MARKET_ELEMENT(data) {
  return async (dispatch) => {
    const result = await getQuantSectionData(data);
    if (resultOK(result) && result.data) {
      dispatch({ type: SET_QUANT_MARKET_ELEMENT, data: Object.assign([], result.data.data || []) });
      dispatch({ type: SET_QUANT_MARKET_ELEMENT_TOTAL, data: result.data.total });
    }
  };
}
export function GET_QUANT_COMMENTARY(data) {
  return async (dispatch) => {
    const result = await getQuantSectionData(data);
    if (resultOK(result) && result.data) {
      dispatch({ type: SET_QUANT_COMMENTARY, data: Object.assign([], result.data.data || []) });
      dispatch({ type: SET_QUANT_COMMENTARY_TOTAL, data: result.data.total });
    }
  };
}
