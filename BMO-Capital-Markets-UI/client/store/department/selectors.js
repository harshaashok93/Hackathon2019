export const initialState = {
  analystProfileLinks: [],
  getSectorData: [],
  isSectorDataLoading: false,
  selectedSectorId: {},
  getAnalystsData: null,
  isAnalystsDataLoading: false,
  subSectors: [],
  coverageData: null,
  isOverLayLoading: false,
  analystsDetailData: {},
  analystsLoading: false,
  deptSetTicker: null,
  selectedSectorIsSubsector: false,
  coverageDataArrayTotal: 0,
  coverageOverlayCheck: false,
  showCannabis: false,
};

export const setAnalystProfileLinks = (state = initialState) => state.analystProfileLinks;
export const getShowCannabis = (state = initialState) => state.showCannabis;
export const getSectorData = (state = initialState) => state.getSectorData;
export const getCoverageData = (state = initialState) => state.coverageData;
export const isSectorDataLoading = (state = initialState) => state.isSectorDataLoading;
export const isOverLayLoading = (state = initialState) => state.isOverLayLoading;
export const getSelectedSectorId = (state = initialState) => state.selectedSectorId;
export const getAnalystsData = (state = initialState) => state.getAnalystsData;
export const isAnalystsDataLoading = (state = initialState) => state.isAnalystsDataLoading;
export const getExtendedSubSectors = (state = initialState) => state.subSectors;
export const getAnalystsDetailData = (state = initialState) => state.analystsDetailData;
export const getIsAnalystsDetailLoading = (state = initialState) => state.analystsLoading;
export const getDeptSetTicker = (state = initialState) => state.deptSetTicker;
export const getSelectedSectorIsSubsector = (state = initialState) => state.selectedSectorIsSubsector;
export const getCoverageDataArrayTotal = (state = initialState) => state.coverageDataArrayTotal;
export const getCoverageOverlayCheck = (state = initialState) => state.coverageOverlayCheck;
