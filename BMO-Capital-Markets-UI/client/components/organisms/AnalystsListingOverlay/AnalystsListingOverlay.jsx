/* @flow weak */

/*
 * Component: AnalystsListingOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Modal, Image, Heading, Container, Button } from 'unchained-ui-react';
import { DEFAULT_PROFILE } from 'constants/assets';
import { NavLink } from 'react-router-dom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystsListingOverlay.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsListingOverlay extends Component {
  props: {
    closeModal: () => void,
    isOpen: bool,
    data: {},
    isLoggedIn: Boolean,
    canFollow: Boolean,
    handleGTM: () => void,
    analystFollow: Boolean,
    followAction: () => void,
  };

  static defaultProps = {
  };

  componentDidMount() {
    // Component ready
  }
  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
  }
  componentWillUnmount() {
    document.body.classList.remove('noscroll-login');
  }
  handleClose = () => {
    this.props.closeModal();
  }

  handleGTM = (triggerType) => {
    const { handleGTM, data, followAction } = this.props;
    followAction();
    if (handleGTM && triggerType) {
      handleGTM(data, triggerType);
    }
  }

  render() {
    const { isOpen, data, isLoggedIn, analystFollow, canFollow } = this.props;
    if (isOpen) {
      document.body.classList.add('noscroll-login');
    } else {
      document.body.classList.remove('noscroll-login');
    }
    return (
      <div className="analysts-listing-overlay">
        <Modal
          open={isOpen}
          className={'library-search-overlay'}
          onMount={this.hideBodyScroll()}
          onUnmount={this.showBodyScroll()}
        >
          <Modal.Content>
            <Container className="library-overlay-top">
              <div className="close-image">
                <Button tabIndex={0} className="close-search-overlay bmo-close-btn bg-icon-props" onClick={() => this.handleClose()} />
              </div>
              <div className="library-overlay-top-section">
                <div className={'analyst-info-wrap'}>
                  <NavLink
                    to={`${config.analystURLPrefix}/${data.client_code}`}
                  >
                    <Image className="analyst-profile-image" shape={'circular'} alt={data.display_name} src={data.avatar_url || DEFAULT_PROFILE.img} />
                  </NavLink>
                  <div className={'left-section'}>
                    <div className={'analyst-and-ticker'}>
                      <NavLink
                        to={`${config.analystURLPrefix}/${data.client_code}`}
                      >
                        <Heading as={'h4'} className={'analyst-name'} content={data.position ? `${data.display_name}, ${data.position}` : data.display_name} />
                      </NavLink>
                      <div className="author-designation">{(data.role) || '' }</div>
                    </div>
                    <div className={'analyst-contact-div'}>
                      <a href={`mailto:${data.email}`}><Button className={'forgot-mail-icon'} /></a>
                      <a href={`tel:${data.phone}`}><Button className={'forgot-phone-icon'} /></a>
                      {isLoggedIn && canFollow ? <Button className={`${analystFollow ? 'follow-contact selected' : 'follow-contact'}`} onClick={() => this.handleGTM('follow')}><span>{analystFollow ? 'Unfollow' : 'Follow'}</span></Button> : null}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
            <Container className="library-overlay-bottom">
              <div className="sector result-slice-cell hide-on-tab">
                {data.sectors.length !== 0 ? <Heading as={'h4'} className={'sector-name analyst-name'} content={'Sectors'} /> : ''}
                <ul>{ data.sectors.map((sector) => <li key={Math.random()}>{ sector }</li>)}</ul>
              </div>
              <Button secondary className={'read-more-button'}>
                <NavLink className="publication-link" to={`${config.analystURLPrefix}/${data.client_code}/`} onClick={() => this.handleGTM('ouranalystClick')}>
                  Read About {data.display_name}
                </NavLink>
              </Button>
            </Container>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default AnalystsListingOverlay;

