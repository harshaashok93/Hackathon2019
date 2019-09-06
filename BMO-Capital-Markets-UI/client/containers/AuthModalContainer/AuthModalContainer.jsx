/* @flow weak */

/*
 * Component: AuthModalContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getParameterByName } from 'utils';

import {
  AuthModal
} from 'components';

import {
  USER_AUTH_SIGN_IN_CLICKED,
  USER_AUTH_SIGN_UP_CLICKED,
  USER_AUTH_FORGOT_PASSWORD_CLICKED,
  USER_AUTH_FORGOT_USERNAME_CLICKED,
  USER_AUTH_CLOSE_MODAL,
  USER_AUTH_VERIFY_REG_TOKEN,
  USER_AUTH_VERIFY_RESET_PWD_TOKEN,
  CLEAR_ERROR_MESSAGE,
  SET_USER_ACCOUNT_LOCKED,
  SHOW_SERVER_ERROR_MODAL
} from 'store/actions';

import {
  userSelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AuthModalContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AuthModalContainer extends Component {
  props: {
    showLoginModal: Boolean,
    showAccountLockedModal: Boolean,
    showSignUpModal: Boolean,
    showForgotPasswordModal: Boolean,
    showSetCredentialsModal: Boolean,
    showResetPasswordModal: Boolean,
    onSignInClick: () => void,
    onSignUpClick: () => void,
    onForgotPasswordClick: () => void,
    onForgotUsernameClick: () => void,
    onAuthModalClose: () => void,
    showForgotUsernameModal: () => void,
    onSetCredentialsTrigger: () => void,
    onResetPasswordTrigger: () => void,
    onAccountLockModalClose: () => void,
    serverError: '',
    onServerErrorModalClose: () => void,
    isLoggedIn: bool,
  };

  static defaultProps = {
  };

  state = {
    showLoginModal: false,
    showAccountLockedModal: false,
    showSignUpModal: false,
    showForgotPasswordModal: false,
    showForgotUsernameModal: false,
    showSearchModal: false,
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const {
      showLoginModal,
      showAccountLockedModal,
      showSignUpModal,
      showForgotPasswordModal,
      showForgotUsernameModal,
      showSetCredentialsModal,
      showResetPasswordModal,
      onSetCredentialsTrigger,
      onResetPasswordTrigger,
      onSignInClick,
      onSignUpClick,
      onForgotPasswordClick,
      onForgotUsernameClick,
      onAuthModalClose,
      onAccountLockModalClose,
      serverError,
      onServerErrorModalClose,
      isLoggedIn
    } = this.props;

    const token = getParameterByName('token');
    if (showSetCredentialsModal === null && token) {
      onSetCredentialsTrigger(token);
      return null;
    }

    const token1 = getParameterByName('reset_pwd_token1');
    const token2 = getParameterByName('reset_pwd_token2');
    const resetPasswordToken = { token1, token2 };
    if (showResetPasswordModal === null && token1 && token2) {
      onResetPasswordTrigger(token1, token2);
      return null;
    }
    return (
      <div className="auth-modal-container">
        {
          (showAccountLockedModal
            || showLoginModal
            || showSignUpModal
            || showForgotPasswordModal
            || showForgotUsernameModal
            || showSetCredentialsModal
            || showResetPasswordModal
            || serverError
          ) &&
          <AuthModal
            showLoginModal={showLoginModal}
            showSignUpModal={showSignUpModal}
            showForgotPasswordModal={showForgotPasswordModal}
            showForgotUsernameModal={showForgotUsernameModal}
            showSetCredentialsModal={showSetCredentialsModal}
            showResetPasswordModal={showResetPasswordModal}
            onModalClose={onAuthModalClose}
            onSignInClick={onSignInClick}
            onSignUpClick={onSignUpClick}
            onForgotPasswordClick={onForgotPasswordClick}
            onForgotUsernameClick={onForgotUsernameClick}
            token={token}
            onAccountLockModalClose={onAccountLockModalClose}
            showAccountLockedModal={showAccountLockedModal}
            resetPasswordToken={resetPasswordToken}
            serverError={serverError}
            onServerErrorModalClose={onServerErrorModalClose}
            isLoggedIn={isLoggedIn}
          />
        }
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  showLoginModal: userSelector.getShowLoginModal(state),
  showAccountLockedModal: userSelector.getShowAccountLockedModal(state),
  showSignUpModal: userSelector.getShowSignUpModal(state),
  showForgotPasswordModal: userSelector.getShowForgotPasswordModal(state),
  showForgotUsernameModal: userSelector.getshowForgotUsernameModal(state),
  showSetCredentialsModal: userSelector.getShowSetCredentialsModal(state),
  showResetPasswordModal: userSelector.getShowResetPasswordModal(state),
  serverError: userSelector.getServerError(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSignInClick: () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_SIGN_IN_CLICKED });
  },
  onSignUpClick: () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_SIGN_UP_CLICKED });
  },
  onForgotPasswordClick: () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_FORGOT_PASSWORD_CLICKED });
  },
  onAuthModalClose: () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_CLOSE_MODAL });
  },
  onAccountLockModalClose: () => {
    dispatch({ type: SET_USER_ACCOUNT_LOCKED, data: false });
  },
  onServerErrorModalClose: () => {
    dispatch({ type: SHOW_SERVER_ERROR_MODAL, data: '' });
  },
  onForgotUsernameClick: () => {
    dispatch({ type: USER_AUTH_FORGOT_USERNAME_CLICKED });
  },
  onSetCredentialsTrigger: token => dispatch(USER_AUTH_VERIFY_REG_TOKEN(token)),
  onResetPasswordTrigger: (token1, token2) => dispatch(USER_AUTH_VERIFY_RESET_PWD_TOKEN(token1, token2)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthModalContainer);
