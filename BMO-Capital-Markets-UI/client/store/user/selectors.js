import {
  DEFAULT_PROFILE_PROPS
} from './actions';

export const initialState = {
  username: '',
  email: '',
  isLoggedIn: null,
  token: '',
  bookMarkPageIsLoading: false,
  showLoginModal: false,
  showSignUpModal: false,
  showForgotPasswordModal: false,
  showForgotUsernameModal: false,
  showSetCredentialsModal: null,
  showResetPasswordModal: null,
  errorMessage: '',
  registrationFlag: false,
  allBookmarkedData: [],
  profile: {
    ...DEFAULT_PROFILE_PROPS
  },
  recoveryPasswordFlag: false,
  oftenSearch: [],
  showOnboardScreen: false,
  profileCompanyList: {},
  userEmailPreferences: {},
  userProfilePreferences: {},
  contactUsStatus: null,
  contactUsErrorMessage: '',
  userProfileConsumption: {},
  bookmarkIds: [],
  eventsIds: [],
  userPrefSubmitting: false,
  bookmarkPageData: [],
  justLogOut: false,
  registeredEmail: '',
  userEvents: [],
  disclosureInfo: '',
  calendarType: [],
  calendarLocation: [],
  eventFromDate: '',
  eventToDate: '',
  isSuperuser: false,
  isDisclosureLoading: false,
  formSubmitFlag: false,
  userLoggingOut: false,
  isUserLockedFor24Hr: false,
  errorKey: '',
  showAccountLockedModal: false,
  isVerifying: false,
  isUserCalendarEventsLoading: false,
  serverError: '',
  triggerBookmarkApi: true,
  loginModalTitle: '',
  accessLimit: null,
  uuid: null,
  userType: null,
  showWelcomePopup: false,
  showRebrandingIntro: false,
  showLogoutButton: true,
  showbmoContactForm: false,
};

export const getEmail = (state = initialState) => state.email;
export const getIsVerifying = (state = initialState) => state.isVerifying;
export const getUsername = (state = initialState) => state.username;
export const getShowAccountLockedModal = (state = initialState) => state.isUserLockedFor24Hr;
export const getErrorKey = (state = initialState) => state.errorKey;
export const getIsLoggedIn = (state = initialState) => state.isLoggedIn;
export const getToken = (state = initialState) => state.token;
export const getShowLoginModal = (state = initialState) => state.showLoginModal;
export const getShowSignUpModal = (state = initialState) => state.showSignUpModal;
export const getShowForgotPasswordModal = (state = initialState) => state.showForgotPasswordModal;
export const getShowSetCredentialsModal = (state = initialState) => state.showSetCredentialsModal;
export const getShowResetPasswordModal = (state = initialState) => state.showResetPasswordModal;
export const getshowForgotUsernameModal = (state = initialState) => state.showForgotUsernameModal;
export const getErrorMessage = (state = initialState) => state.errorMessage;
export const getRegistrationFlag = (state = initialState) => state.registrationFlag;
export const getRecoveryPasswordFlag = (state = initialState) => state.recoveryPasswordFlag;
export const getUserProfileInfo = (state = initialState) => state.profile;
export const getRecentSearch = (state = initialState) => state.resentSearch;
export const getOnboardScreenStatus = (state = initialState) => state.showOnboardScreen;
export const getProfileCompanyList = (state = initialState) => state.profileCompanyList;
export const getUserProfilePreferences = (state = initialState) => state.userProfilePreferences;
export const getcontactUsStatus = (state = initialState) => state.contactUsStatus;
export const getcontactUsErrorMessage = (state = initialState) => state.contactUsErrorMessage;
export const getUserProfileConsumption = (state = initialState) => state.userProfileConsumption;
export const getBookmarkIds = (state = initialState) => state.bookmarkIds;
export const getEventsIds = (state = initialState) => state.eventsIds;
export const getUserEmailPreferences = (state = initialState) => state.userEmailPreferences;
export const getUserPrefSubmittingStatus = (state = initialState) => state.userPrefSubmitting;
export const getBookmarkPageData = (state = initialState) => state.bookmarkPageData;
export const getJustLogOut = (state = initialState) => state.justLogOut;
export const getRegisteredEmail = (state = initialState) => state.registeredEmail;
export const getUserEvents = (state = initialState) => state.userEvents;
export const getDisclosureInfo = (state = initialState) => state.disclosureInfo;
export const getCalendarType = (state = initialState) => state.calendarType;
export const getCalendarLocation = (state = initialState) => state.calendarLocation;
export const getUserEventFromDate = (state = initialState) => state.eventFromDate;
export const getUserEventToDate = (state = initialState) => state.eventToDate;
export const isSuperuser = (state = initialState) => state.isSuperuser;
export const isDisclosureLoading = (state = initialState) => state.isDisclosureLoading;
export const getFormSubmitFlag = (state = initialState) => state.formSubmitFlag;
export const getUserLoggingOutFlag = (state = initialState) => state.userLoggingOut;
export const getBookMarkPageIsLoading = (state = initialState) => state.bookMarkPageIsLoading;
export const getIsUserCalendarEventsLoading = (state = initialState) => state.isUserCalendarEventsLoading;
export const getAllBookmarkedData = (state = initialState) => state.allBookmarkedData;
export const getServerError = (state = initialState) => state.serverError;
export const getTriggerBookmarkApi = (state = initialState) => state.triggerBookmarkApi;
export const getLoginModalTitle = (state = initialState) => state.loginModalTitle;
export const getUserAccessLimit = (state = initialState) => state.accessLimit;
export const getUuid = (state = initialState) => state.uuid;
export const getUserType = (state = initialState) => state.userType;
export const getWelcomePopupStatus = (state = initialState) => state.showWelcomePopup;
export const getShowRebrandingIntroStatus = (state = initialState) => state.showRebrandingIntro;
export const getShowLogoutButton = (state = initialState) => state.showLogoutButton;
export const showBmoContactForm = (state = initialState) => state.showbmoContactForm;
