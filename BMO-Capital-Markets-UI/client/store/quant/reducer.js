import { initialState } from './selectors';

import {
  SET_QUANT_DATA,
  SET_TIPS_DATA,
  SET_QUANT_FOCAL_POINT,
  SET_QUANT_MARKET_ELEMENT,
  SET_QUANT_COMMENTARY,
  SET_QUANT_FOCAL_POINT_TOTAL,
  SET_QUANT_MARKET_ELEMENT_TOTAL,
  SET_QUANT_COMMENTARY_TOTAL
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_QUANT_DATA:
      return {
        ...state,
        quantData: action.data.data,
        pricedDate: action.data.pricedDate,
        lastUpdateDate: action.data.lastUpdatedDate
      };
    case SET_TIPS_DATA:
      return {
        ...state,
        tipsData: action.data,
        lastUpdateDate: action.data.lastUpdatedDate
      };
    case SET_QUANT_FOCAL_POINT:
      return {
        ...state,
        focalPointReports: action.data
      };
    case SET_QUANT_MARKET_ELEMENT:
      return {
        ...state,
        marketElementReports: action.data
      };
    case SET_QUANT_COMMENTARY:
      return {
        ...state,
        commentaryReports: action.data
      };
    case SET_QUANT_FOCAL_POINT_TOTAL:
      return {
        ...state,
        focalPointTotalCount: action.data
      };
    case SET_QUANT_MARKET_ELEMENT_TOTAL:
      return {
        ...state,
        marketElementTotalCount: action.data
      };
    case SET_QUANT_COMMENTARY_TOTAL:
      return {
        ...state,
        commentaryTotalCount: action.data
      };

    default:
      return state;
  }
};
