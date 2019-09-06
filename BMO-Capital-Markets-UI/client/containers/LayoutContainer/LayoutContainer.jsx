import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Steps } from 'intro.js-react';
import { appsettingsVariable } from 'constants/UnchainedVariable';

import { Container } from 'unchained-ui-react';
import { pushToPageDataLayer } from 'analytics';
import pageGTMVariables from 'analytics/page';
import { getParameterByName, libraryURLPush } from 'utils';
import { StaticContentContainer } from 'containers';

import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { getLocalToken, setLocalToken } from 'api/auth';

import { replace } from 'lodash';

import {
  userSelector,
  librarySelector,
  researchSelector,
  departmentSelector
} from 'store/selectors';
import {
  USER_AUTH_VERIFY_LOGIN,
  GET_USER_NOTIFICATION
} from 'store/actions';

import introductionConfig from './intro.config';
import './LayoutContainer.scss';
import './intro.js-react.scss';

class LayoutContainer extends Component {
  props: {
    children: {},
    location: '',
    history: {},
    isLoggedIn: Boolean,
    profile: {
      uuid: ''
    },
    verifyLogin: () => void,
    getNotifications: () => void,
    userType: '',
    showWelcomeScreen: boolean,
    showOnboardScreen: boolean,
    libraryResults: [],
    researchLayoutData: {},
    ourCoverageData: [],
    ourAnalystsData: [],
  };

  constructor(props) {
    super(props);
    const { history, verifyLogin } = props;
    this.targetElement = null;
    // Check if token and relayState is present, if yes then set the token and remove it from URL.
    let token = getParameterByName('token');
    const relayState = getParameterByName('relayState');
    const clientID = getParameterByName('client_id');
    const clientSource = getParameterByName('client_source');

    // This transaction ID is specific to Bloomberg Linkback.
    // If transaction ID is present then it will take precedence over client_id
    const transactionID = getParameterByName('transactionID');

    if ((transactionID || clientID) && clientSource) {
      token = `${token}***${transactionID || clientID}***${clientSource}`;
    }

    // Check if token and relayState paramter is sent as user registration flow also loads the URL with token.
    // if only token is sent, then do not remove the token.
    if (token && relayState) {
      // If relayState parameter is present, then redirect to the URL present in relayState
      setLocalToken(token, 365);
      libraryURLPush(window.location.search.replace('?', ''), 'token,relayState');
      // Decode base64 encoded URL string.
      const decodedURL = window.atob(relayState);
      const relayRoute = replace(decodedURL, window.location.origin, '');
      history.push(relayRoute);
    }
    history.listen((location) => {
      window.pageGlobalParams = null;
      this.handleHistoryChange(location);
      verifyLogin();
    });
    this.state = {
      introConfig: {},
      showIntroConfig: false,
      currentPath: location.pathname,
      styles: {},
      className: null,
      isNotificationTimerSet: false
    };
  }

  componentDidMount() {
    this.targetElement = document.querySelector('#app');
    this.handleHistoryChange();
    window.scrollTo(0, 0);
    this.setIntroConfig();
  }

  setNotificationTimer = (isLoggedIn) => {
    const { isNotificationTimerSet } = this.state;
    if (isLoggedIn) {
      if (!isNotificationTimerSet) {
        const notificationFrequency = appsettingsVariable.NOTIFICATION_POLLING_FREQUENCY || 1;
        this.props.getNotifications();
        this.pollingTimer = setInterval(() => this.props.getNotifications(), notificationFrequency * 60000);
        this.setState({ isNotificationTimerSet: true });
      }
    } else {
      this.pollingTimer ? clearInterval(this.pollingTimer) : null;
      isNotificationTimerSet ? this.setState({ isNotificationTimerSet: false }) : null;
    }
  }

  componentWillMount() {
    this.setNotificationTimer(this.props.isLoggedIn);
  }

  componentWillUnmount() {
    // 5. Useful if we have called disableBodyScroll for multiple target elements,
    // and we just want a kill-switch to undo all that.
    // OR useful for if the `hideTargetElement()` function got circumvented eg. visitor
    // clicks a link which takes him/her to a different page within the app.
    clearAllBodyScrollLocks();
    this.pollingTimer ? clearInterval(this.pollingTimer) : null;
  }

  showTargetElement = () => {
    // ... some logic to show target element
    // 3. Disable body scroll
    disableBodyScroll(this.targetElement);
  };

  hideTargetElement = () => {
    // ... some logic to hide target element
    // 4. Re-enable body scroll
    enableBodyScroll(this.targetElement);
  }

  shouldShowIntroConfig = (props, showIntroConfig) => {
    const { libraryResults, researchLayoutData, ourCoverageData, ourAnalystsData, isLoggedIn } = props;
    let toggleIntroConfig = showIntroConfig;
    const { pathname } = window.location;

    if (pathname === '/library/') {
      if (!libraryResults || libraryResults.length === 0) {
        toggleIntroConfig = false;
      }
    } else if (pathname.startsWith('/research/')) {
      if (!(researchLayoutData && researchLayoutData._source)) {
        toggleIntroConfig = false;
      }
    } else if (pathname === '/our-department/our-coverage/') {
      if (!(ourCoverageData && ourCoverageData.length)) {
        toggleIntroConfig = false;
      }
    } else if (pathname === '/our-department/our-analysts/') {
      if (!(ourAnalystsData && ourAnalystsData.data && ourAnalystsData.data.length) && isLoggedIn) {
        toggleIntroConfig = false;
      }
    } else if (pathname === '/our-analysts/') {
      if (!(ourAnalystsData && ourAnalystsData.data && ourAnalystsData.data.length) && isLoggedIn) {
        toggleIntroConfig = false;
      }
    }
    return toggleIntroConfig;
  }

  setIntroConfig = (props = this.props) => {
    const { pathname } = window.location;
    const { profile, isLoggedIn, showWelcomeScreen, showOnboardScreen } = props;
    let introConfig = Object.assign({}, (introductionConfig[pathname] || this.state.introConfig));
    if (pathname.startsWith('/research/')) {
      introConfig = Object.assign({}, (introductionConfig['/research/']));
    }
    let showIntroConfig = false;
    let scrollToTop = true;

    if (profile.pages && introConfig && introConfig.apiFlag && profile.pages[introConfig.apiFlag] === false && isLoggedIn && !showWelcomeScreen && !showOnboardScreen) {
      showIntroConfig = true;
      if (window.unchainedSite && window.unchainedSite.page[pathname]) {
        const metaData = window.unchainedSite.page[pathname][0];
        if (metaData && metaData.page_parameters.authentication_required === true) {
          showIntroConfig = profile.can_access_content;
        }
      }
      if (Object.keys(profile.pages).filter(p => profile.pages[p] === true).length > 0) {
        scrollToTop = false;
        introConfig.steps = Object.assign([], introConfig.steps.filter(step => (step.isCommonStep !== true)));
      }
    }
    showIntroConfig = this.shouldShowIntroConfig(props, showIntroConfig);

    this.setState({ currentPath: location.pathname });
    if (showIntroConfig && scrollToTop) {
      window.scrollTo(0, 0);
    }
    window.setTimeout(() => {
      if (showIntroConfig) {
        introConfig.steps = (
          introConfig.steps
            .filter(step => ((window.unchainedSite && window.unchainedSite.sitename === 'Corp' ? (step.hideForDebt !== true) : (step.hideForEquity !== true))))
            .filter(step => {
              if (step.element === '#show-intro-div-centered' || document.querySelector(step.element) !== null) return true;
              return false;
            })
        );
      }
      if (showIntroConfig) {
        this.showTargetElement();
      } else {
        this.hideTargetElement();
      }
      this.setState({ introConfig, showIntroConfig });
    }, 500);
  }

  handleHistoryChange = (location = window.location) => {
    const { pathname } = location;
    if (pathname.indexOf('/research/') === 0) {
      pushToPageDataLayer(pageGTMVariables.research);
    } else if (pageGTMVariables[pathname]) {
      pushToPageDataLayer(pageGTMVariables[pathname]);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { profile, isLoggedIn, userType } = nextProps;

    if ((isLoggedIn !== this.props.isLoggedIn)
      || (profile !== this.props.profile)
    ) {
      let accountType = 'Guest';
      let uuid = '';
      let userStatus = profile.user_status;
      userStatus = userStatus && userStatus.toLowerCase();

      if (profile) {
        if (userStatus === 'approved') {
          accountType = 'Full';
        }
        if (userStatus === 'trial' || userStatus === 'pending_with_access') {
          accountType = 'Trial';
        }
        uuid = (profile.uuid || '');
      }

      let userData = {};

      let token = getLocalToken() || '';
      token = token.split('***');

      const clientID = token.length > 1 ? token[1] : '';
      const clientSource = token.length > 1 ? token[2] : '';

      userType ?
        userData = {
          language: 'en',
          loginState: isLoggedIn ? 'Logged In' : 'Logged Out',
          userId: uuid,
          accountType,
          userType,
          clientID,
          clientSource
        }
        :
        userData = {
          language: 'en',
          loginState: isLoggedIn ? 'Logged In' : 'Logged Out',
          userId: uuid,
          accountType,
          clientID,
          clientSource
        };

      pushToPageDataLayer({
        user: userData
      });
    }
    if (isLoggedIn) {
      this.setIntroConfig(nextProps);
    }
    this.setNotificationTimer(nextProps.isLoggedIn);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      if (getParameterByName('noscroll') !== 'true' && !location.hash) {
        window.scrollTo(0, 0);
      }
    }
  }

  onIntroTourExit = () => {
    this.props.verifyLogin();
    document.body.style.overflow = '';
    this.setState(() => ({ showIntroConfig: false, className: null }));
    this.hideTargetElement();
  }

  onTourStepBeforeChange = (nextStepIndex) => {
    if (nextStepIndex < this.headerSteps.length && this.currentStep > nextStepIndex && this.headerSteps.length > 0) {
      window.scrollTo(0, 0);
    }
  }

  onTourStepChange = (nextStep) => {
    this.currentStep = nextStep;

    const { steps } = this.state.introConfig;

    if (steps[nextStep] && steps[nextStep].enableBodyScroll) {
      document.body.style.overflow = '';
      this.hideTargetElement();
      this.setState({
        className: null
      });
    } else {
      this.showTargetElement();
      // document.body.style.position = 'relative';
      document.body.style.overflow = 'hidden';
      this.setState({
        className: 'intro-started'
      });
    }

    window.setTimeout(() => {
      if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        const evt = document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);
      } else {
        window.dispatchEvent(new Event('resize'));
      }
    }, 700);
  }

  headerSteps = [];

  tourStepOptions = {
    prevLabel: 'Previous',
    nextLabel: 'Next',
    disableInteraction: true
  };

  render() {
    const {
      children,
    } = this.props;

    const { introConfig, showIntroConfig, currentPath, styles, className } = this.state;
    const { steps, initialStep } = introConfig;

    this.headerSteps = steps ? (steps.filter(step => (step.isCommonStep === true)) || []) : [];

    const enableTour = steps && steps.length > 0 && showIntroConfig && (currentPath === window.location.pathname);
    return (
      <div className={className} styles={styles}>
        <Steps
          enabled={enableTour}
          steps={steps}
          initialStep={initialStep}
          onExit={this.onIntroTourExit}
          onBeforeChange={this.onTourStepBeforeChange}
          onChange={this.onTourStepChange}
          options={this.tourStepOptions}
        />
        <Container id="layout-container" fluid className="layout-container">
          {children}
          <StaticContentContainer identifier={(window.unchainedSite && window.unchainedSite.sitename === 'Corp') ? 'CorporateDebt-WelcomePopup' : 'WelcomePopup'} />
          <StaticContentContainer identifier="CookieAcknowledgementPopup" />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  profile: userSelector.getUserProfileInfo(state),
  userType: userSelector.getUserType(state),
  showOnboardScreen: userSelector.getOnboardScreenStatus(state),
  showWelcomeScreen: userSelector.getWelcomePopupStatus(state),
  libraryResults: librarySelector.getResults(state),
  researchLayoutData: researchSelector.getResearchLayoutData(state),
  ourCoverageData: departmentSelector.getSectorData(state),
  ourAnalystsData: departmentSelector.getAnalystsData(state),
});

const mapDispatchToProps = (dispatch) => ({
  verifyLogin: () => {
    dispatch(USER_AUTH_VERIFY_LOGIN());
  },
  getNotifications: () => {
    dispatch(GET_USER_NOTIFICATION());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
