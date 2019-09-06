/* @flow weak */

/*
 * Component: CustomNavLink
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  GET_RESEARCH_LAYOUT_META_DATA,
  USER_AUTH_SIGN_IN_CLICKED,
  CLEAR_ERROR_MESSAGE,
  SET_RESEARCH_LAYOUT_META_DATA,
  USER_AUTH_VERIFY_LOGIN
} from 'store/actions';

import {
  researchSelector,
  userSelector,
} from 'store/selectors';
import { withRouter } from 'react-router';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './CustomNavLink.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CustomNavLink extends Component {
  props: {
    isHistoricalPublication: bool,
    children: {},
    onSignInClick: () => void,
    isAuthenticated: bool,
    researchLayoutData: {},
    getResearchLayoutData: () => void,
    radarLink: '',
    resetResearchLayoutData: () => void,
    onClick: () => void,
    history: {
      push: () => void
    },
    researchType: '',
    rdsPubId: '',
    profile: {},
    verifyLogin: () => void,
  };

  state = {
    researchLayoutData: {},
    idxnextProps: '',
  };

  componentWillMount() {
  }

  componentWillUnMount() {
    this.props.resetResearchLayoutData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.researchLayoutData && Object.keys(nextProps.researchLayoutData)) {
      this.setState({ researchLayoutData: Object.assign({}, nextProps.researchLayoutData) });
    } else {
      this.setState({ researchLayoutData: {} });
    }
  }

  handleOnClick = (e) => {
    const { onClick, resetResearchLayoutData, isAuthenticated } = this.props;
    if (e && !isAuthenticated) e.preventDefault();

    resetResearchLayoutData();

    if (onClick) {
      onClick();
    }
    if (isAuthenticated === false) {
      let overlayMessage = 'Welcome. Please log in or register to view this content.';
      if (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.LOGIN_TO_VIEW_CONTENT_LOGIN_OVERLAY_MESSAGE !== undefined) {
        overlayMessage = window.unchainedSite.AppSettings.LOGIN_TO_VIEW_CONTENT_LOGIN_OVERLAY_MESSAGE;
      }

      this.dispatchLoginAction(overlayMessage);
      if (e) e.preventDefault();
    }
  }

  dispatchLoginAction = (msg) => {
    window.scrollTo(0, 0);
    this.props.onSignInClick(msg);
  }

  getHTMLToRender() {
    const { isHistoricalPublication, children, researchType, rdsPubId, radarLink } = this.props;

    if (isHistoricalPublication) {
      let pid = '';

      try {
        pid = radarLink.split('id=')[1];
      } catch(e) { console.log(e); } // eslint-disable-line

      const isVideoCast = researchType === 'Videocast';

      let toLink = '';
      if (isVideoCast) {
        toLink = `/research/${rdsPubId}`;
      } else {
        toLink = `/pdf/${pid}`;
      }

      return (
        <NavLink
          {...this.props}
          target={isVideoCast ? '' : '_blank'}
          to={toLink}
        >
          {children}
        </NavLink>
      );
    }
    return <NavLink {...this.props}>{children}</NavLink>;
  }

  render() {
    const htmlToRender = this.getHTMLToRender();

    return (
      <span className="custom-nav-link">
        {htmlToRender}
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  researchLayoutData: researchSelector.getResearchLayoutMetaData(state),
  isAuthenticated: userSelector.getIsLoggedIn(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResearchLayoutData: (url = '') => {
    dispatch(GET_RESEARCH_LAYOUT_META_DATA(url));
  },
  onSignInClick: (msg) => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_SIGN_IN_CLICKED, data: msg });
  },
  resetResearchLayoutData: () => {
    dispatch({ type: SET_RESEARCH_LAYOUT_META_DATA, data: {} });
  },
  verifyLogin: () => dispatch(USER_AUTH_VERIFY_LOGIN())

});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomNavLink));
