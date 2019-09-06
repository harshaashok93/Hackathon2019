/* @flow weak */

/*
 * Component: DownloadFailedModal
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Modal } from 'unchained-ui-react';
import { connect } from 'react-redux';
import {
  SET_DOWNLOAD_FAILED
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './DownloadFailedModal.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DownloadFailedModal extends Component {
  props: {
    downloadtype: '',
    text: '',
    closeModal: () => void,
    setDownloadFailed: () => void,
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  closeFailedModal = () => {
    const { downloadtype, setDownloadFailed, closeModal } = this.props;
    if (!downloadtype) {
      closeModal();
    } else {
      setDownloadFailed(downloadtype);
    }
  }

  render() {
    const { text } = this.props;
    return (
      <div className="download-failed">
        <Modal
          open={true}
          className={'download-failed-modal'}
          closeOnDocumentClick={false}
          closeOnDimmerClick={false}
          dimmer={false}
        >
          <Modal.Content>
            <div className="close-button-bar">
              <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={this.closeFailedModal} />
            </div>
            <p>{text}</p>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setDownloadFailed: (data) => {
    dispatch(SET_DOWNLOAD_FAILED(data));
  },
});

export default connect(null, mapDispatchToProps)(DownloadFailedModal);
