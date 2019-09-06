/* @flow weak */

/*
 * Component: ResetPasswordContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  specialCharacters as specialCharactersRegExp
} from 'constants/regex';
import { renderPasswordsavePopup } from 'utils';

import {
  Button,
  Heading,
  Form,
  Message,
  Label,
  Container
} from 'unchained-ui-react';

import {
  USER_AUTH_RESET_PASSWORD_DATA,
  CLEAR_ERROR_MESSAGE
} from 'store/actions';

import {
  userSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ResetPasswordContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


class ResetPasswordContainer extends Component {
  props: {
    onSubmit: () => void,
    errorMessage: '',
    token: '',
    isFormBeingSubmitted: bool,
  };

  state = {
    password: '',
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

    renderPasswordsavePopup('resetpasswordform');

    this.setState({ passwordErr: '', confirmPasswordErr: '', error: false });

    const {
      onSubmit,
      token
    } = this.props;

    const {
      password,
      confirmPassword,
    } = this.state;

    let passwordErr = '';
    let confirmPasswordErr = '';

    if (password === '') {
      passwordErr = 'Please enter your password.';
    }
    if (confirmPassword !== password) {
      confirmPasswordErr = 'Passwords must match';
    }

    this.setState({ confirmPasswordErr, passwordErr });
    if (passwordErr || confirmPasswordErr) return null;

    this.setState({
      disableSubmitBtn: true
    });

    if (onSubmit) {
      const data = {
        new_password1: password,
        new_password2: confirmPassword,
      };
      const { token1, token2 } = token;
      onSubmit(data, token1, token2);
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
      this.setState({ password: '', confirmPassword: '' });
    }
  }

  componentWillMount() {
    if (window.innerWidth < 701) {
      document.body.style.overflow = 'hidden';
    }
  }

  render() {
    const {
      password,
      confirmPassword,
      disableSubmitBtn,
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

    const isDisabled = !((!passwordErr) && (!confirmPasswordErr) && (!integerErr) && !(upperCaseErr) && !(lowerCaseErr) && !(minLimitErr) && !(specialChrErr) && !disableSubmitBtn && !error && password && confirmPassword && password === confirmPassword);

    const {
      errorMessage,
      isFormBeingSubmitted
    } = this.props;

    return (
      <Form className="set-password-container" onSubmit={this.handleSubmit} id={'resetpasswordform'}>
        <Heading as={'h1'}>
          Reset the password for your <br /> BMO Equity Research Account.
        </Heading>
        <Label className={`input-label ${passwordErr || error ? 'error' : ''}`} content={'Password'} />
        { doesErrorMessageNeed && passwordErr && <Message className={'error-text'} content={passwordErr} /> }
        { errorMessage && <Message className={'error-text'} content={errorMessage} />}
        <Form.Input autoComplete="on" input={{ 'aria-label': 'password', type: 'password', value: password }} name={'password'} className={passwordErr ? 'error' : ''} onChange={this.handleInputChange('password')} error={error} />

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
          <Button className={isFormBeingSubmitted === true ? 'activeState' : ''} type={'submit'} disabled={isDisabled} secondary size={'medium'}>{'Confirm'}</Button>
        </Container>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessage: userSelector.getErrorMessage(state),
  errorKey: userSelector.getErrorMessage(state),
  isFormBeingSubmitted: userSelector.getFormSubmitFlag(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (data, token1, token2) => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch(USER_AUTH_RESET_PASSWORD_DATA(data, token1, token2));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordContainer);
