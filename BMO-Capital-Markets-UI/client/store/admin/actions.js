import {
  resultOK,
} from 'api/utils';

import {
  getUserInfo,
  searchResult,
  getCalendarRequests,
  getDefaultSearchResult,
  setDefaultSearchResult,
  getCalendarEvents,
  getPublishedCalendarEvents,
  getClientLookUpData,
  putSFFilterCall,
  putCMSFilterCall,
  getUserSFData,
  updateUserData,
  linkCmsToSalesforce,
  getUserCount,
  updateStatus,
  updateUserInfoData,
  unlinkingExistingUser,
} from 'api/admin';

export const SET_ADMIN_MODERATION_STATUS_DROPDWON_LIST = 'SET_ADMIN_MODERATION_STATUS_DROPDWON_LIST';
export const SET_ADMIN_MODERATION_USER_LIST = 'SET_ADMIN_MODERATION_USER_LIST';
export const SET_ADMIN_CALENDAR_REQUESTS_LISTS = 'SET_ADMIN_CALENDAR_REQUESTS_LISTS';
export const SET_ADMIN_SF_CALENDAR_EVENTS = 'SET_ADMIN_SF_CALENDAR_EVENTS';
export const SET_ADMIN_PUBLISHED_CALENDAR_EVENTS = 'SET_ADMIN_PUBLISHED_CALENDAR_EVENTS';
export const SET_ADMIN_REQUEST_STATUS_DROPDOWNLIST = 'SET_ADMIN_REQUEST_STATUS_DROPDOWNLIST';
export const SET_ADMIN_SF_EVENT_TYPE_DROPDOWNLIST = 'SET_ADMIN_SF_EVENT_TYPE_DROPDOWNLIST';
export const SET_ADMIN_EVENT_LOCATION_DROPDOWNLIST = 'SET_ADMIN_EVENT_LOCATION_DROPDOWNLIST';
export const SET_ADMIN_SF_EVENT_LOCATION_DROPDOWNLIST = 'SET_ADMIN_SF_EVENT_LOCATION_DROPDOWNLIST';
export const SET_DEFAULT_SEARCH_RESULTS = 'SET_DEFAULT_SEARCH_RESULTS';
export const SET_CLIENT_LOOK_UP_DATA = 'SET_CLIENT_LOOK_UP_DATA';
export const SET_SF_DATA_LOADING = 'SET_SF_DATA_LOADING';
export const SET_CMS_DATA_LOADING = 'SET_CMS_DATA_LOADING';
export const SET_ADMIN_SF_EVENT_FROM_TO = 'SET_ADMIN_SF_EVENT_FROM_TO';
export const SET_ADMIN_CMS_EVENT_FROM_TO = 'SET_ADMIN_CMS_EVENT_FROM_TO';
export const SET_DEFAULT_SEARCH_RESULTS_SAVING = 'SET_DEFAULT_SEARCH_RESULTS_SAVING';
export const USER_SALEFORCE_DATA = 'USER_SALEFORCE_DATA';
export const SET_CLIENTLOOKUP_DATA_LOADING = 'SET_CLIENTLOOKUP_DATA_LOADING';
export const SET_SALESFORCE_USER_DATA_LOADING = 'SET_SALESFORCE_USER_DATA_LOADING';
export const SET_USER_INFO_UPDATE_LOADING = 'SET_USER_INFO_UPDATE_LOADING';
export const SET_USER_UPDATE_RESPONSE_MESSAGE = 'SET_USER_UPDATE_RESPONSE_MESSAGE';
export const SET_ADMIN_MODERATION_NOTIFICATION_COUNT = 'SET_ADMIN_MODERATION_NOTIFICATION_COUNT';
export const USER_COUNT_LOADING = 'USER_COUNT_LOADING';
export const SET_USER_COUNT_ADVANCE_FILTER = 'SET_USER_COUNT_ADVANCE_FILTER';
export const SET_OR_CLEAR_ADVANCE_FILTER = 'SET_OR_CLEAR_ADVANCE_FILTER';
export const USER_STATUS_UPDATE_ERROR_MESSAGE = 'USER_STATUS_UPDATE_ERROR_MESSAGE';
export const ADMIN_PAGE_LOADER = 'ADMIN_PAGE_LOADER';
export const SET_ADMIN_MODERATION_REGION = 'SET_ADMIN_MODERATION_REGION';
export const USER_INFO_SAVE_LOADING = 'USER_INFO_SAVE_LOADING';
export const USER_INFO_SAVE_ERROR = 'USER_INFO_SAVE_ERROR';
export const UNLINK_EXISTING_USER_LOADING = 'UNLINK_EXISTING_USER_LOADING';
export const SUCCESS_UNLINKING_USER = 'SUCCESS_UNLINKING_USER';
export const TOTAL_USER_COUNT = 'TOTAL_USER_COUNT';
export const SET_PENDING_USER_COUNT = 'SET_PENDING_USER_COUNT';


export function GET_USER_MODERATION_INFORMATION(data) {
  return async (dispatch) => {
    dispatch({ type: ADMIN_PAGE_LOADER, data: true });
    const result = await getUserInfo(data);
    dispatch({ type: ADMIN_PAGE_LOADER, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_MODERATION_STATUS_DROPDWON_LIST, data: Object.assign([], result.data.statuses) });
        dispatch({ type: SET_ADMIN_MODERATION_REGION, data: Object.assign([], result.data.regions) });
        dispatch({ type: SET_ADMIN_MODERATION_USER_LIST, data: Object.assign([], result.data.users) });
        dispatch({ type: SET_PENDING_USER_COUNT, data: result.data.pendingUserCount || 0 });
        dispatch({ type: SET_ADMIN_MODERATION_NOTIFICATION_COUNT, data: result.data.notificationCount });
        dispatch({ type: SET_OR_CLEAR_ADVANCE_FILTER, data: 'newValue' });
        dispatch({ type: TOTAL_USER_COUNT, data: result.data.total });
      } else {
        dispatch({ type: SET_OR_CLEAR_ADVANCE_FILTER, data: 'originalValue' });
      }
    }
  };
}

export function UPDATE_USER_INFO_DATA(data, index, isDelayRequired = true) {
  return async (dispatch, getState) => {
    const { admin } = getState();
    const loaderDelay = isDelayRequired ? 2000 : 0;
    dispatch({ type: USER_INFO_SAVE_ERROR, data: { error: [], save: false } });
    dispatch({ type: USER_INFO_SAVE_LOADING, data: true });
    const result = await updateUserInfoData(data);
    if (resultOK(result) && result.data && result.data.data) {
      setTimeout(() => {
        dispatch({ type: USER_INFO_SAVE_LOADING, data: false });
        const userLists = admin.userList;
        userLists[index] = result.data.data;
        dispatch({ type: SET_ADMIN_MODERATION_USER_LIST, data: Object.assign([], userLists) });
        dispatch({ type: SUCCESS_UNLINKING_USER, data: true });
        dispatch({ type: USER_INFO_SAVE_ERROR, data: { error: [], save: true } });
      }, loaderDelay);
    } else if (result.data && result.data.error) {
      dispatch({ type: USER_INFO_SAVE_LOADING, data: false });
      dispatch({ type: SUCCESS_UNLINKING_USER, data: false });
      dispatch({ type: USER_INFO_SAVE_ERROR, data: { error: Object.assign([], result.data.error), save: true } });
    }
  };
}

export function UNLINK_EXISTING_USER(rdsId) {
  return async (dispatch, getState) => {
    const { admin } = getState();
    dispatch({ type: USER_INFO_SAVE_ERROR, data: { error: [], save: false } });
    dispatch({ type: UNLINK_EXISTING_USER_LOADING, data: true });
    const result = await unlinkingExistingUser(rdsId);
    dispatch({ type: UNLINK_EXISTING_USER_LOADING, data: false });
    if (resultOK(result)) {
      admin.userList.map((data) => {
        const dataVal = data;
        if (dataVal.rds_id === rdsId) {
          dataVal.rds_id = '';
          dataVal.salesforce_id = '';
          dataVal.linked = false;
        }
      });
      dispatch({ type: SET_ADMIN_MODERATION_USER_LIST, data: Object.assign([], admin.userList) });
      dispatch({ type: SUCCESS_UNLINKING_USER, data: true });
    } else {
      dispatch({ type: SUCCESS_UNLINKING_USER, data: false });
    }
  };
}

export function GET_CLIENT_LOOKUP_DATA(data) {
  return async (dispatch) => {
    dispatch({ type: USER_INFO_SAVE_ERROR, data: { error: [], save: false } });
    dispatch({ type: SET_CLIENTLOOKUP_DATA_LOADING, data: true });
    dispatch({ type: SET_CLIENT_LOOK_UP_DATA, data: [] });
    const result = await getClientLookUpData(data);
    dispatch({ type: SET_CLIENTLOOKUP_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SUCCESS_UNLINKING_USER, data: false });
        dispatch({ type: SET_CLIENT_LOOK_UP_DATA, data: Object.assign([], result.data.bmo_response.Data) });
      } else {
        dispatch({ type: SET_CLIENT_LOOK_UP_DATA, data: [] });
      }
    }
  };
}

export function UPDATE_USER_STATUS(data) {
  return async (dispatch) => {
    const result = await updateStatus(data);
    if (resultOK(result)) {
      dispatch({ type: USER_STATUS_UPDATE_ERROR_MESSAGE, data: '' });
    } else if (result.data && result.data.status === 404) {
      dispatch({ type: USER_STATUS_UPDATE_ERROR_MESSAGE, data: result.data.message });
    }
  };
}

export function GET_USER_COUNT_ADVANCE_FILTER(data) {
  return async (dispatch) => {
    dispatch({ type: USER_COUNT_LOADING, data: true });
    const result = await getUserCount(data);
    dispatch({ type: USER_COUNT_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_USER_COUNT_ADVANCE_FILTER, data: result.data.count });
      }
    }
  };
}

export function GET_RESULTS_ON_SEARCH(data) {
  return async (dispatch) => {
    const result = await searchResult(data);
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_MODERATION_USER_LIST, data: Object.assign([], result.data.bmo_response.data) });
      }
    }
  };
}

export function SORT_CALENDAR_REQUESTS_COLUMN(data) {
  return async (dispatch) => {
    const result = await sortCalendarEventsApi(data);
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_CALENDAR_REQUESTS_LISTS, data: Object.assign([], result.data.users) });
      }
    }
  };
}

export function GET_ADMIN_CALENDAR_REQUESTS() {
  return async (dispatch) => {
    const result = await getCalendarRequests();
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_CALENDAR_REQUESTS_LISTS, data: Object.assign([], result.data.data) });
        dispatch({ type: SET_ADMIN_REQUEST_STATUS_DROPDOWNLIST, data: Object.assign([], result.data.statuses) });
      }
    }
  };
}

export function GET_ADMIN_CALENDAR_EVENTS(defaultDates) {
  return async (dispatch) => {
    const dates = {
      event_date__gte: defaultDates.from,
      event_date__lte: defaultDates.to,
    };
    dispatch({ type: SET_SF_DATA_LOADING, data: true });
    const result = await getCalendarEvents(dates);
    dispatch({ type: SET_SF_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_SF_CALENDAR_EVENTS, data: Object.assign([], result.data.data.events) });
        dispatch({ type: SET_ADMIN_SF_EVENT_TYPE_DROPDOWNLIST, data: Object.assign([], result.data.data.type) });
        dispatch({ type: SET_ADMIN_SF_EVENT_LOCATION_DROPDOWNLIST, data: Object.assign([], result.data.data.location) });
        dispatch({ type: SET_ADMIN_SF_EVENT_FROM_TO, data: { from: defaultDates.from, to: defaultDates.to } });
      }
    }
  };
}

export function GET_ADMIN_PUBLISHED_CALENDAR_EVENTS() {
  return async (dispatch) => {
    dispatch({ type: SET_CMS_DATA_LOADING, data: true });
    const result = await getPublishedCalendarEvents();
    dispatch({ type: SET_CMS_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_PUBLISHED_CALENDAR_EVENTS, data: Object.assign([], result.data.data.events) });
        dispatch({ type: SET_ADMIN_SF_EVENT_TYPE_DROPDOWNLIST, data: Object.assign([], result.data.data.type) });
        dispatch({ type: SET_ADMIN_SF_EVENT_LOCATION_DROPDOWNLIST, data: Object.assign([], result.data.data.location) });
        dispatch({ type: SET_ADMIN_CMS_EVENT_FROM_TO, data: { from: result.data.data.from, to: result.data.data.to } });
      }
    }
  };
}

export function PUT_CMS_FILTER_CALL(data) {
  return async (dispatch) => {
    dispatch({ type: SET_CMS_DATA_LOADING, data: true });
    const result = await putCMSFilterCall(data);
    dispatch({ type: SET_CMS_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_PUBLISHED_CALENDAR_EVENTS, data: Object.assign([], result.data.data.events) });
        dispatch({ type: SET_ADMIN_CMS_EVENT_FROM_TO, data: { from: data.event_date__gte, to: data.event_date__lte } });
      }
    }
  };
}

export function PUT_SF_FILTER_CALL(data) {
  return async (dispatch) => {
    dispatch({ type: SET_SF_DATA_LOADING, data: true });
    const result = await putSFFilterCall(data);
    dispatch({ type: SET_SF_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ADMIN_SF_CALENDAR_EVENTS, data: Object.assign([], result.data.data.events) });
        dispatch({ type: SET_ADMIN_SF_EVENT_FROM_TO, data: { from: data.event_date__gte, to: data.event_date__lte } });
      }
    }
  };
}

export function GET_DEFAULT_SEARCH_RESULT_DATA() {
  return async (dispatch) => {
    const result = await getDefaultSearchResult();
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_DEFAULT_SEARCH_RESULTS, data: Object.assign([], result.data.data) });
      }
    }
  };
}

export function SET_DEFAULT_SEARCH_RESULT_DATA(data) {
  return async (dispatch) => {
    dispatch({ type: SET_DEFAULT_SEARCH_RESULTS_SAVING, data: true });
    const result = await setDefaultSearchResult(data);
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_DEFAULT_SEARCH_RESULTS, data: Object.assign([], result.data.data) });
        dispatch({ type: SET_DEFAULT_SEARCH_RESULTS_SAVING, data: false });
      }
    }
  };
}

export function GET_SALESFORCE_USER_DATA(rdsId, sfId) {
  return async (dispatch) => {
    dispatch({ type: SET_SALESFORCE_USER_DATA_LOADING, data: true });
    const result = await getUserSFData(rdsId, sfId);
    dispatch({ type: SET_SALESFORCE_USER_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data && result.data.bmo_response) {
        dispatch({ type: USER_SALEFORCE_DATA, data: Object.assign([], result.data.bmo_response.Data) });
      } else {
        dispatch({ type: USER_SALEFORCE_DATA, data: [] });
      }
    } else {
      dispatch({ type: USER_SALEFORCE_DATA, data: [] });
    }
  };
}

export function UPDATE_USER_DATA(data) {
  return async (dispatch) => {
    dispatch({ type: SET_USER_INFO_UPDATE_LOADING, data: true });
    dispatch({ type: SET_USER_UPDATE_RESPONSE_MESSAGE, data: { message: '', success: true } });
    const result = await updateUserData(data);
    dispatch({ type: SET_USER_INFO_UPDATE_LOADING, data: false });
    if (resultOK(result)) {
      dispatch({ type: SET_USER_UPDATE_RESPONSE_MESSAGE, data: { message: result.data.message || '', success: true } });
    } else {
      dispatch({ type: SET_USER_UPDATE_RESPONSE_MESSAGE, data: { message: result.data.message || '', success: false } });
    }
  };
}

export function LINKING_TO_SALESFORCE(data) {
  return async (dispatch) => {
    dispatch({ type: SET_USER_INFO_UPDATE_LOADING, data: true });
    dispatch({ type: SET_USER_UPDATE_RESPONSE_MESSAGE, data: { message: '', success: true } });
    const result = await linkCmsToSalesforce(data);
    dispatch({ type: SET_USER_INFO_UPDATE_LOADING, data: false });
    if (resultOK(result)) {
      dispatch({ type: SET_USER_UPDATE_RESPONSE_MESSAGE, data: { message: result.data.message || '', success: true } });
    } else if (result && result.data) {
      dispatch({ type: SET_USER_UPDATE_RESPONSE_MESSAGE, data: { message: result.data.message, success: false } });
    } else {
      dispatch({ type: SET_USER_UPDATE_RESPONSE_MESSAGE, data: { message: 'Oops! Something went wrong.', success: false } });
    }
  };
}
