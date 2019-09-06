/* @flow weak */

/*
 * Component: BlurredImageComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Button } from 'unchained-ui-react';

import {
  userSelector,
} from 'store/selectors';
import {
  USER_AUTH_SIGN_IN_CLICKED,
  CLEAR_ERROR_MESSAGE,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BlurredImageComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BlurredImageComponent extends Component {
  props: {
    onSignInClick: () => void,
    blurryImageUrl: '',
    isAuthenticated: boolean,
    notAuthorizedMsg: '',
    isVerifying: bool
  };

  static defaultProps = {
  };

  state = {
    modalOpen: true
  };

  componentDidMount() {
    // Component ready
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated === false && !nextProps.isVerifying) {
      this.showLogin();
    }
    this.setState({ modalOpen: true });
  }

  showLogin = () => {
    window.scrollTo(0, 0);
    const { onSignInClick } = this.props;
    let overlayMessage = 'Welcome. Please log in or register to view this content.';
    if (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.LOGIN_TO_VIEW_CONTENT_LOGIN_OVERLAY_MESSAGE !== undefined) {
      overlayMessage = window.unchainedSite.AppSettings.LOGIN_TO_VIEW_CONTENT_LOGIN_OVERLAY_MESSAGE;
    }

    if (onSignInClick) onSignInClick(overlayMessage);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.closeModal);
  }
  componentWillMount() {
    if (this.props.isAuthenticated === false && !this.props.isVerifying) {
      this.showLogin();
    }
    document.addEventListener('keydown', this.closeModal);
  }
  closeModal = (e) => {
    if (e.keyCode === 27) {
      this.handleCloseModal();
    }
  }

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  }

  render() {
    const appSettings = (window.unchainedSite && window.unchainedSite.AppSettings);
    const contactMessage = (appSettings.COMMON_CONTACT_MESSAGE) || 'For more information, please contact us.';
    const visibleMessage = (appSettings.PAGE_CONTENT_NOT_VISIBLE) || 'Your trial access has expired.';
    const {
      blurryImageUrl,
      isAuthenticated,
      notAuthorizedMsg,
    } = this.props;
    if (!this.props.isVerifying) {
      return (
        <div className="blurred-image-component">
          <div className="messageHolder">
            <Image src={blurryImageUrl} />
            {
              isAuthenticated && this.state.modalOpen ?
                (
                  <div className="infoHolder">
                    <div className="customWarningMsgModal">
                      <div className="closeButtonHolder">
                        <Button tabIndex={0} className="modal-close-icon bmo-close-btn bg-icon-props" onClick={this.handleCloseModal} aria-label="Close Modal" />
                      </div>
                      {notAuthorizedMsg || visibleMessage}
                      <br />
                      {contactMessage}
                      <div className="image-link-div-wrapper">
                        <div className="image-link-div ">
                          <div className="forgot-email-template-image forgot-mail-icon" />
                          <a title="research@bmo.com" href="mailto:research@bmo.com" className={'forgot-email-template-label email'}>research@bmo.com</a>
                        </div>
                      </div>
                      <div>
                        <Button className="closeBtn" tabIndex={0} secondary onClick={this.handleCloseModal} content="Close" />
                      </div>
                    </div>
                  </div>
                )
                : null
            }
          </div>
        </div>
      );
    }
    return null;
  }
}
const mapStateToProps = (state) => ({
  isAuthenticated: userSelector.getIsLoggedIn(state),
  isVerifying: userSelector.getIsVerifying(state)
});

const mapDispatchToProps = (dispatch) => ({
  onSignInClick: (msg) => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_SIGN_IN_CLICKED, data: msg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BlurredImageComponent);
