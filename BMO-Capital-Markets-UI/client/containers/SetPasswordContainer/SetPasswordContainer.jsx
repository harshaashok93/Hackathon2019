/* @flow weak */

/*
 * Component: SetPasswordContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  name as nameRegExp,
  specialCharacters as specialCharactersRegExp
} from 'constants/regex';
import { getParameterByName, renderPasswordsavePopup } from 'utils';

import {
  Button,
  Heading,
  Form,
  Message,
  Label,
  Container
} from 'unchained-ui-react';

import {
  USER_AUTH_SET_CREDENTIALS_DATA,
  CLEAR_ERROR_MESSAGE
} from 'store/actions';

import {
  userSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SetPasswordContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


class SetPasswordContainer extends Component {
  props: {
    onSubmit: () => void,
    errorMessage: '',
    token: '',
    email: '',
    isFormBeingSubmitted: Boolean
  };

  state = {
    username: getParameterByName('email') || '',
    password: '',
    usernameErr: '',
    passwordErr: '',
    confirmPassword: '',
    confirmPasswordErr: '',
    disableSubmitBtn: false,
    error: false,
    integerErr: false,
    upperCaseErr: false,
    lowerCaseErr: false,
    minLimitErr: false,
    specialChrErr: false,
    doesErrorMessageNeed: true
  }

  componentWillReceiveProps(nextProps) {
    this.errorCheck(nextProps);
    if (nextProps.email !== this.props.email) {
      this.setState({ username: nextProps.email });
    }
  }

  componentWillMount() {
    if (window.innerWidth < 701) {
      document.body.style.overflow = 'hidden';
    }
    this.setState({ username: (this.props.email || '') });
  }

  componentDidMount() {
    const el = document.getElementById('authModalAriaHiddenBtn');
    if (el) el.focus();
  }

  handleInputChange = (name) => (e) => {
    if (name === 'password') {
      const value = e.target.value;
      let integerErr = false;
      let upperCaseErr = false;
      let lowerCaseErr = false;
      let minLimitErr = false;
      let specialChrErr = false;

      if ((/(?=.*\d)/).test(value)) {
        integerErr = false;
      } else {
        integerErr = true;
      }
      if ((/(?=.*[a-z])/).test(value)) {
        lowerCaseErr = false;
      } else {
        lowerCaseErr = true;
      }
      if ((/(?=.*[A-Z])/).test(value)) {
        upperCaseErr = false;
      } else {
        upperCaseErr = true;
      }
      if ((/.{7,}/).test(value)) {
        minLimitErr = false;
      } else {
        minLimitErr = true;
      }
      if (specialCharactersRegExp.test(value)) {
        specialChrErr = false;
      } else {
        specialChrErr = true;
      }
      if (this.state.confirmPassword !== e.target.value && this.state.confirmPassword !== '') {
        this.setState({ confirmPasswordErr: 'Passwords must match' });
      } else {
        this.setState({ confirmPasswordErr: '' });
      }
      this.setState({ integerErr, upperCaseErr, lowerCaseErr, minLimitErr, specialChrErr });
    } else if (name === 'confirmPassword') {
      if (e.target.value !== this.state.password) {
        this.setState({ confirmPasswordErr: 'Passwords must match' });
      } else {
        this.setState({ confirmPasswordErr: '' });
      }
    }
    if (name === 'confirmPassword') {
      this.setState({
        [name]: e.target.value,
      });
    } else {
      this.setState({
        [name]: e.target.value,
        [`${name}Err`]: '',
        error: false,
      });
    }
  }

  handleSubmit = (e) => {
    document.body.style.overflow = '';
    e.preventDefault();

    renderPasswordsavePopup('setpasswordform');

    this.setState({ passwordErr: '', confirmPasswordErr: '', usernameErr: '', error: false });

    const {
      onSubmit,
      token
    } = this.props;

    const {
      username,
      password,
      confirmPassword,
    } = this.state;
    let usernameErr = '';
    let passwordErr = '';
    let confirmPasswordErr = '';
    if (!nameRegExp.test(username)) {
      usernameErr = 'Please enter a valid user name.';
    }
    if (password === '') {
      passwordErr = 'Please enter your password.';
    }
    if (confirmPassword !== password) {
      confirmPasswordErr = 'Passwords must match';
    }
    this.setState({ usernameErr, confirmPasswordErr, passwordErr });
    if (passwordErr || usernameErr || confirmPasswordErr) return null;

    this.setState({
      disableSubmitBtn: true
    });

    if (onSubmit) {
      const data = {
        username,
        password,
        confirm_password: confirmPassword,
      };
      onSubmit(data, token);
      window.scrollTo(0, 0);
    }

    // this.errorCheck();

    return null;
  }

  errorCheck = (props = this.props) => {
    const {
      errorMessage
    } = props;

    const error = !!(errorMessage);
    this.setState({ error, disableSubmitBtn: false });
    if (error) {
      this.setState({ password: '', confirmPassword: '', username: '' });
    }
  }

  render() {
    const {
      username,
      password,
      confirmPassword,
      disableSubmitBtn,
      usernameErr,
      passwordErr,
      confirmPasswordErr,
      integerErr,
      upperCaseErr,
      lowerCaseErr,
      minLimitErr,
      specialChrErr,
      error,
      doesErrorMessageNeed
    } = this.state;

    const isDisabled = !((!usernameErr) && (!passwordErr) && (!confirmPasswordErr) && (!integerErr) && !(upperCaseErr) && !(lowerCaseErr) && !(minLimitErr) && !(specialChrErr) && !disableSubmitBtn && !error && username && password && confirmPassword && password === confirmPassword);
    const {
      errorMessage,
      isFormBeingSubmitted
    } = this.props;

    return (
      <Form className="set-password-container" onSubmit={this.handleSubmit} id={'setpasswordform'}>
        <Heading as={'h2'} content={'Almost there! Please enter a username and password.'} />

        { doesErrorMessageNeed && errorMessage && <Message negative content={errorMessage} />}

        <Label className={`input-label ${usernameErr || error ? 'error' : ''}`} content={'Username'} />
        { doesErrorMessageNeed && usernameErr && <Message className={'error-text'} content={usernameErr} /> }
        <Form.Input
          type={'text'}
          aria={{ 'aria-label': 'user name' }}
          name={'username'}
          className={usernameErr ? 'error' : ''}
          ariaLabel={'user name'}
          input={{ value: username }}
          onChange={this.handleInputChange('username')}
          error={error}
          autoComplete="on"
        />

        <Label className={`input-label ${passwordErr || error ? 'error' : ''}`} content={'Password'} />
        { doesErrorMessageNeed && passwordErr && <Message className={'error-text'} content={passwordErr} /> }
        <Form.Input autoComplete="on" input={{ type: 'password', 'aria-label': 'password', value: password }} name={'password'} className={passwordErr ? 'error' : ''} onChange={this.handleInputChange('password')} error={error} />

        <p className={'password-validation'}>
          Password must contain:
          <div className={`integer ${integerErr ? 'error' : ''}`}>A number</div>
          <div className={`special-charecter ${specialChrErr ? 'error' : ''}`}>A special character</div>
          <div className={`lower-case ${lowerCaseErr ? 'error' : ''}`}>A lowercase letter</div>
          <div className={`upper-case ${upperCaseErr ? 'error' : ''}`}>An uppercase letter</div>
          <div className={`min-letter ${minLimitErr ? 'error' : ''}`}>Minimum 7 characters</div>
        </p>

        <Label className={`input-label ${confirmPasswordErr || error ? 'error' : ''}`} content={'Confirm Password'} />
        { doesErrorMessageNeed && confirmPasswordErr && <Message className={'error-text'} content={confirmPasswordErr} /> }
        <Form.Input autoComplete="on" input={{ 'aria-label': 'confirm password', type: 'password', value: confirmPassword }} name={'confirmPassword'} className={confirmPasswordErr ? 'error' : ''} onChange={this.handleInputChange('confirmPassword')} error={error} />

        <Container>
          <Button className={isFormBeingSubmitted === true ? 'activeState' : ''} type={'submit'} disabled={isDisabled} secondary size={'medium'}>{'Submit'}</Button>
        </Container>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessage: userSelector.getErrorMessage(state),
  email: userSelector.getRegisteredEmail(state),
  isFormBeingSubmitted: userSelector.getFormSubmitFlag(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (data, token) => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch(USER_AUTH_SET_CREDENTIALS_DATA(data, token));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SetPasswordContainer);
