/* @flow weak */

/*
 * Component: LoginFormContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';
import { renderPasswordsavePopup } from 'utils';

import {
  Button,
  Form,
  Message,
  Label,
  Container,
  Heading
} from 'unchained-ui-react';

import {
  USER_AUTH_LOGIN,
  CLEAR_ERROR_MESSAGE,
  CHECK_INTERNAL_REQUEST
} from 'store/actions';

import {
  userSelector
} from 'store/selectors';

import { ssoUrl } from 'config';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LoginFormContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


class LoginFormContainer extends Component {
  props: {
    onSubmit: () => void,
    onSignUpClick: () => void,
    onForgotPasswordClick: () => void,
    errorMessage: '',
    clearBackEndError: () => void,
    isFormBeingSubmitted: {},
    loginModalTitle: ''
  };

  state = {
    username: '',
    password: '',
    usernameErr: '',
    passwordErr: '',
    disableSubmitBtn: false,
    error: false,
    isNextButtonClicked: false,
    isNextButtonLoading: false,
    isBmoUser: false,
    isBMOLoginLoading: false,
  };

  componentWillReceiveProps(nextProps) {
    this.errorCheck(nextProps);
  }

  componentDidMount() {
    const el = document.getElementById('authModalAriaHiddenBtn');
    if (el) el.focus();
  }

  onSignUpClick = () => {
    const {
      onSignUpClick
    } = this.props;

    if (onSignUpClick) onSignUpClick();
    pushToDataLayer('authentication', 'registerBtnClick', { label: '' });
  }

  onForgotPasswordClick = () => {
    const {
      onForgotPasswordClick
    } = this.props;

    if (onForgotPasswordClick) onForgotPasswordClick();
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

  handleBMOLoginClick = async () => {
    const { checkIfInternalRequest } = this.props;
    const { username } = this.state;
    let providerId = '';
    if (window.unchainedSite && window.unchainedSite.AppSettings) {
      providerId = window.unchainedSite.AppSettings.SSO_PROVIDER_ID;
    }
    const ssoRedirectionUrl = `${ssoUrl}/saml/${providerId}/acs/?RelayState=${window.location.href}&email=${username}`;
    this.setState({ isBMOLoginLoading: true });
    await checkIfInternalRequest();
    window.location.replace(ssoRedirectionUrl);
  }

  handleSubmit = (e) => {
    document.body.style.overflow = '';
    e.preventDefault();

    renderPasswordsavePopup('loginform');

    this.props.clearBackEndError();

    const {
      onSubmit,
    } = this.props;

    const {
      username,
      password,
    } = this.state;

    let usernameErr = '', passwordErr = ''; // eslint-disable-line

    if (username === '') {
      usernameErr = 'Please enter a valid username';
    }
    if (password === '') {
      passwordErr = 'Please enter your password';
    }

    this.setState({ passwordErr, usernameErr, error: false });
    if (passwordErr || usernameErr) return null;

    // this.setState({
    //   disableSubmitBtn: true
    // });

    if (onSubmit) {
      const data = {
        username,
        password,
      };
      onSubmit(data);
    }

    // this.errorCheck();

    return null;
  }

  errorCheck = (props = this.props) => {
    const {
      errorMessage
    } = props;

    const error = !!(errorMessage);
    this.setState({ error, usernameErr: error, passwordErr: error, disableSubmitBtn: false });
    if (error) {
      this.setState({ password: '', username: '' });
    }
  }

  renderUsernameField = (error, usernameErr, username) => {
    return (
      <div className="login-form-username-field">
        <Label className={`input-label ${usernameErr || error ? 'error' : ''}`} content={'Username'} />
        { usernameErr && <Message className={'error-text'} content={usernameErr} /> }
        <Form.Input type={'text'} autoComplete={'on'} input={{ 'aria-label': 'username', value: username, autocomplete: 'on' }} name={'username'} className={usernameErr ? 'error' : ''} onChange={this.handleInputChange('username')} error={error} placeholder={'abc@example.com'} />
      </div>
    );
  }

  renderPasswordField = (error, passwordErr, password) => {
    return (
      <div className="login-form-password-field">
        <Label className={`input-label ${passwordErr || error ? 'error' : ''}`} content={'Password'} />
        { passwordErr && <Message className={'error-text'} content={passwordErr} /> }
        <Form.Input type={'password'} autoComplete={'on'} aria={{ 'aria-label': 'password', value: password }} input={{ autocomplete: 'on' }} name={'password'} className={passwordErr ? 'error' : ''} ariaLabel={'password'} onChange={this.handleInputChange('password')} error={error} />
      </div>
    );
  }

  renderBmoLoginButton = () => {
    const { isBMOLoginLoading } = this.state;
    if (isBMOLoginLoading) {
      return (
        <div className="bmo-sso-loading-text">Proceeding to BMO Log In…</div>
      );
    }
    return (
      <Button
        type={'submit'}
        secondary
        size={'medium'}
        loading={isBMOLoginLoading}
        onClick={this.handleBMOLoginClick}
        className="login-form-bmo-login-button"
      >{'BMO Log In'}</Button>
    );
  }

  render() {
    const {
      username,
      password,
      error,
      disableSubmitBtn,
      isBmoUser
    } = this.state;

    const {
      isFormBeingSubmitted,
      loginModalTitle
    } = this.props;

    let usernameErr = '', passwordErr = ''; // eslint-disable-line

    if (error) {
      usernameErr = 'Please enter a valid username';
      passwordErr = 'Please enter a valid password';
    }

    const isDisabled = !((!usernameErr) && (!passwordErr) && !disableSubmitBtn && !error && username && password);

    return (
      <Form className="login-form-container" id={'loginform'} onSubmit={this.handleSubmit}>
        {
          loginModalTitle ?
            <Heading as={'h1'}>
              {loginModalTitle}
            </Heading>
            : null
        }
        {window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.IS_SSO_ENABLED === 'True' ?
          <div>
            {this.renderUsernameField(error, usernameErr, username)}
            {
              !isBmoUser ?
                this.renderPasswordField(error, passwordErr, password)
                : null
            }
          </div>
          :
          <div>
            {this.renderUsernameField(error, usernameErr, username)}
            {this.renderPasswordField(error, passwordErr, password)}
          </div>
        }
        <Container>
          {
            window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.IS_SSO_ENABLED === 'True' && isBmoUser ?
              this.renderBmoLoginButton()
              :
              <div>
                <Button type={'submit'} button={{ type: 'submit' }}className={isFormBeingSubmitted === true ? 'activeState' : ''} disabled={isDisabled} secondary size={'medium'}>{'Log In'}</Button>
                <Button type="button" className={'linkBtn registerLink'} onClick={this.onSignUpClick}>Register for an account</Button>
                <Button type="button" className={'linkBtn'} onClick={this.onForgotPasswordClick}>Forgot credentials?</Button>
              </div>
          }
        </Container>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessage: userSelector.getErrorMessage(state),
  isFormBeingSubmitted: userSelector.getFormSubmitFlag(state),
  loginModalTitle: userSelector.getLoginModalTitle(state)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: data => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch(USER_AUTH_LOGIN(data));
  },
  clearBackEndError: () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
  },
  checkIfInternalRequest: () => CHECK_INTERNAL_REQUEST(),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormContainer);
