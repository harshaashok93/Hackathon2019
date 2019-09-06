/* @flow weak */

/*
 * Component: DownloadingModal
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Modal, Loader } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './DownloadingModal.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DownloadingModal extends Component {
  props: {
    closeModal: () => void,
    modalType: '',
    text: '',
  };

  static defaultProps = {
  };

  state = {
  };

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  closeModal = () => {
    this.props.closeModal(this.props.modalType);
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  render() {
    const mountpoint = document.getElementById('mainPageHeader');
    return (
      <div className="downloading-modal-wrapper">
        <Modal
          open={true}
          className={'downloading-modal'}
          closeOnDocumentClick={false}
          closeOnDimmerClick={false}
          dimmer={true}
          mountNode={mountpoint}
          onClose={() => this.closeModal()}
          closeOnRootNodeClick={false}
        >
          <Modal.Content>
            <div className="close-button-bar">
              <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={this.closeModal} />
            </div>
            <div className="wrapper-div">
              <p>{this.props.text}</p>
              <Loader active={true} />
            </div>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default DownloadingModal;
