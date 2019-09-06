import { initialState } from './selectors';
import {
  NOTIFICATION_DATA,
  NOTIFICATION_COUNT
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_DATA:
      return {
        ...state,
        notificationData: action.data.data,
        notificationMessage: action.data.message
      };
    case NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action.data
      };
    default: return state;
  }
};
