/* @flow weak */

/*
 * Component: SignupFormContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  email as emailRegExp,
  name as nameRegExp,
} from 'constants/regex';
import { RichText } from 'components';
import { pushToDataLayer } from 'analytics';
import escapeRegExp from 'lodash/truncate';

import {
  Button,
  Heading,
  Form,
  Message,
  Label,
  Container,
  Dropdown,
  Search
} from 'unchained-ui-react';

import {
  USER_AUTH_REGISTER,
  CLEAR_ERROR_MESSAGE,
  SET_USER_AUTH_REGISTER_FLAG,
  CHECK_INTERNAL_REQUEST,
  SET_BMOCONTACT_FORM
} from 'store/actions';

import {
  userSelector
} from 'store/selectors';

import { ssoUrl } from 'config';

import { searchBMOContacts } from 'api/search';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SignupFormContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SignUpFormContainer extends Component {
  props: {
    onSubmit: () => void,
    onSignInClick: () => void,
    errorMessage: '',
    registrationFlag: Boolean,
    resetRegisterFlag: () => void,
    modalClose: () => void,
    clearErrorMessage: () => void,
    isFormBeingSubmitted: Boolean,
    errorKey: '',
    showBmoContactForm: Boolean,
    clearCurrentScreen: () => void,
  };

  state = {
    email: '',
    emailErr: '',
    firstname: '',
    firstnameErr: '',
    phone: '',
    phoneErr: '',
    company: '',
    companyErr: '',
    lastname: '',
    disableSubmitBtn: false,
    error: false,
    doesErrorMessageNeed: false,
    dropDownValue: 'North America',
    isBmoUser: false,
    isBMOLoginLoading: false,
    bmoContactSelectedValue: '',
    bmoContactResults: [],
    bmoContactNameIDMap: {},
    bmoContactForm: false,
    displayBMOContact: ''
  }

  componentWillReceiveProps(nextProps) {
    const { showBmoContactForm } = nextProps;
    this.errorCheck(nextProps);
    if (nextProps.registrationFlag) {
      if (window.innerWidth < 701) {
        document.body.style.overflow = 'hidden';
      }
    }

    this.setState({ bmoContactForm: showBmoContactForm });
  }

  componentWillUnmount() {
    const { resetRegisterFlag, clearErrorMessage, clearCurrentScreen } = this.props;
    resetRegisterFlag();
    clearErrorMessage();
    clearCurrentScreen();
  }

  componentDidMount() {
    const el = document.getElementById('authModalAriaHiddenBtn');
    if (el) el.focus();
  }

  onSignInClick = () => {
    const {
      onSignInClick,
    } = this.props;
    if (onSignInClick) onSignInClick();
  }

  handleSubmit = (type) => (e) => {
    document.body.style.overflow = '';
    e.preventDefault();
    const {
      email,
      firstname,
      lastname,
      phone,
      company,
      dropDownValue
    } = this.state;

    let firstnameErr = '', emailErr = '', phoneErr = '', lastnameErr = '', companyErr = ''; // eslint-disable-line
    let firstnameVal = firstname, emailVal = email, phoneVal = phone, lastnameVal = lastname; // eslint-disable-line

    const {
      onSubmit,
      clearErrorMessage
    } = this.props;

    clearErrorMessage();

    if (!nameRegExp.test(firstname)) {
      firstnameErr = 'Please enter a valid first name';
      firstnameVal = '';
    }

    if (!nameRegExp.test(lastname)) {
      lastnameErr = 'Please enter a valid last name';
      lastnameVal = '';
    }

    if (company === '') {
      companyErr = 'Please enter a valid company name';
    }

    if (email === '' || !(emailRegExp.test(email))) {
      emailErr = 'Please enter a valid e-mail address';
      emailVal = '';
    }

    if (phone === '' || (phone.length > 30)) {
      phoneErr = 'Please enter a valid phone number';
      phoneVal = '';
    }

    let bmoContact = 0;

    if (type === 'validation') {
      this.setState({ firstnameErr, emailErr, phoneErr, lastnameErr, companyErr });
      this.setState({ firstname: firstnameVal, email: emailVal, phone: phoneVal, lastname: lastnameVal });
      if (firstnameErr || emailErr || phoneErr || lastnameErr || companyErr) return null;
    } else {
      bmoContact = this.getSelectedDBId();
      let bmoContactSelectedVal = '';
      if (bmoContact) {
        bmoContactSelectedVal = bmoContact.title;
      }
      this.setState({ bmoContactSelectedValue: bmoContactSelectedVal });
    }

    this.setState({
      disableSubmitBtn: true,
      error: ''
    });

    if (onSubmit) {
      const data = {
        email,
        first_name: firstname,
        last_name: lastname,
        phone,
        company,
        region: dropDownValue,
        bmo_contact: (type === 'skip') ? 0 : bmoContact.dbId,
        formName: (type === 'validation') ? 'form_validation' : 'register',
      };

      pushToDataLayer('authentication', 'registerSubmitBtnClick', { label: email });
      onSubmit(data);
    }

    return null;
  }

  handleInputChange = (name) => (e) => {
    let emailDomain = '';
    if (name === 'email') {
      emailDomain = (e.target.value).split('@')[1];
    }
    this.setState({
      [name]: e.target.value,
      [`${name}Err`]: '',
      error: false,
      isBmoUser: window.unchainedSite && window.unchainedSite.AllowedSSOEmailDomains && window.unchainedSite.AllowedSSOEmailDomains.includes(emailDomain),
    });
  }

  errorCheck = (props = this.props) => {
    const {
      errorMessage,
      errorKey
    } = props;

    this.setState({ errorMessage, errorKey, disableSubmitBtn: false });
  }

  handleRegistrationCompletion = () => {
    document.body.style.overflow = '';
    const { resetRegisterFlag, modalClose } = this.props;
    resetRegisterFlag();
    modalClose();
  }

  handleResultSelect = (e, { value }) => {
    this.setState({ dropDownValue: value });
  }

  handleBMOContactChange = async (e, value) => {
    const bmoContactResults = [];
    this.setState({ bmoContactResults: [] });
    const bmoContactNameIDMap = {};

    let { bmoContactSelectedValue } = this.state;

    bmoContactSelectedValue = bmoContactSelectedValue === '' ? value.trim() : value;

    this.setState({ bmoContactSelectedValue, displayBMOContact: bmoContactSelectedValue });

    if (value.length > 1) {
      const resp = await searchBMOContacts(value);

      if (resp && resp.ok && resp.status === 200) {
        const bmoContacts = resp.data.responses[0].hits.hits || [];
        if (bmoContacts && bmoContacts.length) {
          bmoContacts.map(contact => {
            const contactName = `${contact._source.first_name} ${contact._source.last_name}***${contact._id}`;
            bmoContactResults.push({
              title: contactName,
              dbId: contact._id
            });
            bmoContactNameIDMap[contactName] = contact._id;
          });
        } else {
          bmoContactResults.push({
            title: 'No Result(s) Found.',
            dbId: 'none'
          });
        }
      }
    }
    this.setState({ bmoContactResults, bmoContactNameIDMap });
  }

  handleBMOContactResultSelected = (e, value) => {
    // Setting the state when a result is selected from the dropdown
    if (value && (value.dbId !== 'none')) {
      this.setState({
        bmoContactSelectedValue: value.title,
        displayBMOContact: value.title.split('***')[0],
        bmoContactResults: [value],
      });
    } else {
      this.setState({
        bmoContactSelectedValue: '',
        bmoContactResults: []
      });
    }
  }

  handleBMOLoginClick = async () => {
    const { checkIfInternalRequest } = this.props;
    const { email } = this.state;
    let providerId = '';
    if (window.unchainedSite && window.unchainedSite.AppSettings) {
      providerId = window.unchainedSite.AppSettings.SSO_PROVIDER_ID;
    }
    const ssoRedirectionUrl = `${ssoUrl}/saml/${providerId}/acs/?RelayState=${window.location.href}&email=${email}`;
    this.setState({ isBMOLoginLoading: true });
    await checkIfInternalRequest();
    window.location.replace(ssoRedirectionUrl);
  }

  renderUserRegistrationFlow = () => {
    const {
      isFormBeingSubmitted,
      errorMessage,
    } = this.props;
    const {
      firstname,
      lastname,
      doesErrorMessageNeed,
      firstnameErr,
      emailErr,
      email,
      phoneErr,
      phone,
      company,
      companyErr,
      lastnameErr,
      error,
      disableSubmitBtn,
      isBmoUser,
      isBMOLoginLoading,
    } = this.state;

    const results = [
      { key: 'NORTH_AMERICA', value: 'North America', text: 'North America' },
      { key: 'ASIA_SPECIFIC', value: 'Asia Pacific', text: 'Asia Pacific' },
      { key: 'EUROPE', value: 'Europe', text: 'Europe' },
    ];

    const isDisabled = !((!firstnameErr) && (!emailErr) && (!phoneErr) && (!companyErr) && !(lastnameErr) && !disableSubmitBtn && !error && firstname && lastname && email && phone && company);

    if (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.IS_SSO_ENABLED === 'True' && isBmoUser) {
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
        >{'BMO Log In'}</Button>
      );
    }

    return (
      <div>
        { doesErrorMessageNeed && errorMessage && <Message negative content={errorMessage} />}
        { firstnameErr && <Message className={'error-text'} content={firstnameErr} /> }
        <Label className={`input-label ${firstnameErr || error ? 'error' : ''}`} content={'First Name'} />
        <Form.Input input={{ 'aria-label': 'first name' }} className={firstnameErr ? 'error' : ''} type={'text'} name={'firstname'} value={firstname} onChange={this.handleInputChange('firstname')} />
        <Label className={`input-label ${lastnameErr || error ? 'error' : ''}`} content={'Last Name'} />
        { lastnameErr && <Message className={'error-text'} content={lastnameErr} /> }
        <Form.Input input={{ 'aria-label': 'last name' }} className={lastnameErr ? 'error' : ''} type={'text'} name={'lastname'} value={lastname} onChange={this.handleInputChange('lastname')} />
        <Label className={`input-label ${phoneErr || error ? 'error' : ''}`} content={'Phone'} />
        { phoneErr && <Message className={'error-text'} content={phoneErr} /> }
        <Form.Input input={{ 'aria-label': 'Phone' }} className={phoneErr ? 'error' : ''} type={'text'} name={'phone'} value={phone} onChange={this.handleInputChange('phone')} />
        <Label className={`input-label ${companyErr || error ? 'error' : ''}`} content={'Company'} />
        { companyErr && <Message className={'error-text'} content={companyErr} /> }
        <Form.Input input={{ 'aria-label': 'company' }} type={'text'} className={companyErr ? 'error' : ''} name={'company'} value={company} onChange={this.handleInputChange('company')} />
        <div className={'region-drop-down'}>
          <div className={'title'}>{'Region'}</div>
          <Dropdown
            placeholder={'Region'}
            onChange={this.handleResultSelect}
            selection
            value={this.state.dropDownValue}
            className="searchBox dropdown-chevron bmo_chevron bottom"
            options={results}
            selectOnBlur={false}
          />
        </div>
        <Container>
          <Button type={'submit'} className={isFormBeingSubmitted === true ? 'activeState' : ''} disabled={isDisabled} secondary size={'medium'}>Next</Button>
          <Container className="back-to-login-cntr">
            <p>Already have an account?</p> <Button type="button" className={'linkBtn'} onClick={this.onSignInClick}> Log in here</Button>
          </Container>
        </Container>
      </div>
    );
  }

  resultRenderer = ({ title, dbId }) => {
    const { bmoContactSelectedValue } = this.state;
    const titleVal = title.split('***')[0];
    let modifiedTitle = titleVal;
    if (dbId !== 'none') {
      const re = new RegExp(escapeRegExp(bmoContactSelectedValue.split('***')[0]), 'gi');
      modifiedTitle = titleVal.replace(re, '<strong>$&</strong>');
    }

    return <RichText key={dbId} richText={modifiedTitle} />;
  }

  getSelectedDBId = () => {
    const { bmoContactNameIDMap, bmoContactSelectedValue } = this.state;
    const titleArray = Object.keys(bmoContactNameIDMap).filter(
      item => item.indexOf(bmoContactSelectedValue) !== -1
    );
    if (titleArray.length === 1 && titleArray[0].split('***')[0] === bmoContactSelectedValue.split('***')[0]) {
      return {
        title: titleArray[0],
        dbId: bmoContactNameIDMap[titleArray[0]]
      };
    }
    return 0;
  }

  render() {
    const {
      registrationFlag,
      errorKey,
      errorMessage,
      isFormBeingSubmitted
    } = this.props;

    const {
      email,
      emailErr,
      error,
      bmoContactForm,
      bmoContactResults,
      disableSubmitBtn,
      displayBMOContact
    } = this.state;

    // const isDisabled = !((!firstnameErr) && (!emailErr) && (!phoneErr) && (!companyErr) && !(lastnameErr) && !disableSubmitBtn && !error && firstname && lastname && email && phone && company);

    if (registrationFlag || bmoContactForm) {
      window.scrollTo(0, 0);
      pushToDataLayer('authentication', 'registrationOverlayThankyou');
    }
    const selectedDbId = this.getSelectedDBId();
    const isDisabled = !(!disableSubmitBtn && !error && selectedDbId);
    if (bmoContactForm) {
      return (
        <Form className="signup-form-container BMO-contact-form" onSubmit={this.handleSubmit('register')}>
          <Heading as={'h1'} className={'intro-text'}>
            If you know the name of your institutional sales contact at BMO, please find them below.
          </Heading>
          <div className={'bmo-contact-drop-down'}>
            <div className="title">BMO Contact’s Name</div>
            <Search
              minCharacters={2}
              onResultSelect={this.handleBMOContactResultSelected}
              onSearchChange={this.handleBMOContactChange}
              results={bmoContactResults}
              placeholder="Search"
              value={displayBMOContact}
              resultRenderer={this.resultRenderer}
              className={
                `${bmoContactResults.length > 0 && 'has-results'}`
              }
            />
          </div>
          <Container>
            <Button type={'submit'} className={`${isFormBeingSubmitted === true ? 'activeState' : ''} register-submit`} disabled={isDisabled} secondary size={'medium'}>Submit</Button>
            <Container className="back-to-login-cntr">
              <p>Don’t know the name of your sales contact?</p> <Button type="button" className={'linkBtn'} onClick={this.handleSubmit('skip')}>Skip and submit</Button>
            </Container>
          </Container>
        </Form>
      );
    }

    return (
      registrationFlag === false ?
        <Form className="signup-form-container" onSubmit={this.handleSubmit('validation')}>
          <Heading as={'h1'} className={'intro-text'}>
            Please register for access to <br />  BMO {(window.unchainedSite && window.unchainedSite.sitename === 'Corp') ? 'Corporate Debt Research.' : 'Equity Research.'}
          </Heading>
          <Label className={`input-label ${emailErr || error ? 'error' : ''}`} content={'Email Address'} />
          { emailErr && <Message className={'error-text'} content={emailErr} /> }
          { ((errorKey === 'INVALID_EMAIL' || errorKey === 'INVALID_DATA') && errorMessage) && <Message className={'error-text'} content={errorMessage} /> }
          <Form.Input input={{ 'aria-label': 'email address' }} className={(emailErr || errorKey === 'INVALID_EMAIL' || errorKey === 'INVALID_DATA') || errorMessage ? 'error' : this.state.errEmailClass} type={'text'} name={'email'} value={email} onChange={this.handleInputChange('email')} />
          {this.renderUserRegistrationFlow()}
        </Form> :
        <Container className="signup-form-container">
          <Heading as={'h1'} className={'header-first-line'}>
           Thank you for registering.
          </Heading>
          <Heading as={'h1'} className={'header-last-line'}>
            Please check your email for further instructions.
          </Heading>
          <Container>
            <Button secondary size={'medium'} onClick={this.handleRegistrationCompletion}>{'Close'}</Button>
          </Container>
        </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessage: userSelector.getErrorMessage(state),
  errorKey: userSelector.getErrorKey(state),
  registrationFlag: userSelector.getRegistrationFlag(state),
  isFormBeingSubmitted: userSelector.getFormSubmitFlag(state),
  showBmoContactForm: userSelector.showBmoContactForm(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: data => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch(USER_AUTH_REGISTER(data));
  },
  clearErrorMessage: () => dispatch({ type: CLEAR_ERROR_MESSAGE }),
  resetRegisterFlag: () => {
    dispatch({ type: SET_USER_AUTH_REGISTER_FLAG, data: false });
  },
  checkIfInternalRequest: () => CHECK_INTERNAL_REQUEST(),
  clearCurrentScreen: () => {
    dispatch({ type: SET_BMOCONTACT_FORM, data: false });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFormContainer);
