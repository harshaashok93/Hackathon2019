export const initialState = {
  events: [],
  videocats: [],
  flashes: [],
  flashTotal: 0,
  videocastTotal: 0,
  eventTotal: 0,
  isLoading: false,
};

export const getEvents = (state = initialState) => state.events;
export const getVideocats = (state = initialState) => state.videocats;
export const getFlashes = (state = initialState) => state.flashes;
export const getFlashTotal = (state = initialState) => state.flashTotal;
export const getEventTotal = (state = initialState) => state.eventTotal;
export const getVideocastTotal = (state = initialState) => state.videocastTotal;
export const getIsLoading = (state = initialState) => state.isLoading;
