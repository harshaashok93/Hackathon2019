import {
  resultOK,
} from 'api/utils';

import {
  getDropdownList,
  getResultList,
} from 'api/bmomodels';

import {
  getGraph
} from 'api/qmodel';

export const SET_MOBILE_LAYOUT_FOR_BMO_MODELS = 'SET_MOBILE_LAYOUT_FOR_BMO_MODELS';
export const SET_BMO_MODEL_DROPDWON_LIST = 'SET_BMO_MODEL_DROPDWON_LIST';
export const SET_BMO_MODELS_RESULT_LIST = 'SET_BMO_MODELS_RESULT_LIST';
export const SET_BMO_MODELS_LOADING = 'SET_BMO_MODELS_LOADING';
export const SET_HACK_GRAPH_DATA = 'SET_HACK_GRAPH_DATA';

export function GET_BMO_MODELS_DROPDOWN_LIST(data) {
  return async (dispatch) => {
    const result = await getDropdownList(data);
    if (resultOK(result)) {
      if (result.data.data) {
        dispatch({ type: SET_BMO_MODEL_DROPDWON_LIST, data: Object.assign([], result.data.data.coverage) });
      }
    }
  };
}

export function GET_BMO_MODEL_RESULTS(api, data) {
  return async (dispatch) => {
    dispatch({ type: SET_BMO_MODELS_LOADING, data: true });
    const result = await getResultList(api, data);
    dispatch({ type: SET_BMO_MODELS_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_BMO_MODELS_RESULT_LIST, data: Object.assign([], result.data.data), count: data.page, total: result.data.total });
      }
    }
  };
}

export function GET_GRAPH_HACK_DATA() {
  return async (dispatch) => {
    const result = await getGraph();
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_HACK_GRAPH_DATA, data: result.data });
      }
    }
  };
}
