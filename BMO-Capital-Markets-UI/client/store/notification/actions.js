import { resultOK } from 'api/utils';
import {
  getNotifications,
  updateNotifications
} from 'api/notification';
import { USER_AUTH_LOGOUT } from '../user/actions';

export const NOTIFICATION_DATA = 'NOTIFICATION_DATA';
export const NOTIFICATION_COUNT = 'NOTIFICATION_COUNT';

export function GET_USER_NOTIFICATION() {
  return async (dispatch) => {
    const result = await getNotifications();
    if (resultOK(result)) {
      dispatch({ type: NOTIFICATION_DATA, data: result.data });
      dispatch({ type: NOTIFICATION_COUNT, data: result.data.unread_count });
    } else if (!resultOK(result) && result.status === 401) {
      dispatch(USER_AUTH_LOGOUT());
    }
  };
}

export function UPDATE_NOTIFICATION(latestNotificationDate) {
  return async (dispatch, getState) => {
    const res = await updateNotifications({ created_date: latestNotificationDate });
    const { notification } = getState();
    if (res && res.status === 200) {
      if (notification && notification.notificationData && notification.notificationData.length) {
        dispatch({ type: NOTIFICATION_COUNT, data: 0 });
      }
    } else if (!resultOK(res) && res.status === 401) {
      dispatch(USER_AUTH_LOGOUT());
    }
  };
}
