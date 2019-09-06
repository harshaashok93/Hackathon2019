import React, { Component } from 'react';
import { appsettingsVariable } from 'constants/UnchainedVariable';
import { Button, Modal, Image, Grid } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import HeadingTextComponent from './HeadingTextComponent';


class Disclosures extends Component {
  props: {
    data: [],
    type: ''
  }

  state = {
    shouldShowModal: false
  }

  getModalContent() {
    const { data } = this.props;
    return (
      <div className={'disclosure-modal-content'}>
        {
          data.map(d => {
            if (typeof d.disclosureCharts !== 'undefined') {
              return (d.disclosureCharts.map(dc => <div className="disclosure-chart-modal"><Image key={Math.random()} src={dc} /></div>));
            }

            return (<HeadingTextComponent key={Math.random()} data={d} />);
          })
        }
      </div>
    );
  }

  toggleModal = (shouldShowModal) => {
    if (shouldShowModal) {
      pushToDataLayer('report', 'reportEvents', { action: 'Disclosures' });
    }
    this.setState({ shouldShowModal });
  }

  render() {
    const { data, type } = this.props;
    const { shouldShowModal } = this.state;
    if (!data || data.length === 0) return null;

    if (shouldShowModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return (
      <Grid className={'disclosure'}>
        <Grid.Column computer={2} tablet={2} mobile={12} className={'empty-grid'} />
        <Grid.Column computer={10} tablet={10} mobile={12} className={'disclosure-data-grid'}>
          <div className={'btn-div'}>
            {type === 'podcast' ?
              <a href={appsettingsVariable.PODCAST_DISCLOSURE_LINK || ''}><Button secondary content="Disclosures" /></a>
              :
              <Button secondary content="Disclosures" onClick={() => this.toggleModal(true)} />
            }
          </div>
          <Modal
            open={shouldShowModal}
            className="rl-disclosures-modal"
            id="disclosures-modal"
            closeOnEscape={true}
            dimmer={true}
            closeOnDocumentClick={true}
            role="dialog"
          >
            <Modal.Content>
              <div className={'disclosure-modal-close'}>
                <Button
                  tabIndex={0}
                  className="modal-close-icon bmo-close-btn bg-icon-props"
                  onClick={() => this.toggleModal(false)}
                  aria-label="Close Modal"
                />
              </div>
              {this.getModalContent()}
            </Modal.Content>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Disclosures;
