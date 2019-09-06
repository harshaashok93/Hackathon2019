/* @flow weak */

/*
 * Component: ContactUsForm
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Label, Input, TextArea, Form, Button, Message, Heading } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  email as emailRegExp,
  name as nameRegExp,
} from 'constants/regex';
import {
  userSelector
} from 'store/selectors';
import {
  SET_POST_FORM_RESULT,
  POST_CONTACT_US_INFORMATION,
  POST_CONFERENCE_INFORMATION,
  SET_ERROR_MESSAGE_POPUP_FORM,
} from 'store/actions';
import './ContactUsForm.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ContactUsForm extends Component {
  props: {
    errorMessage: '',
    onSubmitContactUs: () => void,
    clearErrorMessage: () => void,
    closeContactUsForm: () => void,
    onSubmitConference: () => void,
    resetResponseStatus: () => void,
    sendResponseStatus: () => void,
    mountPoint: '',
    contactUsFormType: '',
    eventConference: {},
    responseStatus: boolean,
    profile: {},
    isLoggedIn: bool,
    reqPara: {}
  };

  static defaultProps = {
  };

  state = {
    email: '',
    emailErr: '',
    firstname: '',
    firstnameErr: '',
    phone: '',
    phoneErr: '',
    company: '',
    lastname: '',
    disableSubmitBtn: false,
    error: false,
    contactUsFormType: 'contactus',
    eventConference: {},
    doesErrorMessageNeed: false,
    comment: '',
  };

  componentWillMount() {
    const { contactUsFormType, eventConference } = this.props;
    if (eventConference) {
      this.setState({ eventConference });
    }
    this.prefilForm();
    this.setState({ isContactUsFormOpen: true, contactUsFormType });
    this.props.resetResponseStatus();
  }

  prefilForm = () => {
    const { isLoggedIn, profile } = this.props;
    if (isLoggedIn && (profile.groups.length === 0 || profile.groups.filter(group => group.name === 'GENERIC_USER').length === 1)) {
      const firstname = profile.first_name || '';
      const lastname = profile.last_name || '';
      const email = profile.email;
      const phone = profile.phone;
      const company = profile.company;
      this.setState({ firstname, lastname, email, phone, company });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.responseStatus === true && nextProps.responseStatus !== this.props.responseStatus) {
      this.props.closeContactUsForm();
      this.props.sendResponseStatus(nextProps.responseStatus);
    }
    this.prefilForm();
    this.setState({ contactUsFormType: nextProps.contactUsFormType, eventConference: nextProps.eventConference });
  }

  componentDidMount() {
    // ...
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  handleInputChange = (name) => (e) => {
    this.setState({
      [name]: e.target.value,
      [`${name}Err`]: '',
      error: false,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();

    const { email, firstname, lastname, phone, company, contactUsFormType, comment } = this.state;
    let firstnameErr = '', emailErr = '', phoneErr ='', lastnameErr ='', companyErr =''; // eslint-disable-line

    const { onSubmitContactUs, clearErrorMessage, onSubmitConference, eventConference } = this.props;

    clearErrorMessage();

    if (!nameRegExp.test(firstname)) {
      firstnameErr = 'Please enter a valid first name';
    }

    if (!nameRegExp.test(lastname)) {
      lastnameErr = 'Please enter a valid last name';
    }

    if (company === '') {
      companyErr = 'Please enter a valid company name';
    }

    if (email === '' || !(emailRegExp.test(email))) {
      emailErr = 'Please enter a valid email address';
    }

    if (phone === '' || (phone.length > 30)) {
      phoneErr = 'Please enter a valid phone number';
    }

    this.setState({ firstnameErr, emailErr, phoneErr, lastnameErr, companyErr });
    if (firstnameErr || emailErr || phoneErr || lastnameErr || companyErr) return null;

    this.setState({
      disableSubmitBtn: true,
    });

    if (contactUsFormType === 'contactus') {
      if (onSubmitContactUs) {
        const data = {
          email,
          first_name: firstname,
          last_name: lastname,
          phone,
          company,
          comments: comment
        };
        onSubmitContactUs(data);
      }
    } else if (onSubmitConference) {
      const activeFilters = this.props.reqPara || '';
      const gtmdata = this.props.reqPara ? { analystName: eventConference.presenter, activeFilters } : { analystName: eventConference.presenter };
      pushToDataLayer('profile', 'requestForEvent', { category: 'Profile Calender', action: 'Attend Event', label: eventConference.title || '', data: gtmdata });
      const data = {
        email,
        first_name: firstname,
        last_name: lastname,
        phone,
        company,
        salesforce_id: eventConference.sfId,
        eventId: eventConference.eventId,
        comments: comment
      };
      onSubmitConference(data);
    }

    this.errorCheck();
    return null;
  }

  errorCheck = (props = this.props) => {
    const {
      errorMessage
    } = props;

    const error = !!(errorMessage);
    this.setState({ error, disableSubmitBtn: false });
  }

  onClickOfClose = () => () => {
    this.props.clearErrorMessage();
    this.props.closeContactUsForm();
  }

  render() {
    const {
      errorMessage,
      closeContactUsForm,
      mountPoint,
    } = this.props;

    const {
      firstnameErr,
      firstname,
      lastname,
      disableSubmitBtn,
      emailErr,
      email,
      phoneErr,
      phone,
      company,
      companyErr,
      lastnameErr,
      error,
      isContactUsFormOpen,
      contactUsFormType,
      eventConference,
      doesErrorMessageNeed
    } = this.state;
    const isDisabled = !((!firstnameErr) && (!emailErr) && (!phoneErr) && (!companyErr) && !(lastnameErr) && !disableSubmitBtn && !error && firstname && lastname && email && phone && company);
    return (
      <div className="contact-us-form">
        <Modal
          open={isContactUsFormOpen}
          className="contact-us-form"
          mountNode={mountPoint}
          onClose={closeContactUsForm}
          closeOnRootNodeClick={false}
        >
          <Modal.Content className="contact-us-form-content">
            <div className="contact-us-form-heading">
              <div className="button-holder">
                <Button className="ui button modal-close-icon bmo-close-btn" onClick={this.onClickOfClose()} />
              </div>
              {contactUsFormType === 'contactus' ?
                <div className="form-name">
                  Contact Us
                </div>
                :
                <div className={'conference-top-section'}>
                  <div className={'conference-date'}>
                    <span>{eventConference ? eventConference.event : ''}</span>
                    <div className={'seperator-dot'}>{' • '}</div>
                    <span>{eventConference ? eventConference.date : ''}</span>
                  </div>
                  <Heading as={'h3'} className={'title'} content={eventConference ? eventConference.title : ''} />
                  <Heading as={'h5'} className={'info'} content={eventConference ? eventConference.info : ''} />
                </div>
              }
            </div>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                { doesErrorMessageNeed && errorMessage && <Message negative content={errorMessage} />}
                { firstnameErr && <Message className={'error-text'} content={firstnameErr} /> }
                <Label className={`input-label ${firstnameErr || error ? 'error' : ''}`}> First Name </Label>
                <Input className={firstnameErr ? 'error' : ''} input={{ value: firstname }} onChange={this.handleInputChange('firstname')} />
              </Form.Field>
              <Form.Field>
                { lastnameErr && <Message className={'error-text'} content={lastnameErr} /> }
                <Label className={`input-label ${lastnameErr || error ? 'error' : ''}`}> Last Name </Label>
                <Input className={lastnameErr ? 'error' : ''} input={{ value: lastname }} onChange={this.handleInputChange('lastname')} />
              </Form.Field>
              <Form.Field>
                { emailErr && <Message className={'error-text'} content={emailErr} /> }
                <Label className={`input-label ${emailErr || error ? 'error' : ''}`}> Email Address </Label>
                <Input className={emailErr ? 'error' : ''} input={{ value: email }} onChange={this.handleInputChange('email')} />
              </Form.Field>
              <Form.Field>
                { phoneErr && <Message className={'error-text'} content={phoneErr} /> }
                <Label className={`input-label ${phoneErr || error ? 'error' : ''}`}> Phone </Label>
                <Input className={phoneErr ? 'error' : ''} input={{ value: phone }} onChange={this.handleInputChange('phone')} />
              </Form.Field>
              <Form.Field>
                { companyErr && <Message className={'error-text'} content={companyErr} /> }
                <Label className={`input-label ${companyErr || error ? 'error' : ''}`}> Company </Label>
                <Input className={companyErr ? 'error' : ''} input={{ value: company }} onChange={this.handleInputChange('company')} />
              </Form.Field>
              <Form.Field>
                <Label className="input-label"> Comments (Optional) </Label>
                <TextArea className={'comment'} onChange={this.handleInputChange('comment')} />
              </Form.Field>
              <Button type={'submit'} disabled={isDisabled} secondary size={'medium'}>Submit</Button>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessage: userSelector.getcontactUsErrorMessage(state),
  responseStatus: userSelector.getcontactUsStatus(state),
  profile: userSelector.getUserProfileInfo(state),
  isLoggedIn: userSelector.getIsLoggedIn(state)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmitContactUs: data => {
    dispatch({ type: SET_ERROR_MESSAGE_POPUP_FORM, data: '' });
    dispatch(POST_CONTACT_US_INFORMATION(data));
  },
  resetResponseStatus: () => dispatch({ type: SET_POST_FORM_RESULT, data: false }),
  onSubmitConference: data => {
    dispatch({ type: SET_ERROR_MESSAGE_POPUP_FORM, data: '' });
    dispatch(POST_CONFERENCE_INFORMATION(data));
  },
  clearErrorMessage: () => dispatch({ type: SET_ERROR_MESSAGE_POPUP_FORM, data: '' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsForm);
