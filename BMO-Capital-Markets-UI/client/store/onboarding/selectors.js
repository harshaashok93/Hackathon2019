export const initialState = {
  sectors: [],
  subSectors: [],
  analysts: [],
  screenIndex: 0,
  success: null,
  pageSequence: 0,
  isLoading: false,
};

export const getSectors = (state = initialState) => state.sectors;
export const getSubSectors = (state = initialState) => state.subSectors;
export const getAnalysts = (state = initialState) => state.analysts;
export const getScreenIndex = (state = initialState) => state.screenIndex;
export const getSuccessStatus = (state = initialState) => state.success;
export const getPageSequence = (state = initialState) => state.pageSequence;
export const getIsLoading = (state = initialState) => state.isLoading;
