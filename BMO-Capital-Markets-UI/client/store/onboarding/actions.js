import {
  resultOK,
} from 'api/utils';

import {
  getSectorsData,
  getAnalystsData,
  postOnboardingData
} from 'api/onboarding';

import {
  USER_PROFILE_PREFERENCES
} from 'store/user/actions';

export const SET_ONBOARDING_ALL_SECTORS = 'SET_ONBOARDING_ALL_SECTORS';
export const SET_ONBOARDING_SUB_SECTORS = 'SET_ONBOARDING_SUB_SECTORS';
export const SET_ONBOARDING_ANALYSTS_INFORMATION = 'SET_ONBOARDING_ANALYSTS_INFORMATION';
export const SET_ONBOARDING_SCREEN_INDEX = 'SET_ONBOARDING_SCREEN_INDEX';
export const SET_ONBOARD_SUBMIT_RESPONSE = 'SET_ONBOARD_SUBMIT_RESPONSE';
export const SET_PAGE_SEQUENCE = 'SET_PAGE_SEQUENCE';
export const RESET_ONBOARDING_DATA = 'RESET_ONBOARDING_DATA';
export const SET_ANALYST_DATA_LOADING = 'SET_ANALYST_DATA_LOADING';

export function GET_ONBOARDING_ALL_SECTORS() {
  return async (dispatch) => {
    const result = await getSectorsData({ sectors: [] });
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ONBOARDING_ALL_SECTORS, data: result.data });
      } else {
        dispatch({ type: SET_ONBOARDING_ALL_SECTORS, data: [] });
      }
    } else {
      dispatch({ type: SET_ONBOARDING_ALL_SECTORS, data: [] });
    }
  };
}

export function GET_ANALYSTS_INFORMATION(data) {
  return async (dispatch) => {
    dispatch({ type: SET_ANALYST_DATA_LOADING, data: true });
    const result = await getAnalystsData({ sectors: data.sectors, sub_sectors: data.sub_sectors });
    dispatch({ type: SET_ANALYST_DATA_LOADING, data: false });
    if (resultOK(result)) {
      if (result.data && result.data.length) {
        dispatch({ type: SET_ONBOARDING_ANALYSTS_INFORMATION, data: result.data });
        dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 2 });
        dispatch({ type: SET_PAGE_SEQUENCE, data: 1 });
      } else {
        dispatch({ type: SET_ONBOARDING_ANALYSTS_INFORMATION, data: [] });
        dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 3 });
      }
    }
  };
}

export function GET_ONBOARDING_SUB_SECTORS(data) {
  return async (dispatch) => {
    const result = await getSectorsData({ sectors: data });
    if (resultOK(result)) {
      if (result.data) {
        let isChildrenPresent = false;
        result.data.map((data) => {
          if (data.children.length > 0) {
            isChildrenPresent = true;
            return null;
          }
          return null;
        });
        if (isChildrenPresent) {
          dispatch({ type: SET_ONBOARDING_SUB_SECTORS, data: result.data });
          dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 1 });
        } else {
          const analystsResult = await getAnalystsData({ sectors: data });
          if (resultOK(analystsResult)) {
            if (result.data) {
              let isAnalystsPresent = false;
              if (result.data.length > 0) {
                isAnalystsPresent = true;
              }
              if (isAnalystsPresent) {
                dispatch({ type: SET_ONBOARDING_ANALYSTS_INFORMATION, data: analystsResult.data });
                dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 2 });
              } else {
                dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 3 });
              }
            }
          }
        }
      }
    }
  };
}

export function POST_ONBOARDING_SUBMISSION(data) {
  return async (dispatch) => {
    const result = await postOnboardingData(data);
    if (resultOK(result)) {
      if (result.data) {
        dispatch({ type: SET_ONBOARD_SUBMIT_RESPONSE, data: true });
        dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 4 });
        dispatch({ type: USER_PROFILE_PREFERENCES, data: Object.assign({}, result.data) });
      } else {
        dispatch({ type: SET_ONBOARD_SUBMIT_RESPONSE, data: false });
        dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 4 });
      }
    } else {
      dispatch({ type: SET_ONBOARD_SUBMIT_RESPONSE, data: false });
      dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 4 });
    }
  };
}
