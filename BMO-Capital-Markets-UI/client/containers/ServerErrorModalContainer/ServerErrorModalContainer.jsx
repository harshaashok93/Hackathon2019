/* @flow weak */

/*
 * Component: ServerErrorModalContainer
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
import './ServerErrorModalContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ServerErrorModalContainer extends Component {
  props: {
    message: '',
    modalClose: () => void
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
    const { message } = this.props;
    window.scrollTo(0, 0);
    return (
      <div className="forgot-email-container">
        <Form className="forgot-email-form-container">
          <Heading as={'h1'}>
            {message || 'Oops! Something went wrong'}
            {message &&
              <div className={'wrong-domain-error-msg'}>
                <div className="image-link-div ">
                  <div className="forgot-email-template-image forgot-mail-icon" />
                  <a href="mailto:research@bmo.com" className={'forgot-email-template-label email'} title={'research@bmo.com'}>research@bmo.com</a>
                </div>
              </div>
            }
          </Heading>
          <Container>
            <Button type="button" secondary size={'medium'} onClick={() => { document.body.style.overflow = ''; this.props.modalClose(); }} className={'cancel-btn'}>{'Close'}</Button>
          </Container>
        </Form>
      </div>
    );
  }
}

export default ServerErrorModalContainer;
