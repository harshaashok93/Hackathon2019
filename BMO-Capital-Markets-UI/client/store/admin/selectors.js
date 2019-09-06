export const initialState = {
  statusLists: [],
  userList: [],
  calendarRequets: [],
  requestStatusList: [],
  cmsEventType: [],
  eventLocation: [],
  cmsEventLocation: [],
  defaultSearch: [],
  sfAdminEvents: [],
  sfEventDropdown: [],
  sfLocationDrop: [],
  publishedAdminEvents: [],
  clientLookUpdata: [],
  sfdataIsLoading: false,
  cmsdataIsLoading: false,
  sfFromDate: '',
  sfToDate: '',
  cmsFromDate: '',
  cmsToDate: '',
  savingChanges: false,
  userSFData: [],
  isClientLookupLoading: false,
  isSFDataLoading: false,
  isUserInfoUpdateLoading: false,
  userUpdateMessage: '',
  isSuccessMsg: true,
  userNotificationCount: 0,
  iscountLoading: false,
  userCount: 0,
  advanceFilterStatus: 'sameValue',
  isAdminPageLoading: false,
  userStatusErrorMsg: '',
  regionList: [],
  userUpdateError: [],
  unlinkingSuccessful: true,
  saveLoading: false,
  closeModalCheck: { error: [], save: false },
  unlinkUserLoad: false,
  userTotal: 0,
  pendingUserCount: 0,
};

export const getStatusLists = (state = initialState) => state.statusLists;
export const getPendingUserCount = (state = initialState) => state.pendingUserCount;
export const getUserTotal = (state = initialState) => state.userTotal;
export const getUnlinkUserLoad = (state = initialState) => state.unlinkUserLoad;
export const getCloseModalCheck = (state = initialState) => state.closeModalCheck;
export const getSaveLoading = (state = initialState) => state.saveLoading;
export const isUnlinkingSuccessful = (state = initialState) => state.unlinkingSuccessful;
export const getUserUpdateError = (state = initialState) => state.userUpdateError;
export const getRegionList = (state = initialState) => state.regionList;
export const getUserStatusErrorMsg = (state = initialState) => state.userStatusErrorMsg;
export const getIsAdminPageLoading = (state = initialState) => state.isAdminPageLoading;
export const getAdvanceFilterStatus = (state = initialState) => state.advanceFilterStatus;
export const getIscountLoading = (state = initialState) => state.iscountLoading;
export const getUserCount = (state = initialState) => state.userCount;
export const getUserList = (state = initialState) => state.userList;
export const getCalendarRequets = (state = initialState) => state.calendarRequets;
export const getRequestStatusList = (state = initialState) => state.requestStatusList;
export const getCmsEventType = (state = initialState) => state.cmsEventType;
export const getCmsEventLocation = (state = initialState) => state.cmsEventLocation;
export const getEventLocation = (state = initialState) => state.eventLocation;
export const getDefaultSearch = (state = initialState) => state.defaultSearch;
export const getSfAdminEvents = (state = initialState) => state.sfAdminEvents;
export const getSfEventDropdown = (state = initialState) => state.sfEventDropdown;
export const getSfLocationDrop = (state = initialState) => state.sfLocationDrop;
export const getPublishedAdminEvents = (state = initialState) => state.publishedAdminEvents;
export const getClientLookUpdata = (state = initialState) => state.clientLookUpdata;
export const getSfdataIsLoading = (state = initialState) => state.sfdataIsLoading;
export const getCmsdataIsLoading = (state = initialState) => state.cmsdataIsLoading;
export const getSfFromDate = (state = initialState) => state.sfFromDate;
export const getSfToDate = (state = initialState) => state.sfToDate;
export const getCmsFromDate = (state = initialState) => state.cmsFromDate;
export const getCmsToDate = (state = initialState) => state.cmsToDate;
export const getSavingChanges = (state = initialState) => state.savingChanges;
export const getUserSFData = (state = initialState) => state.userSFData;
export const isClientLookupLoading = (state = initialState) => state.isClientLookupLoading;
export const isSFDataLoading = (state = initialState) => state.isSFDataLoading;
export const getIsUserInfoUpdateLoading = (state = initialState) => state.isUserInfoUpdateLoading;
export const getUserUpdateMessage = (state = initialState) => state.userUpdateMessage;
export const getIsSuccessMsg = (state = initialState) => state.isSuccessMsg;
export const getUserNotificationCount = (state = initialState) => state.userNotificationCount;
