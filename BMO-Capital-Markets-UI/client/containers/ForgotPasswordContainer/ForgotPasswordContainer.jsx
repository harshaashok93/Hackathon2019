/* @flow weak */

/*
 * Component: ForgotPasswordContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  Button,
  Heading,
  Form,
  Message,
  Label,
  Container
} from 'unchained-ui-react';
import {
  email as emailRegExp,
} from 'constants/regex';

import {
  USER_FORGOT_PASSWORD_SUBMIT,
  CLEAR_ERROR_MESSAGE,
  SET_PASSWORD_RECOVERY_FLAG
} from 'store/actions';

import {
  userSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ForgotPasswordContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ForgotPasswordContainer extends Component {
  props: {
    onSubmit: () => void,
    errorMessage: '',
    onForgotUsernameClick: () => void,
    resetPasswordRecoveryFlag: () => void,
    modalClose: () => void,
    passwordRecoveryFlag: bool,
    isFormBeingSubmitted: bool
  };

  state = {
    username: '',
    disableSubmitBtn: false,
    error: false,
    usernameErr: '',
    doesErrorMessageNeed: true,
    isBmoUser: false,
  };

  componentWillReceiveProps(nextProps) {
    this.errorCheck(nextProps);
    if (nextProps.passwordRecoveryFlag) {
      if (window.innerWidth < 701) {
        document.body.style.overflow = 'hidden';
      }
    }
  }

  componentDidMount() {
    const el = document.getElementById('authModalAriaHiddenBtn');
    if (el) el.focus();
  }

  componentWillUnmount() {
    this.props.resetPasswordRecoveryFlag();
  }

  componentWillMount() {
    if (window.innerWidth < 701) {
      document.body.style.overflow = 'hidden';
    }
  }

  handleInputChange = (name) => (e) => {
    let emailDomain = '';
    if (name === 'username') {
      emailDomain = (e.target.value).split('@')[1];
    }
    this.setState({
      [name]: e.target.value,
      [`${name}Err`]: '',
      error: false,
      isBmoUser: window.unchainedSite && window.unchainedSite.AllowedSSOEmailDomains && window.unchainedSite.AllowedSSOEmailDomains.includes(emailDomain),
    });
  }

  handleSubmit = (e) => {
    const { isBmoUser } = this.state;
    document.body.style.overflow = '';
    e.preventDefault();
    this.setState({ usernameErr: '', error: false });
    const {
      onSubmit,
    } = this.props;

    const {
      username,
    } = this.state;


    if (username === '' || !(emailRegExp.test(username))) {
      this.setState({ usernameErr: 'Please enter a valid e-mail address', username: '' });
      return;
    }

    this.setState({
      disableSubmitBtn: true
    });

    if (onSubmit) {
      const data = {
        email: username,
      };

      if (!isBmoUser) {
        onSubmit(data);
      }
    }
  }

  errorCheck = (props = this.props) => {
    const {
      errorMessage
    } = props;

    const error = !!(errorMessage);
    this.setState({ error, disableSubmitBtn: false });
    if (error) {
      this.setState({ username: '' });
    }
  }

  onForgotUsernameClick = () => {
    const { onForgotUsernameClick } = this.props;
    if (onForgotUsernameClick) {
      onForgotUsernameClick();
    }
  }

  closeConfirmationModal = () => {
    document.body.style.overflow = '';
    const { resetPasswordRecoveryFlag, modalClose } = this.props;
    resetPasswordRecoveryFlag();
    modalClose();
  }

  renderRecoveryEmailMessage = () => {
    const {
      isBmoUser,
      username,
      error,
      usernameErr,
      disableSubmitBtn,
    } = this.state;
    const { isFormBeingSubmitted } = this.props;
    const isDisabled = !((!usernameErr) && !disableSubmitBtn && !error && username);

    if (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.IS_SSO_ENABLED === 'True' && isBmoUser) {
      return (
        <div className="bmo-forgot-password-text">
          {window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.FORGOT_CREDENTIALS_BMO_USER_MESSAGE}
        </div>
      );
    }
    return (
      <Container>
        <Button className={isFormBeingSubmitted === true ? 'activeState' : ''} type={'submit'} disabled={isDisabled} secondary size={'medium'}>{'Send'}</Button>
        {/* <Button type={'button'} className={'linkBtn forgot-username-btn'} onClick={this.onForgotUsernameClick}>Forgot your Username?</Button> */}
      </Container>
    );
  }

  render() {
    const {
      username,
      error,
      usernameErr,
      doesErrorMessageNeed,
      isBmoUser
    } = this.state;

    const {
      errorMessage,
      passwordRecoveryFlag,
    } = this.props;

    const forgotPasswordTextClassName = isBmoUser ? 'forgot-password-text-inactive' : 'forgot-password-text';

    const forgetPasswordLabelText = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.FORGET_PASSWORD_LABEL_TEXT) || 'Email';

    return (
      passwordRecoveryFlag === false ?
        <Form className="forgot-password-container" onSubmit={this.handleSubmit}>
          <Heading as={'h1'} className={`${forgotPasswordTextClassName}`}>
            {window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.FORGOT_CREDENTIALS_HEADING}
          </Heading>

          { doesErrorMessageNeed && errorMessage && <Message negative content={errorMessage} />}
          <Label className={`input-label ${usernameErr || error ? 'error' : ''}`} content={forgetPasswordLabelText} />
          { doesErrorMessageNeed && usernameErr && <Message className={'error-text'} content={usernameErr} /> }
          <Form.Input input={{ 'aria-label': 'email address' }} type={'email'} name={'email'} className={usernameErr ? 'error' : ''} value={username} onChange={this.handleInputChange('username')} error={error} />
          {this.renderRecoveryEmailMessage()}
        </Form>
        :
        <Container className="password-recovery-confirmation">
          <Heading as={'h1'}>
            A recovery email has been sent to the email address on your account. Please check your spam/junk folder, or contact research@bmo.com if an email has not been received.
          </Heading>
          <Container>
            <Button secondary className={'password-recovery-close'} size={'medium'} onClick={this.closeConfirmationModal}>{'Close'}</Button>
          </Container>
        </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessage: userSelector.getErrorMessage(state),
  passwordRecoveryFlag: userSelector.getRecoveryPasswordFlag(state),
  isFormBeingSubmitted: userSelector.getFormSubmitFlag(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: data => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch(USER_FORGOT_PASSWORD_SUBMIT(data));
  },
  resetPasswordRecoveryFlag: () => {
    dispatch({ type: SET_PASSWORD_RECOVERY_FLAG, data: false });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordContainer);
