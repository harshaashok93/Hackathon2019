/* @flow weak */

/*
 * Component: ForgotPasswordContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import {
  Heading,
  Form,
  Button,
  Container
} from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AccountLockedContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ForgotPasswordContainer extends Component {
  props: {
    modalClose: () => void
  };

  state = {
    username: '',
    disableSubmitBtn: false,
    error: false,
    usernameErr: '',
  };
  componentWillReceiveProps() {
    // ...
  }
  componentDidMount() {
    // ...
  }

  componentWillUnmount() {
    // ...
  }
  componentWillMount() {
    // ...
  }
  render() {
    return (
      <div className="forgot-email-container">
        <Form className="forgot-email-form-container">
          <Heading as={'h1'}>
            This account has been locked for 24 hours due to multiple incorrect login attempts. Please contact research@bmo.com to reset your account access.
          </Heading>
          <div className="image-link-div ">
            <div className="forgot-email-template-image forgot-mail-icon" />
            <a href="mailto:research@bmo.com" className={'forgot-email-template-label email'} title={'research@bmo.com'}>research@bmo.com</a>
          </div>
          <Container>
            <Button type="button" secondary size={'medium'} onClick={() => { document.body.style.overflow = ''; this.props.modalClose(); }} className={'cancel-btn'}>{'Close'}</Button>
          </Container>
        </Form>
      </div>
    );
  }
}
export default ForgotPasswordContainer;
