export const initialState = {
  researchLayoutData: {},
  loading: false,
  researchLayoutMetaData: {},
  metaDataLoading: false,
  isPrivateView: false
};

export const getResearchLayoutData = (state = initialState) => state.researchLayoutData;
export const getIsLoading = (state = initialState) => state.loading;
export const getResearchLayoutMetaData = (state = initialState) => state.researchLayoutMetaData;
export const getResearchLayoutMetaDataLoading = (state = initialState) => state.metaDataLoading;
export const isPrivateView = (state = initialState) => state.isPrivateView;
