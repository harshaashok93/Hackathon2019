import { initialState } from './selectors';

import {
  SET_BMO_MODEL_DROPDWON_LIST,
  SET_BMO_MODELS_RESULT_LIST,
  SET_BMO_MODELS_LOADING,
  SET_MOBILE_LAYOUT_FOR_BMO_MODELS
} from './actions';

export default (state = initialState, action) => {
  let bmoModelsDataArray = [];
  if (action.count) {
    bmoModelsDataArray = action.count === 1 ? action.data : state.resultList.concat(action.data);
  }
  switch (action.type) {
    case SET_MOBILE_LAYOUT_FOR_BMO_MODELS:
      return {
        ...state,
        mobileLayout: action.data
      };
    case SET_BMO_MODEL_DROPDWON_LIST:
      return {
        ...state,
        dropDownList: action.data
      };
    case SET_BMO_MODELS_RESULT_LIST:
      return {
        ...state,
        resultList: bmoModelsDataArray,
        bmoModelTotal: action.total,
      };
    case SET_BMO_MODELS_LOADING:
      return {
        ...state,
        isLoading: action.data,
      };
    default:
      return state;
  }
};
