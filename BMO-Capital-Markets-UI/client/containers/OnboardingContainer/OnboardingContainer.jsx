/* @flow weak */

/*
 * Component: OnboardingContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

import { Onboarding } from 'components';
import { connect } from 'react-redux';

import {
  GET_ONBOARDING_ALL_SECTORS,
  GET_ONBOARDING_SUB_SECTORS,
  SHOW_ONBOARD_SCREEN,
  GET_ANALYSTS_INFORMATION,
  POST_ONBOARDING_SUBMISSION,
  SET_ONBOARDING_SCREEN_INDEX,
  RESET_ONBOARDING_DATA
} from 'store/actions';

import {
  onboardingSelector,
  userSelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './OnboardingContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class OnboardingContainer extends Component {
  props: {
    getSectorData: () => void,
    sectors: [],
    getSubSector: () => void,
    subSectors: [],
    skippingOnboardingScreens: () => void,
    getAnalysts: () => void,
    screenIndex: number,
    analysts: [],
    onSubmit: () => void,
    setIndex: () => void,
    success: bool,
    showOnboardingScreen: bool,
    pageSequence: number,
    isLoading: bool
  }

  componentWillMount() {
    this.props.getSectorData();
  }

  subSectorApiCall = () => (sectorIds) => {
    this.props.getSubSector(sectorIds);
  }

  analystsOnboardingApiCall = () => (analystsId) => {
    this.props.getAnalysts(analystsId);
  }

  submitOnboardingProcess = () => (selection) => {
    this.props.onSubmit(selection);
  }

  setScreenIndexonNext = () => (num) => {
    this.props.setIndex(num);
  }

  render() {
    const {
      analysts,
      sectors,
      screenIndex,
      showOnboardingScreen,
      skippingOnboardingScreens,
      subSectors,
      success,
      pageSequence,
      isLoading
    } = this.props;

    if (showOnboardingScreen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('noscroll');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('noscroll');
    }

    return (
      <div className="onboarding-container" >
        <Onboarding
          showModal={showOnboardingScreen}
          isLoading={isLoading}
          closeOnboardingScreen={() => { skippingOnboardingScreens(); }}
          sectors={sectors}
          subsectors={subSectors}
          getSubSectors={this.subSectorApiCall()}
          screenIndex={screenIndex}
          analysts={analysts}
          getOnboardingAnalysts={this.analystsOnboardingApiCall()}
          postOnboardingSubmission={this.submitOnboardingProcess()}
          success={success}
          setScreenIndex={this.setScreenIndexonNext()}
          pageSequence={pageSequence}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sectors: onboardingSelector.getSectors(state),
  subSectors: onboardingSelector.getSubSectors(state),
  screenIndex: onboardingSelector.getScreenIndex(state),
  analysts: onboardingSelector.getAnalysts(state),
  success: onboardingSelector.getSuccessStatus(state),
  showOnboardingScreen: userSelector.getOnboardScreenStatus(state),
  pageSequence: onboardingSelector.getPageSequence(state),
  isLoading: onboardingSelector.getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getSectorData: () => {
    dispatch(GET_ONBOARDING_ALL_SECTORS());
  },
  getSubSector: (ids) => {
    dispatch(GET_ONBOARDING_SUB_SECTORS(ids));
  },
  skippingOnboardingScreens: () => {
    dispatch({ type: SHOW_ONBOARD_SCREEN, data: false });
    dispatch({ type: RESET_ONBOARDING_DATA });
    dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 0 });
  },
  getAnalysts: (ids) => {
    dispatch(GET_ANALYSTS_INFORMATION(ids));
  },
  onSubmit: (ids) => {
    dispatch(POST_ONBOARDING_SUBMISSION(ids));
  },
  setIndex: (num) => {
    dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: num });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingContainer);
