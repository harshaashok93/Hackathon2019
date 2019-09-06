export const initialState = {
  notificationCount: 0,
  notificationData: [],
  notificationMessage: ''
};

export const getNotificationCount = (state = initialState) => state.notificationCount;

export const getNotificationData = (state = initialState) => state.notificationData;

export const getNotificationMessage = (state = initialState) => state.notificationMessage;
