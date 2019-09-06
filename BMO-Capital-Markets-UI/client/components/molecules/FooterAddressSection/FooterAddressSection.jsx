/* @flow weak */

/*
 * Component: FooterAddressSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { ContactUsForm } from 'components';
import { pushToDataLayer } from 'analytics';
import { Heading, Button, Modal } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FooterAddressSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FooterAddressSection extends Component {
  props: {
    text: '',
  };

  static defaultProps = {
  };

  state = {
    isExpanded: false,
    showContactUsForm: false,
    responseStatusVal: false,
  };
  expand = () => {
    const isExpanded = !this.state.isExpanded;
    this.setState({ isExpanded });
  };

  componentDidMount() {
    // Component ready
  }
  showContactUsForm = (label) => {
    this.setState({ showContactUsForm: true });
    document.body.style.overflow = 'hidden';
    pushToDataLayer('common', 'footerLinks', { label });
  }
  closeContactUsForm = () => {
    this.setState({ showContactUsForm: false });
    document.body.style.overflow = '';
  }

  responseStatus = () => (responseStatusVal) => {
    this.setState({ responseStatusVal });
  }

  closeConferenceMsgPopup = () => () => {
    this.setState({ responseStatusVal: false });
  }

  show = (dimmer) => () => this.setState({ dimmer, showContactUsForm: true });
  render() {
    const { text } = this.props;
    const { showContactUsForm, responseStatusVal } = this.state;
    const mountPoint = document.getElementById('bmo-footer');
    return (
      <div className="footer-links-set">
        <div role="button" onKeyPress={() => {}} tabIndex={0} onClick={() => this.showContactUsForm(text)} className="footer-link">
          {text}
        </div>
        {
          showContactUsForm ?
            <ContactUsForm
              isContactUsFormOpen={showContactUsForm}
              sendResponseStatus={this.responseStatus()}
              contactUsFormType={'contactus'}
              closeContactUsForm={this.closeContactUsForm}
              mountPoint={mountPoint}
            />
            : null
        }
        {responseStatusVal &&
          <Modal
            dimmer={false}
            className="popup-conference-success"
            closeOnEscape={true}
            open={responseStatusVal}
            onClose={this.closeConferenceMsgPopup()}
            mountNode={mountPoint}
            closeOnRootNodeClick={false}
          >
            <Modal.Header>
              <div className="close-image">
                <Button tabIndex={0} className="bmo-close-btn" onClick={this.closeConferenceMsgPopup()} aria-label="Close Modal" />
              </div>
            </Modal.Header>
            <Modal.Content>
              <Heading as={'h3'} content={'Thank you, your request has been submitted. We will respond to your inquiry by next business day.'} />
            </Modal.Content>
            <Modal.Actions className={'welcomeScreenActionBtns'}>
              <Button secondary content={'Close'} onClick={this.closeConferenceMsgPopup()} />
            </Modal.Actions>
          </Modal>
        }
      </div>
    );
  }
}

export default FooterAddressSection;
