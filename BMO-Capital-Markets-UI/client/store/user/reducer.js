import { initialState } from './selectors';

import {
  USER_AUTH_SIGN_IN_CLICKED,
  USER_AUTH_SIGN_UP_CLICKED,
  USER_AUTH_FORGOT_PASSWORD_CLICKED,
  USER_AUTH_CLOSE_MODAL,
  USER_SET_ERROR_MESSAGE,
  CLEAR_ERROR_MESSAGE,
  CLEAR_USER_AUTH_STORE,
  SET_USER_AUTH_REGISTER_FLAG,
  SET_PASSWORD_RECOVERY_FLAG,
  USER_AUTH_FORGOT_USERNAME_CLICKED,
  USER_AUTH_SET_CREDENTIALS_TRIGGERED,
  USER_AUTH_RESET_PASSWORD_TRIGGERED,
  SET_USER_AUTH_STORE,
  SET_USER_LOGGED_IN,
  SET_ALL_BOOKMARKED_DATA,
  SET_RECENT_SEARCH,
  SHOW_ONBOARD_SCREEN,
  PROFILE_COMPANY_LIST,
  USER_EMAIL_PREFERENCES,
  USER_PROFILE_PREFERENCES,
  SET_POST_FORM_RESULT,
  SET_ERROR_MESSAGE_POPUP_FORM,
  SET_USER_PROFILE_CONSUMPTION_DATA,
  SET_BOOKMARKED_PUBLICATIONS,
  SET_EVENT_BOOKMARKED,
  SET_USER_PREF_SUBMITTING,
  SET_BOOKMARK_PAGE_DATA,
  SET_JUST_LOG_OUT,
  SET_USER_CALENDAR_EVENTS,
  SET_DISCLOSURE_INFO,
  SET_USER_CALENDAR_LOCATION,
  SET_USER_CALENDAR_TYPE,
  SET_USER_EVENT_FROM_TO,
  SET_SUPER_USER,
  SET_DISCLOSURE_LOADING,
  SET_FORM_SUBMIT_FLAG,
  DEFAULT_PROFILE_PROPS,
  SET_USER_LOGGING_OUT,
  SET_USER_ACCOUNT_LOCKED,
  SET_USER_AUTH_VERIFYING,
  USER_CALENDAR_EVENTS_LOADING,
  BOOKMARK_PAGE_LOADING,
  SHOW_SERVER_ERROR_MODAL,
  SET_TRIGGER_BOOKMARK_API,
  SET_UUID_DATA,
  SET_USER_TYPE_DATA,
  CLEAR_WELCOME_POPUP,
  SHOW_REBRANDING_INTRO,
  SHOW_LOGOUT_BUTTON,
  SHOW_LOGIN_MODEL,
  SET_BMOCONTACT_FORM
} from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_AUTH_SIGN_IN_CLICKED:
      return {
        ...state,
        showLoginModal: true,
        showSignUpModal: false,
        showForgotPasswordModal: false,
        showForgotUsernameModal: false,
        showSetCredentialsModal: false,
        showResetPasswordModal: false,
        loginModalTitle: (action.data || '')
      };
    case SET_USER_ACCOUNT_LOCKED:
      return {
        ...state,
        isUserLockedFor24Hr: action.data,
      };
    case SET_BMOCONTACT_FORM:
      return {
        ...state,
        showbmoContactForm: action.data,
      };
    case SHOW_SERVER_ERROR_MODAL:
      return {
        ...state,
        serverError: action.data,
      };
    case SET_JUST_LOG_OUT:
      return {
        ...state,
        justLogOut: action.data
      };
    case BOOKMARK_PAGE_LOADING:
      return {
        ...state,
        bookMarkPageIsLoading: action.data
      };
    case SET_USER_AUTH_VERIFYING:
      return {
        ...state,
        isVerifying: action.data
      };
    case SET_USER_LOGGING_OUT:
      return {
        ...state,
        userLoggingOut: action.data
      };
    case SET_FORM_SUBMIT_FLAG:
      return {
        ...state,
        formSubmitFlag: action.data
      };
    case USER_AUTH_SIGN_UP_CLICKED:
      return {
        ...state,
        showLoginModal: false,
        showSignUpModal: true,
        showForgotPasswordModal: false,
        showForgotUsernameModal: false,
        showSetCredentialsModal: false,
        showResetPasswordModal: false
      };
    case USER_AUTH_FORGOT_PASSWORD_CLICKED:
      return {
        ...state,
        showLoginModal: false,
        showSignUpModal: false,
        showForgotPasswordModal: true,
        showForgotUsernameModal: false,
        showSetCredentialsModal: false,
        showResetPasswordModal: false
      };
    case USER_AUTH_FORGOT_USERNAME_CLICKED:
      return {
        ...state,
        showLoginModal: false,
        showSignUpModal: false,
        showForgotPasswordModal: false,
        showForgotUsernameModal: true,
        showSetCredentialsModal: false,
        showResetPasswordModal: false
      };
    case USER_AUTH_CLOSE_MODAL:
      return {
        ...state,
        showLoginModal: false,
        showSignUpModal: false,
        showForgotPasswordModal: false,
        showForgotUsernameModal: false,
        showSetCredentialsModal: false,
        showResetPasswordModal: false,
        registeredEmail: ''
      };
    case USER_AUTH_SET_CREDENTIALS_TRIGGERED:
      return {
        ...state,
        showLoginModal: false,
        showSignUpModal: false,
        showForgotPasswordModal: false,
        showForgotUsernameModal: false,
        showSetCredentialsModal: true,
        showResetPasswordModal: false,
        registeredEmail: action.data
      };
    case USER_AUTH_RESET_PASSWORD_TRIGGERED:
      return {
        ...state,
        showLoginModal: false,
        showSignUpModal: false,
        showForgotPasswordModal: false,
        showForgotUsernameModal: false,
        showSetCredentialsModal: false,
        showResetPasswordModal: true,
      };
    case USER_SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.errorMessage,
        errorKey: action.errorKey
      };
    case CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: '',
        errorKey: '',
      };
    case SET_ALL_BOOKMARKED_DATA:
      return {
        ...state,
        allBookmarkedData: action.data
      };
    case CLEAR_USER_AUTH_STORE:
      return {
        ...state,
        profile: {
          ...DEFAULT_PROFILE_PROPS
        },
        showWelcomePopup: false,
      };
    case SET_RECENT_SEARCH:
      return {
        ...state,
        resentSearch: action.data,
      };
    case SET_USER_AUTH_REGISTER_FLAG:
      return {
        ...state,
        registrationFlag: action.data
      };
    case SET_PASSWORD_RECOVERY_FLAG:
      return {
        ...state,
        recoveryPasswordFlag: action.data
      };
    case SET_USER_AUTH_STORE:
      return {
        ...state,
        profile: {
          ...action.data,
          uuid: state.uuid ? state.uuid : action.data ? action.data.uuid : '' // eslint-disable-line
        },
        showWelcomePopup: action.data ? action.data.show_welcome_overlay : false,
        accessLimit: action.data && action.data.user_status !== 'Approved' ? ((action.data.publication_count + 1) || 0) : 0,
      };
    case CLEAR_WELCOME_POPUP:
      return {
        ...state,
        showWelcomePopup: false,
      };
    case SHOW_ONBOARD_SCREEN:
      return {
        ...state,
        showOnboardScreen: action.data
      };
    case SET_USER_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.data
      };
    case PROFILE_COMPANY_LIST:
      return {
        ...state,
        profileCompanyList: action.data
      };
    case USER_EMAIL_PREFERENCES:
      return {
        ...state,
        userEmailPreferences: action.data
      };
    case USER_PROFILE_PREFERENCES:
      return {
        ...state,
        userProfilePreferences: action.data
      };
    case SET_POST_FORM_RESULT:
      return {
        ...state,
        contactUsStatus: action.data
      };
    case SET_ERROR_MESSAGE_POPUP_FORM:
      return {
        ...state,
        contactUsErrorMessage: action.data
      };
    case SET_USER_PROFILE_CONSUMPTION_DATA:
      return {
        ...state,
        userProfileConsumption: action.data
      };
    case SET_BOOKMARKED_PUBLICATIONS:
      return {
        ...state,
        bookmarkIds: action.data
      };
    case SET_EVENT_BOOKMARKED:
      return {
        ...state,
        eventsIds: action.data
      };
    case SET_USER_PREF_SUBMITTING:
      return {
        ...state,
        userPrefSubmitting: action.data
      };
    case SET_TRIGGER_BOOKMARK_API:
      return {
        ...state,
        triggerBookmarkApi: action.data
      };
    case SET_BOOKMARK_PAGE_DATA:
      return {
        ...state,
        bookmarkPageData: action.data
      };
    case SET_USER_CALENDAR_EVENTS:
      return {
        ...state,
        userEvents: action.data
      };
    case SET_DISCLOSURE_INFO:
      return {
        ...state,
        disclosureInfo: action.data
      };
    case SET_USER_CALENDAR_LOCATION:
      return {
        ...state,
        calendarLocation: action.data
      };
    case SET_USER_CALENDAR_TYPE:
      return {
        ...state,
        calendarType: action.data
      };
    case SET_USER_EVENT_FROM_TO:
      return {
        ...state,
        eventFromDate: action.data.from,
        eventToDate: action.data.to,
      };
    case SET_SUPER_USER:
      return {
        ...state,
        isSuperuser: action.data
      };
    case SET_DISCLOSURE_LOADING:
      return {
        ...state,
        isDisclosureLoading: action.data
      };
    case USER_CALENDAR_EVENTS_LOADING:
      return {
        ...state,
        isUserCalendarEventsLoading: action.data
      };
    case SET_UUID_DATA:
      return {
        ...state,
        uuid: action.data
      };
    case SET_USER_TYPE_DATA:
      return {
        ...state,
        userType: action.data
      };
    case SHOW_REBRANDING_INTRO:
      return {
        ...state,
        showRebrandingIntro: action.data
      };
    case SHOW_LOGOUT_BUTTON:
      return {
        ...state,
        showLogoutButton: action.data
      };
    case SHOW_LOGIN_MODEL:
      return {
        ...state,
        showLoginModal: action.data
      };
    default:
      return state;
  }
};
