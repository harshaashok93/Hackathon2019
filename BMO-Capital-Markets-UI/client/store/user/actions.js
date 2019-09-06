import {
  resultOK,
} from 'api/utils';
import { push } from 'react-router-redux';
import { pushToDataLayer } from 'analytics';
import {
  registerUserAPI,
  loginUserAPI,
  forgotPasswordAPI,
  userLogout,
  setUserCredentialsAPI,
  verifyloginAPI,
  verifyRegTokenAPI,
  resetPasswordAPI,
  setLocalToken,
  removeLocalToken,
  postContactUs,
  verifyResetPwdTokenAPI,
  getUserEvents,
  postConferenceData,
  getDisclosureInfo,
  putUserCalendarFilter,
  checkInternalRequest,
  getRebrandingBanner
} from 'api/auth';

import {
  getCompanyDropDownList,
  getUserEmailPreferences,
  setUserProfilePreference,
  getUserProfilePreferences,
  removeUserProfilePreference,
  getUserProfileConsumptionData,
  getUserProfileBookmarksData,
  updateUserProfileBookmarksData,
  deleteUserProfileBookmarksData,
  setEmailProfilePreference,
} from 'api/profile';

import {
  getSearchResults
} from 'api/library';

import {
  removeQueryParams
} from 'utils';

import { ssoUrl } from 'config';

import { appsettingsVariable } from 'constants/UnchainedVariable';

import moment from 'moment';

export const DEFAULT_PROFILE_PROPS = {
  temp_user: true,
  can_access_content: false,
};
export const USER_AUTH_SIGN_IN_CLICKED = 'USER_AUTH_SIGN_IN_CLICKED';
export const BOOKMARK_PAGE_LOADING = 'BOOKMARK_PAGE_LOADING';
export const USER_AUTH_SIGN_UP_CLICKED = 'USER_AUTH_SIGN_UP_CLICKED';
export const USER_AUTH_FORGOT_PASSWORD_CLICKED = 'USER_AUTH_FORGOT_PASSWORD_CLICKED';
export const USER_AUTH_CLOSE_MODAL = 'USER_AUTH_CLOSE_MODAL';
export const USER_AUTH_FORGOT_PASSWORD_SUBMIT = 'USER_AUTH_FORGOT_PASSWORD_SUBMIT';
export const USER_SET_ERROR_MESSAGE = 'USER_SET_ERROR_MESSAGE';
export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';
export const CLEAR_USER_AUTH_STORE = 'CLEAR_USER_AUTH_STORE';
export const SET_USER_AUTH_REGISTER_FLAG = 'SET_USER_AUTH_REGISTER_FLAG';
export const SET_PASSWORD_RECOVERY_FLAG = 'SET_PASSWORD_RECOVERY_FLAG';
export const USER_AUTH_FORGOT_USERNAME_CLICKED = 'USER_AUTH_FORGOT_USERNAME_CLICKED';
export const USER_AUTH_SET_CREDENTIALS = 'USER_AUTH_SET_CREDENTIALS';
export const USER_AUTH_SET_CREDENTIALS_TRIGGERED = 'USER_AUTH_SET_CREDENTIALS_TRIGGERED';
export const USER_AUTH_RESET_PASSWORD_TRIGGERED = 'USER_AUTH_SET_PASSWORD_TRIGGERED';
export const SET_USER_AUTH_STORE = 'SET_USER_AUTH_STORE';
export const SET_USER_AUTH_VERIFYING = 'SET_USER_AUTH_VERIFYING';
export const SET_USER_LOGGED_IN = 'SET_USER_LOGGED_IN';
export const SET_RECENT_SEARCH = 'SET_RECENT_SEARCH';
export const SHOW_ONBOARD_SCREEN = 'SHOW_ONBOARD_SCREEN';
export const PROFILE_COMPANY_LIST = 'PROFILE_COMPANY_LIST';
export const USER_PROFILE_PREFERENCES = 'USER_PROFILE_PREFERENCES';
export const SET_POST_FORM_RESULT = 'SET_POST_FORM_RESULT';
export const SET_ERROR_MESSAGE_POPUP_FORM = 'SET_ERROR_MESSAGE_POPUP_FORM';
export const SET_USER_PROFILE_CONSUMPTION_DATA = 'SET_USER_PROFILE_CONSUMPTION_DATA';
export const SET_BOOKMARKED_PUBLICATIONS = 'SET_BOOKMARKED_PUBLICATIONS';
export const SET_EVENT_BOOKMARKED = 'SET_EVENT_BOOKMARKED';
export const USER_EMAIL_PREFERENCES = 'USER_EMAIL_PREFERENCES';
export const SET_USER_PREF_SUBMITTING = 'SET_USER_PREF_SUBMITTING';
export const SET_BOOKMARK_PAGE_DATA = 'SET_BOOKMARK_PAGE_DATA';
export const SET_JUST_LOG_OUT = 'SET_JUST_LOG_OUT';
export const SET_USER_CALENDAR_EVENTS = 'SET_USER_CALENDAR_EVENTS';
export const SET_DISCLOSURE_INFO = 'SET_DISCLOSURE_INFO';
export const SET_USER_CALENDAR_LOCATION = 'SET_USER_CALENDAR_LOCATION';
export const SET_USER_CALENDAR_TYPE = 'SET_USER_CALENDAR_TYPE';
export const SET_USER_EVENT_FROM_TO = 'SET_USER_EVENT_FROM_TO';
export const SET_SUPER_USER = 'SET_SUPER_USER';
export const SET_DISCLOSURE_LOADING = 'SET_DISCLOSURE_LOADING';
export const SET_FORM_SUBMIT_FLAG = 'SET_FORM_SUBMIT_FLAG';
export const SET_USER_LOGGING_OUT = 'SET_USER_LOGGING_OUT';
export const SET_USER_ACCOUNT_LOCKED = 'SET_USER_ACCOUNT_LOCKED';
export const USER_CALENDAR_EVENTS_LOADING = 'USER_CALENDAR_EVENTS_LOADING';
export const SET_ALL_BOOKMARKED_DATA = 'SET_ALL_BOOKMARKED_DATA';
export const SHOW_SERVER_ERROR_MODAL = 'SHOW_SERVER_ERROR_MODAL';
export const SET_TRIGGER_BOOKMARK_API = 'SET_TRIGGER_BOOKMARK_API';
export const SET_UUID_DATA = 'SET_UUID_DATA';
export const SET_USER_TYPE_DATA = 'SET_USER_TYPE_DATA';
export const CLEAR_WELCOME_POPUP = 'CLEAR_WELCOME_POPUP';
export const SHOW_REBRANDING_INTRO = 'SHOW_REBRANDING_INTRO';
export const SHOW_LOGOUT_BUTTON = 'SHOW_LOGOUT_BUTTON';
export const SHOW_LOGIN_MODEL = 'SHOW_LOGIN_MODEL';
export const SET_BMOCONTACT_FORM = 'SET_BMOCONTACT_FORM';

function setBookmarkStore(dispatch, result) {
  if (resultOK(result) && result.data && result.data.data) {
    const { publications, events } = result.data.data;
    const bookmarksData = publications.map(d => d.publication_id);
    const eventsData = events.map(d => d.id);
    dispatch({ type: SET_BOOKMARKED_PUBLICATIONS, data: Object.assign([], bookmarksData) });
    dispatch({ type: SET_ALL_BOOKMARKED_DATA, data: [...publications, ...events] });
    dispatch({ type: SET_EVENT_BOOKMARKED, data: Object.assign([], eventsData) });
    const sortedData = [...publications, ...events];
    dispatch({ type: SET_BOOKMARK_PAGE_DATA, data: Object.assign([], sortedData) });
  }
}

export function USER_AUTH_VERIFY_LOGIN() {
  return async (dispatch) => {
    dispatch({ type: SET_USER_AUTH_VERIFYING, data: true });
    const result = await verifyloginAPI();

    let isInternalRequest = false;

    dispatch({ type: SET_USER_AUTH_VERIFYING, data: false });
    const { data } = result;
    if (!resultOK(result)) {
      removeLocalToken();
      const checkIpResult = await checkInternalRequest();
      isInternalRequest = checkIpResult && checkIpResult.data && checkIpResult.data.is_internal_request;
      const bannerHidden = getRebrandingBanner();
      if (bannerHidden) {
        dispatch({ type: SHOW_REBRANDING_INTRO, data: false });
      } else {
        dispatch({ type: SHOW_REBRANDING_INTRO, data: true });
      }
      dispatch({ type: SET_USER_LOGGED_IN, data: false });
      dispatch({ type: SET_USER_AUTH_STORE, data: null });
      dispatch({ type: SHOW_ONBOARD_SCREEN, data: false });
      if (isInternalRequest) {
        dispatch({ type: SHOW_LOGIN_MODEL, data: false });
        const providerId = appsettingsVariable.SSO_PROVIDER_ID || '';
        const ssoRedirectionUrl = `${ssoUrl}/saml/${providerId}/acs/?RelayState=${window.location.href}&${moment.now()}`;
        window.location.replace(ssoRedirectionUrl);
      }
      return;
    }

    isInternalRequest = data.user.is_internal_request;

    if (isInternalRequest) {
      dispatch({ type: SHOW_LOGOUT_BUTTON, data: false });
    } else {
      dispatch({ type: SHOW_LOGOUT_BUTTON, data: true });
    }

    if (data.user && data.user.branding_triangle_shown !== undefined) {
      dispatch({ type: SHOW_REBRANDING_INTRO, data: !data.user.branding_triangle_shown });
    }
    dispatch({ type: SET_USER_LOGGED_IN, data: true });
    dispatch({ type: SET_SUPER_USER, data: data.user.is_superuser });
    dispatch({ type: SET_USER_AUTH_STORE, data: Object.assign({}, data.user) });
    dispatch({ type: SET_RECENT_SEARCH, data: data.recentSearches });
    if (window.location.href.indexOf('/profile/bookmarks/') < 0) {
      const BookmarkResult = await getUserProfileBookmarksData();
      setBookmarkStore(dispatch, BookmarkResult);
    }
  };
}

export function USER_AUTH_REGISTER(data) {
  return async (dispatch) => {
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: true });
    const result = await registerUserAPI(data);
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: false });
    if (!resultOK(result)) {
      const { data } = result;
      if (data.message && data.message.key === 'SERVER_ERROR') {
        dispatch({ type: SHOW_SERVER_ERROR_MODAL, data: data.message.data || 'Oops! Something went wrong' });
        dispatch({ type: USER_AUTH_CLOSE_MODAL, data: false });
        return;
      }
      dispatch({ type: SET_BMOCONTACT_FORM, data: result.showBMOContactForm });
      dispatch({ type: USER_SET_ERROR_MESSAGE, errorMessage: (result.data && result.data.detail) || 'Failed to register!', errorKey: (result.data && result.data.message && result.data.message.key) || null });
      return;
    }

    if (!(result && result.data && result.data.showBMOContactForm)) {
      dispatch({ type: SET_USER_AUTH_REGISTER_FLAG, data: true });
    }
    dispatch({ type: SET_BMOCONTACT_FORM, data: result.data.showBMOContactForm });
    dispatch({ type: CLEAR_ERROR_MESSAGE });
  };
}

export function RESET_BOOKMARK_CALENDAR_EVENT(eventId) {
  return (dispatch, getState) => {
    const { user } = getState();
    user.bookmarkPageData.map((data) => {
      const dataVal = data;
      if (dataVal.event_date && eventId === dataVal.id) {
        dataVal.user_status = 'Attending';
      }
    });
    dispatch({ type: SET_BOOKMARK_PAGE_DATA, data: Object.assign([], user.bookmarkPageData) });
  };
}

export function USER_AUTH_LOGIN(d) {
  return async (dispatch) => {
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: true });
    const result = await loginUserAPI(d);
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: false });
    const { data } = result;
    if (data.detail === 'Your account has been locked for security reasons, please try after some time.') {
      dispatch({ type: SET_USER_ACCOUNT_LOCKED, data: true });
      dispatch({ type: USER_AUTH_CLOSE_MODAL, data: false });
      return;
    }
    if (!resultOK(result)) {
      removeLocalToken();
      dispatch({ type: USER_SET_ERROR_MESSAGE, errorMessage: (data && data.detail) || 'Unable to login with provided credentials.' });
      dispatch({ type: SET_USER_LOGGED_IN, data: false });
      if (data.message && data.message.key === 'SERVER_ERROR') {
        dispatch({ type: USER_AUTH_CLOSE_MODAL, data: false });
        dispatch({ type: SHOW_SERVER_ERROR_MODAL, data: data.message.data });
        return;
      }
      return;
    }
    if (!data) return;
    setLocalToken(data.token, 365);
    dispatch({ type: SET_JUST_LOG_OUT, data: false });
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: SET_USER_LOGGED_IN, data: true });
    if (data.user) {
      if (data.user.branding_triangle_shown !== undefined) {
        dispatch({ type: SHOW_REBRANDING_INTRO, data: !data.user.branding_triangle_shown });
      }
      dispatch({ type: SHOW_SERVER_ERROR_MODAL, data: '' });
      dispatch({ type: SET_USER_ACCOUNT_LOCKED, data: false });
      dispatch({ type: SET_USER_ACCOUNT_LOCKED, data: false });
      dispatch({ type: SET_USER_AUTH_STORE, data: Object.assign({}, data.user) });
      pushToDataLayer('authentication', 'loginSubmitBtnClick', { label: data.user.uuid });
      dispatch({ type: USER_AUTH_CLOSE_MODAL });
      dispatch({ type: SHOW_ONBOARD_SCREEN, data: (data.user.first_login && !data.user.show_welcome_overlay) });
      dispatch({ type: SET_SUPER_USER, data: data.user.is_superuser });
    }
    const BookmarkResult = await getUserProfileBookmarksData();
    setBookmarkStore(dispatch, BookmarkResult);
  };
}

export function GET_BOOKMARKS_DATA() {
  return async (dispatch) => {
    const BookmarkResult = await getUserProfileBookmarksData();
    setBookmarkStore(dispatch, BookmarkResult);
    if (resultOK(BookmarkResult)) {
      dispatch({ type: SET_TRIGGER_BOOKMARK_API, data: false });
    }
  };
}

export function USER_AUTH_LOGOUT(setJustLogout = true) {
  return async (dispatch) => {
    dispatch({ type: SET_USER_LOGGING_OUT, data: true });
    const result = await userLogout();
    dispatch({ type: SET_USER_LOGGING_OUT, data: false });
    if (!resultOK(result) && result.status !== 401) return;
    removeLocalToken();
    dispatch({ type: SET_USER_TYPE_DATA, data: null });
    dispatch({ type: SET_UUID_DATA, data: null });
    dispatch({ type: SET_USER_LOGGED_IN, data: false });
    dispatch({ type: CLEAR_USER_AUTH_STORE });
    dispatch({ type: SET_BOOKMARKED_PUBLICATIONS, data: [] });
    dispatch({ type: SET_EVENT_BOOKMARKED, data: [] });
    dispatch({ type: SET_JUST_LOG_OUT, data: setJustLogout });
    dispatch({ type: SET_RECENT_SEARCH, data: [] });
    const bannerHidden = getRebrandingBanner();
    if (bannerHidden) {
      dispatch({ type: SHOW_REBRANDING_INTRO, data: false });
    } else {
      dispatch({ type: SHOW_REBRANDING_INTRO, data: true });
    }
  };
}

export function USER_AUTH_SET_CREDENTIALS_DATA(data, token) {
  return async (dispatch) => {
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: true });
    const result = await setUserCredentialsAPI(data, token);
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: false });
    const loginData = {
      username: data.username,
      password: data.password,
    };
    if (!resultOK(result)) {
      dispatch({ type: USER_SET_ERROR_MESSAGE, errorMessage: result.data ? (result.data.detail || result.data.message) : 'Failed to set your credentials!' });
      return;
    }
    removeQueryParams();

    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_CLOSE_MODAL });

    dispatch(USER_AUTH_LOGIN(loginData)); // autologin the user
  };
}

export function USER_AUTH_RESET_PASSWORD_DATA(data, token1, token2) {
  return async (dispatch) => {
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: true });
    const result = await resetPasswordAPI(data, token1, token2);
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: false });
    if (!resultOK(result)) {
      dispatch({ type: USER_SET_ERROR_MESSAGE, errorMessage: result.data ? (result.data.detail || result.data.message) : 'Failed to reset your password!' });
      return;
    }
    const userData = result.data;
    removeQueryParams();
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_CLOSE_MODAL });
    // Making sure user does not logout even after changing the password.
    setLocalToken(userData.token, 365);
    dispatch({ type: SET_USER_LOGGED_IN, data: true });
    dispatch({ type: SET_SUPER_USER, data: userData.user.is_superuser });
    dispatch({ type: SET_USER_AUTH_STORE, data: Object.assign({}, userData.user) });
    dispatch({ type: SET_RECENT_SEARCH, data: userData.recentSearches });
    if (token1 && token2) {
      // dispatch(USER_AUTH_LOGOUT());
      // dispatch({ type: USER_AUTH_SIGN_IN_CLICKED });
      dispatch(USER_AUTH_VERIFY_LOGIN);
    }
  };
}

export function USER_AUTH_VERIFY_REG_TOKEN(token) {
  return async (dispatch) => {
    const result = await verifyRegTokenAPI(token);

    if (resultOK(result)) {
      if (result.data.email) {
        dispatch({ type: USER_AUTH_SET_CREDENTIALS_TRIGGERED, data: result.data.email });
      }
    }
  };
}

export function USER_AUTH_VERIFY_RESET_PWD_TOKEN(token1, token2) {
  return async (dispatch) => {
    const result = await verifyResetPwdTokenAPI(token1, token2);
    if (resultOK(result)) {
      dispatch({ type: USER_AUTH_RESET_PASSWORD_TRIGGERED });
    }
  };
}

export function USER_FORGOT_PASSWORD_SUBMIT(d) {
  return async (dispatch) => {
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: true });
    const result = await forgotPasswordAPI(d);
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: false });
    const { data } = result;

    if (!resultOK(result)) {
      dispatch({ type: USER_SET_ERROR_MESSAGE, errorMessage: (data && (data.message || data.detail)) || 'Oops! Something went wrong.' });
      return;
    }
    dispatch({ type: SET_PASSWORD_RECOVERY_FLAG, data: true });
  };
}

export function GET_PROFILE_COMPANY_LIST() {
  return async (dispatch) => {
    const result = await getCompanyDropDownList();
    if (!resultOK(result)) {
      return;
    }
    dispatch({ type: PROFILE_COMPANY_LIST, data: Object.assign({}, result.data.data) });
  };
}

export function GET_DISCLOSURE_INFO(id) {
  return async (dispatch) => {
    dispatch({ type: SET_DISCLOSURE_LOADING, data: true });
    const result = await getDisclosureInfo(id);
    dispatch({ type: SET_DISCLOSURE_LOADING, data: false });
    if (!resultOK(result)) {
      return;
    }
    dispatch({ type: SET_DISCLOSURE_INFO, data: result.data.data });
  };
}

export function SET_USER_PROFILE_PREFERENCE(d, type = 'post') {
  return async (dispatch) => {
    if (!d) return;
    dispatch({ type: SET_USER_PREF_SUBMITTING, data: true });
    const result = await setUserProfilePreference(d, type);
    dispatch({ type: SET_USER_PREF_SUBMITTING, data: false });
    if (!resultOK(result)) {
      if (result.status === 401) {
        dispatch(USER_AUTH_LOGOUT());
        dispatch(push('/'));
      }
      return; // eslint-disable-line
    }
    dispatch({ type: USER_PROFILE_PREFERENCES, data: Object.assign({}, result.data) });
  };
}

export function SET_EMAIL_PROFILE_PREFERENCES(d) {
  return async (dispatch) => {
    if (!d) return;
    dispatch({ type: SET_USER_PREF_SUBMITTING, data: true });
    const result = await setEmailProfilePreference(d);
    dispatch({ type: SET_USER_PREF_SUBMITTING, data: false });
    if (!resultOK(result)) {
      if (result.status === 401) {
        dispatch(USER_AUTH_LOGOUT());
        dispatch(push('/'));
      }
      return; // eslint-disable-line
    }
    dispatch({ type: USER_EMAIL_PREFERENCES, data: Object.assign({}, result.data) });
  };
}

export function GET_USER_EMAIL_PREFERENCES() {
  return async (dispatch) => {
    const result = await getUserEmailPreferences();
    if (!resultOK(result)) {
      if (result.status === 401) {
        dispatch(USER_AUTH_LOGOUT());
        dispatch(push('/'));
      }
      return;
    }
    dispatch({ type: USER_EMAIL_PREFERENCES, data: Object.assign({}, result.data) });
  };
}

export function GET_USER_PROFILE_PREFERENCES() {
  return async (dispatch) => {
    const result = await getUserProfilePreferences();
    if (!resultOK(result)) {
      if (result.status === 401) {
        dispatch(USER_AUTH_LOGOUT());
        dispatch(push('/'));
      }
      return;
    }
    dispatch({ type: USER_PROFILE_PREFERENCES, data: Object.assign({}, result.data) });
  };
}

export function REMOVE_USER_PROFILE_PREFERENCES(d) {
  return async (dispatch) => {
    if (!d) return;
    const result = await removeUserProfilePreference(d);
    if (!resultOK(result)) {
      if (result.status === 401) {
        dispatch(USER_AUTH_LOGOUT());
        dispatch(push('/'));
      }
      return; // eslint-disable-line
    }
    dispatch({ type: USER_PROFILE_PREFERENCES, data: Object.assign({}, result.data) });
  };
}

export function POST_CONTACT_US_INFORMATION(data) {
  return async (dispatch) => {
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: true });
    const result = await postContactUs(data);
    dispatch({ type: SET_FORM_SUBMIT_FLAG, data: false });
    if (resultOK(result)) {
      dispatch({ type: SET_POST_FORM_RESULT, data: true });
    } else {
      dispatch({ type: SET_POST_FORM_RESULT, data: false });
      dispatch({ type: SET_ERROR_MESSAGE_POPUP_FORM, data: 'Errored Out' });
    }
  };
}
export function GET_PROFILE_CONSUMPTION_DATA() {
  return async (dispatch) => {
    const result = await getUserProfileConsumptionData();
    if (resultOK(result) && result.data) {
      dispatch({ type: SET_USER_PROFILE_CONSUMPTION_DATA, data: Object.assign({}, result.data) });
    }
  };
}

export function GET_PROFILE_CONSUMPTION_REPORT() {
  return async (dispatch) => {
    const result = await getUserProfileConsumptionReportFile();
    if (resultOK(result) && result.data) {
      dispatch({ type: SET_USER_PROFILE_CONSUMPTION_DATA, data: Object.assign({}, result.data) });
    }
  };
}

export function UPDATE_PROFILE_BOOKMARKS_DATA(type, data, allBookmarks) {
  return async (dispatch) => {
    if (type === 'events') {
      allBookmarks.push(data.eventID);
      dispatch({ type: SET_EVENT_BOOKMARKED, data: Object.assign([], allBookmarks) });
    } else if (type === 'publication') {
      allBookmarks.push(data.id);
      dispatch({ type: SET_BOOKMARKED_PUBLICATIONS, data: Object.assign([], allBookmarks) });
    }
    const result = await updateUserProfileBookmarksData(data);
    if (resultOK(result) && result.data && result.data.data) {
      const { publications, events } = result.data.data;
      dispatch({ type: SET_ALL_BOOKMARKED_DATA, data: [...publications, ...events] });
    } else if (type === 'events') {
      allBookmarks.pop(data.eventID);
      dispatch({ type: SET_EVENT_BOOKMARKED, data: Object.assign([], allBookmarks) });
    } else if (type === 'publication') {
      allBookmarks.pop(data.id);
      dispatch({ type: SET_BOOKMARKED_PUBLICATIONS, data: Object.assign([], allBookmarks) });
    }
  };
}

export function REMOVE_PROFILE_BOOKMARKS_DATA(type, data, allBookmarks) {
  return async (dispatch) => {
    if (type === 'events') {
      dispatch({ type: SET_EVENT_BOOKMARKED, data: Object.assign([], allBookmarks.filter(item => item !== data.eventID)) });
    } else if (type === 'publication') {
      dispatch({ type: SET_BOOKMARKED_PUBLICATIONS, data: Object.assign([], allBookmarks.filter(item => item !== data.id)) });
    }
    const result = await deleteUserProfileBookmarksData(data);
    if (resultOK(result) && result.data && result.data.data) {
      const { publications, events } = result.data.data;
      dispatch({ type: SET_ALL_BOOKMARKED_DATA, data: [...publications, ...events] });
    } else if (type === 'events') {
      allBookmarks.push(data.eventID);
      dispatch({ type: SET_EVENT_BOOKMARKED, data: Object.assign([], allBookmarks) });
    } else if (type === 'publication') {
      allBookmarks.push(data.id);
      dispatch({ type: SET_BOOKMARKED_PUBLICATIONS, data: Object.assign([], allBookmarks) });
    }
  };
}

export function FILTER_BOOKMARKS_PAGE(apiData, data) {
  return async (dispatch) => {
    const dateRange = data.range.range.publisher_date;
    dispatch({ type: BOOKMARK_PAGE_LOADING, data: true });
    const result = await getSearchResults(apiData, data);
    if (resultOK(result)) {
      const eventResult = await getUserProfileBookmarksData({ event_date__gte: dateRange.gte, event_date__lte: dateRange.lte });
      dispatch({ type: BOOKMARK_PAGE_LOADING, data: false });
      if (resultOK(eventResult) && result.data.hits) {
        const publicationData = result.data.hits.hits || [];
        const eventsData = (eventResult.data.data && eventResult.data.data.events) || [];
        const sortedData = [...publicationData, ...eventsData];
        dispatch({ type: SET_BOOKMARK_PAGE_DATA, data: Object.assign([], (sortedData.length !== 0 && sortedData) || []) });
      }
    }
  };
}

export function GET_USER_CALENDAR_EVENTS() {
  return async (dispatch) => {
    dispatch({ type: USER_CALENDAR_EVENTS_LOADING, data: true });
    const result = await getUserEvents();
    dispatch({ type: USER_CALENDAR_EVENTS_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_USER_CALENDAR_EVENTS, data: Object.assign([], result.data.data.events) });
        dispatch({ type: SET_USER_CALENDAR_LOCATION, data: Object.assign([], result.data.data.location) });
        dispatch({ type: SET_USER_CALENDAR_TYPE, data: Object.assign([], result.data.data.type) });
        dispatch({ type: SET_USER_EVENT_FROM_TO, data: { from: result.data.data.from, to: result.data.data.to } });
      }
    }
  };
}

export function PUT_USER_CALENDAR_FILTER(data) {
  return async (dispatch) => {
    dispatch({ type: USER_CALENDAR_EVENTS_LOADING, data: true });
    dispatch({ type: SET_USER_EVENT_FROM_TO, data: { from: data.event_date__gte, to: data.event_date__lte } });
    const result = await putUserCalendarFilter(data);
    dispatch({ type: USER_CALENDAR_EVENTS_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_USER_CALENDAR_EVENTS, data: Object.assign([], result.data.data.events) });
      }
    }
  };
}

export function POST_CONFERENCE_INFORMATION(data) {
  return async (dispatch) => {
    const result = await postConferenceData(data);
    if (resultOK(result)) {
      dispatch({ type: SET_POST_FORM_RESULT, data: true });
      document.body.style.overflow = '';
    } else {
      dispatch({ type: SET_POST_FORM_RESULT, data: false });
      dispatch({ type: SET_ERROR_MESSAGE_POPUP_FORM, data: 'Errored Out' });
    }
  };
}
