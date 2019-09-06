import { initialState } from './selectors';

import {
  SET_ADMIN_MODERATION_STATUS_DROPDWON_LIST,
  SET_ADMIN_MODERATION_USER_LIST,
  SET_ADMIN_CALENDAR_REQUESTS_LISTS,
  SET_ADMIN_REQUEST_STATUS_DROPDOWNLIST,
  SET_ADMIN_EVENT_LOCATION_DROPDOWNLIST,
  SET_DEFAULT_SEARCH_RESULTS,
  SET_ADMIN_SF_CALENDAR_EVENTS,
  SET_ADMIN_SF_EVENT_TYPE_DROPDOWNLIST,
  SET_ADMIN_SF_EVENT_LOCATION_DROPDOWNLIST,
  SET_ADMIN_PUBLISHED_CALENDAR_EVENTS,
  SET_CLIENT_LOOK_UP_DATA,
  SET_SF_DATA_LOADING,
  SET_CMS_DATA_LOADING,
  SET_ADMIN_SF_EVENT_FROM_TO,
  SET_ADMIN_CMS_EVENT_FROM_TO,
  SET_DEFAULT_SEARCH_RESULTS_SAVING,
  USER_SALEFORCE_DATA,
  SET_CLIENTLOOKUP_DATA_LOADING,
  SET_SALESFORCE_USER_DATA_LOADING,
  SET_USER_INFO_UPDATE_LOADING,
  SET_USER_UPDATE_RESPONSE_MESSAGE,
  SET_ADMIN_MODERATION_NOTIFICATION_COUNT,
  USER_COUNT_LOADING,
  SET_USER_COUNT_ADVANCE_FILTER,
  SET_OR_CLEAR_ADVANCE_FILTER,
  ADMIN_PAGE_LOADER,
  USER_STATUS_UPDATE_ERROR_MESSAGE,
  SET_ADMIN_MODERATION_REGION,
  USER_INFO_SAVE_ERROR,
  SUCCESS_UNLINKING_USER,
  USER_INFO_SAVE_LOADING,
  UNLINK_EXISTING_USER_LOADING,
  TOTAL_USER_COUNT,
  SET_PENDING_USER_COUNT,
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS_UNLINKING_USER:
      return {
        ...state,
        unlinkingSuccessful: action.data
      };
    case SET_PENDING_USER_COUNT:
      return {
        ...state,
        pendingUserCount: action.data
      };
    case TOTAL_USER_COUNT:
      return {
        ...state,
        userTotal: action.data
      };
    case UNLINK_EXISTING_USER_LOADING:
      return {
        ...state,
        unlinkUserLoad: action.data
      };
    case USER_INFO_SAVE_LOADING:
      return {
        ...state,
        saveLoading: action.data
      };
    case SET_USER_INFO_UPDATE_LOADING:
      return {
        ...state,
        isUserInfoUpdateLoading: action.data
      };
    case SET_ADMIN_MODERATION_REGION:
      return {
        ...state,
        regionList: action.data
      };
    case USER_STATUS_UPDATE_ERROR_MESSAGE:
      return {
        ...state,
        userStatusErrorMsg: action.data
      };
    case USER_INFO_SAVE_ERROR:
      return {
        ...state,
        userUpdateError: action.data.error,
        closeModalCheck: action.data
      };
    case ADMIN_PAGE_LOADER:
      return {
        ...state,
        isAdminPageLoading: action.data
      };
    case SET_OR_CLEAR_ADVANCE_FILTER:
      return {
        ...state,
        advanceFilterStatus: action.data
      };
    case USER_COUNT_LOADING:
      return {
        ...state,
        iscountLoading: action.data
      };
    case SET_USER_COUNT_ADVANCE_FILTER:
      return {
        ...state,
        userCount: action.data
      };

    case SET_USER_UPDATE_RESPONSE_MESSAGE:
      return {
        ...state,
        userUpdateMessage: action.data.message,
        isSuccessMsg: action.data.success,
      };
    case SET_ADMIN_MODERATION_STATUS_DROPDWON_LIST:
      return {
        ...state,
        statusLists: action.data,
      };
    case SET_ADMIN_MODERATION_USER_LIST:
      return {
        ...state,
        userList: action.data
      };
    case SET_ADMIN_MODERATION_NOTIFICATION_COUNT:
      return {
        ...state,
        userNotificationCount: action.data
      };
    case SET_ADMIN_CALENDAR_REQUESTS_LISTS:
      return {
        ...state,
        calendarRequets: action.data
      };
    case SET_ADMIN_REQUEST_STATUS_DROPDOWNLIST:
      return {
        ...state,
        requestStatusList: action.data
      };
    case SET_ADMIN_EVENT_LOCATION_DROPDOWNLIST:
      return {
        ...state,
        eventLocation: action.data
      };
    case SET_DEFAULT_SEARCH_RESULTS:
      return {
        ...state,
        defaultSearch: action.data
      };
    case SET_ADMIN_SF_CALENDAR_EVENTS:
      return {
        ...state,
        sfAdminEvents: action.data
      };
    case SET_ADMIN_SF_EVENT_TYPE_DROPDOWNLIST:
      return {
        ...state,
        sfEventDropdown: action.data
      };
    case SET_ADMIN_SF_EVENT_LOCATION_DROPDOWNLIST:
      return {
        ...state,
        sfLocationDrop: action.data
      };
    case SET_ADMIN_PUBLISHED_CALENDAR_EVENTS:
      return {
        ...state,
        publishedAdminEvents: action.data
      };
    case SET_CLIENT_LOOK_UP_DATA:
      return {
        ...state,
        clientLookUpdata: action.data
      };
    case SET_SF_DATA_LOADING:
      return {
        ...state,
        sfdataIsLoading: action.data
      };
    case SET_CMS_DATA_LOADING:
      return {
        ...state,
        cmsdataIsLoading: action.data
      };
    case SET_ADMIN_SF_EVENT_FROM_TO:
      return {
        ...state,
        sfFromDate: action.data.from,
        sfToDate: action.data.to
      };
    case SET_ADMIN_CMS_EVENT_FROM_TO:
      return {
        ...state,
        cmsFromDate: action.data.from,
        cmsToDate: action.data.to
      };
    case SET_DEFAULT_SEARCH_RESULTS_SAVING:
      return {
        ...state,
        savingChanges: action.data,
      };
    case USER_SALEFORCE_DATA:
      return {
        ...state,
        userSFData: action.data,
      };
    case SET_CLIENTLOOKUP_DATA_LOADING:
      return {
        ...state,
        isClientLookupLoading: action.data,
      };
    case SET_SALESFORCE_USER_DATA_LOADING:
      return {
        ...state,
        isSFDataLoading: action.data,
      };
    default:
      return state;
  }
};
