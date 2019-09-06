/* @flow weak */

/*
 * Component: ForgotEmailContainer
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
import './ForgotEmailContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ForgotEmailContainer extends Component {
  props: {
    modalClose: () => void,
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    return (
      <div className="forgot-email-container">
        <Form className="forgot-email-form-container">
          <Heading as={'h1'}>
            Please contact us to reset your account access.
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

export default ForgotEmailContainer;
