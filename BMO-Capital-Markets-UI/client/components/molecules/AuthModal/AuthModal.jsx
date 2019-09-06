/* @flow weak */

/*
 * Component: AuthModal
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import {
  Modal,
  Container,
  Button
} from 'unchained-ui-react';

import {
  LoginFormContainer,
  SignupFormContainer,
  ForgotPasswordContainer,
  ForgotEmailContainer,
  SetPasswordContainer,
  ResetPasswordContainer,
  AccountLockedContainer,
  ServerErrorModalContainer
} from 'containers';

import { pushToDataLayer } from 'analytics';
import { childOf } from 'utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AuthModal.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AuthModal extends Component {
  props: {
    showLoginModal: Boolean,
    showSignUpModal: Boolean,
    showForgotPasswordModal: Boolean,
    showForgotUsernameModal: Boolean,
    showSetCredentialsModal: Boolean,
    showResetPasswordModal: Boolean,
    showAccountLockedModal: Boolean,
    onModalClose: () => void,
    onSignUpClick: () => void,
    onSignInClick: () => void,
    onForgotPasswordClick: () => void,
    onForgotUsernameClick: () => void,
    onAccountLockModalClose: () => void,
    token: '',
    resetPasswordToken: '',
    serverError: '',
    onServerErrorModalClose: () => void,
    isLoggedIn: bool,
  };

  state = {
    showLoginModal: this.props.showLoginModal,
    showSignUpModal: this.props.showSignUpModal,
    showForgotPasswordModal: this.props.showForgotPasswordModal,
    showForgotUsernameModal: this.props.showForgotUsernameModal,
    showSetCredentialsModal: this.props.showSetCredentialsModal,
    showResetPasswordModal: this.props.showResetPasswordModal,
    showAccountLockedModal: this.props.showAccountLockedModal,
    showServerErrorModal: !!(this.props.serverError)
  }

  componentWillReceiveProps(nextProps) {
    const {
      showLoginModal,
      showSignUpModal,
      showForgotPasswordModal,
      showForgotUsernameModal,
      showSetCredentialsModal,
      showResetPasswordModal,
      showAccountLockedModal,
      serverError
    } = nextProps;

    this.setState({
      showLoginModal,
      showSignUpModal,
      showForgotPasswordModal,
      showForgotUsernameModal,
      showSetCredentialsModal,
      showResetPasswordModal,
      showAccountLockedModal,
      showServerErrorModal: !!(serverError)
    });
  }

  handleKeyPress = (e) => {
    const key = e.keyCode || e.which;
    if (key === 27) {
      this.handleClose();
    }
  }

  activeElement = null;

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('click', this.closeOnDocumentClick, true);
  }

  componentWillUnmount() {
    document.body.classList.remove('noscroll-login');
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('click', this.closeOnDocumentClick, true);
  }

  closeOnDocumentClick = (e) => {
    if (!childOf(e.target, document.querySelector('#auth-modal')) && !childOf(e.target, document.querySelector('#cookieAcknowledgementPopup'))) {
      this.handleClose();
    }
  }

  handleClose = () => {
    const {
      onModalClose,
      onAccountLockModalClose,
      onServerErrorModalClose
    } = this.props;
    document.body.style.overflow = '';
    if (onModalClose) {
      onModalClose();
    }
    if (onAccountLockModalClose) {
      onAccountLockModalClose();
    }
    if (onServerErrorModalClose) {
      onServerErrorModalClose();
    }
  }
  componentDidMount() {
    this.activeElement = document.activeElement;
  }

  componentDidUpdate() {
    if (this.activeElement) {
      this.activeElement.focus();
    }
  }

  renderFormComponent = () => {
    const {
      showLoginModal,
      showSignUpModal,
      showForgotPasswordModal,
      showForgotUsernameModal,
      showSetCredentialsModal,
      showResetPasswordModal,
      showAccountLockedModal,
      showServerErrorModal
    } = this.state;

    const {
      onSignUpClick,
      onSignInClick,
      onForgotPasswordClick,
      onForgotUsernameClick,
      onModalClose,
      token,
      resetPasswordToken,
      onAccountLockModalClose,
      serverError,
      onServerErrorModalClose
    } = this.props;

    if (showLoginModal) {
      pushToDataLayer('authentication', 'loginOverlay');
      return <LoginFormContainer onSignUpClick={onSignUpClick} onForgotPasswordClick={onForgotPasswordClick} />;
    } else if (showSignUpModal) {
      pushToDataLayer('authentication', 'registrationOverlay');
      return <SignupFormContainer onSignInClick={onSignInClick} modalClose={onModalClose} />;
    } else if (showForgotPasswordModal) {
      pushToDataLayer('authentication', 'forgotPwdOverlay');
      return <ForgotPasswordContainer onSignUpClick={onSignUpClick} onForgotUsernameClick={onForgotUsernameClick} modalClose={onModalClose} />;
    } else if (showForgotUsernameModal) {
      pushToDataLayer('authentication', 'forgotEmailOverlay');
      return <ForgotEmailContainer modalClose={onModalClose} />;
    } else if (showSetCredentialsModal) {
      return <SetPasswordContainer token={token} />;
    } else if (showResetPasswordModal) {
      return <ResetPasswordContainer token={resetPasswordToken} />;
    } else if (showAccountLockedModal) {
      return <AccountLockedContainer modalClose={onAccountLockModalClose} />;
    } else if (showServerErrorModal) {
      return <ServerErrorModalContainer message={serverError} modalClose={onServerErrorModalClose} />;
    }

    return null;
  }

  render() {
    const {
      showLoginModal,
      showSignUpModal,
      showForgotPasswordModal,
      showForgotUsernameModal,
      showSetCredentialsModal,
      showResetPasswordModal,
      showAccountLockedModal,
      showServerErrorModal
    } = this.state;
    const {
      isLoggedIn
    } = this.props;

    const shouldShowModal = showLoginModal || showSignUpModal || showForgotPasswordModal || showForgotUsernameModal || showSetCredentialsModal || showSetCredentialsModal || showResetPasswordModal || showAccountLockedModal || showServerErrorModal;
    if (shouldShowModal) {
      document.body.classList.add('noscroll-login');
    } else {
      document.body.classList.remove('noscroll-login');
    }

    if (showLoginModal && isLoggedIn) {
      return null;
    }

    const showByModal = document.getElementById('user-profile-header-name-and-date');
    return (
      <Modal
        open={shouldShowModal}
        className="auth-modal"
        id="auth-modal"
        closeOnEscape={true}
        dimmer={false}
        closeOnDocumentClick={true}
        mountNode={showByModal}
        role="dialog"
      >
        <Modal.Content>
          <Button className="ariaHiddenBtn" id="authModalAriaHiddenBtn" aria-hidden={true} />
          { /* eslint-disable */ }
          <Button tabIndex={0} className="modal-close-icon bmo-close-btn bg-icon-props" onClick={this.handleClose} aria-label="Close Modal" />
          { /* eslint-disable */ }
          <Container className="form-container">{this.renderFormComponent()}</Container>
        </Modal.Content>
      </Modal>
    );
  }
}

export default AuthModal;
