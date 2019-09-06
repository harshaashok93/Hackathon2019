/* @flow weak */

/*
 * Component: CannabisPreviewModal
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './CannabisPreviewModal.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CannabisPreviewModal extends Component {
  props: {
    message: '',
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
    const contactMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.COMMON_CONTACT_MESSAGE) || 'For more information, please contact us.';
    return (
      <div className="cannabis-preview-modal">
        <div className={'message'}>
          {message}
          <br />
          {contactMessage}
        </div>
        <div className={'contact-section'}>
          <div className={'contact-link'}>
            <a title="research@bmo.com" href="mailto:research@bmo.com"><Button className={'forgot-mail-icon'}>research@bmo.com</Button></a>
          </div>
        </div>
      </div>
    );
  }
}

export default CannabisPreviewModal;
