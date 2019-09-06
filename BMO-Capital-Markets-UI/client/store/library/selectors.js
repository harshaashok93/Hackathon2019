export const initialState = {
  mobileLayout: false,
  resetFilter: true,
  results: null,
  isLoading: false,
  isLibraryLazyLoading: false,
  locationFilters: [],
  rebrandingFilters: [],
  researchFilters: [],
  additionalFilters: [],
  isFromSort: false,
  count: 0,
  gicsType: '',
  corpPublicationData: {},
  isShowMoreOrLess: localStorage.personalizedData ? JSON.parse(localStorage.personalizedData).isShowMoreOrLess : true,
  isIntroductionVisible: true,
  personid: '',
  podcastAuthorList: []
};

export const isMobileLayout = (state = initialState) => state.mobileLayout;
export const resetFilterStatus = (state = initialState) => state.resetFilter;
export const getResults = (state = initialState) => state.results;
export const getIsLoading = (state = initialState) => state.isLoading;
export const getLocationFilters = (state = initialState) => state.locationFilters;
export const getResearchFilters = (state = initialState) => state.researchFilters;
export const getAdditionalFilters = (state = initialState) => state.additionalFilters;
export const getIsLibraryLazyLoading = (state = initialState) => state.isLibraryLazyLoading;
export const getTotalResultsCount = (state = initialState) => state.count;
export const getIsFromSort = (state = initialState) => state.isFromSort;
export const getGicsFilter = (state = initialState) => state.gicsType;
export const getCorpPublicationData = (state = initialState) => state.corpPublicationData;
export const getShowMoreOrLess = (state = initialState) => state.isShowMoreOrLess;
export const getIntroductionVisibilityStatus = (state = initialState) => state.isIntroductionVisible;
export const getRebrandingFilters = (state = initialState) => state.rebrandingFilters;
export const getAuthorFilter = (state = initialState) => state.personid;
export const getPodcastAuthorList = (state = initialState) => state.podcastAuthorList;
