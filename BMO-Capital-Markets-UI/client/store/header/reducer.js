import { initialState } from './selectors';

import {
  CLOSE_MEGA_MENU,
  OPEN_MEGA_MENU,
  SET_LEFT_MENU_SELECTED_TEXT
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_MEGA_MENU:
      return {
        ...state,
        megaMenuOpen: false,
      };
    case OPEN_MEGA_MENU:
      return {
        ...state,
        megaMenuOpen: true,
      };
    case SET_LEFT_MENU_SELECTED_TEXT:
      return {
        ...state,
        selectedText: action.data,
        isOpen: action.isOpen,
      };
    default:
      return state;
  }
};
