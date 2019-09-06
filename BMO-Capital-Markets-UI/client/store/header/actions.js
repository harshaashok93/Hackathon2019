export const CLOSE_MEGA_MENU = 'CLOSE_MEGA_MENU';
export const OPEN_MEGA_MENU = 'OPEN_MEGA_MENU';
export const SET_LEFT_MENU_SELECTED_TEXT = 'SET_LEFT_MENU_SELECTED_TEXT';


export function SET_LEFT_MENU_TEXT(data, isOpen) {
  return async (dispatch) => {
    dispatch({ type: SET_LEFT_MENU_SELECTED_TEXT, data, isOpen });
  };
}

