/* @flow weak */

/*
 * Component: WelcomePopupComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import Slick from 'react-slick';
import { Button, Modal, Image } from 'unchained-ui-react';
import { RichText } from 'components';
import { connect } from 'react-redux';

import {
  userSelector,
} from 'store/selectors';

import {
  SHOW_ONBOARD_SCREEN,
  CLEAR_WELCOME_POPUP
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './WelcomePopupComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class WelcomePopupComponent extends Component {
  props: {
    show: bool,
    data: [],
    profile: {
      show_welcome_overlay: bool,
      first_login: ''
    },
    showOnboardingScreen: () => void,
    clearWelcomePopup: () => void
  };

  static defaultProps = {
    show: false
  };

  state = {
    shouldShowModal: true
  };

  componentWillReceiveProps(nextProps) {
    const { profile, show } = nextProps;
    const shouldShowModal = (profile.show_welcome_overlay || show);

    this.setState({ shouldShowModal }, () => {
      if (shouldShowModal) {
        document.body.style.overflow = 'hidden';
      }
    });
  }

  hideModal = () => {
    document.body.style.overflow = '';
    this.props.showOnboardingScreen(this.props.profile.first_login);
    this.setState({ shouldShowModal: false });
    this.props.clearWelcomePopup();
  }

  getModalContent() {
    const { data } = this.props;

    const settings = {
      speed: 1000,
      arrows: data.length > 1,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: false,
      accessibility: true,
      centerMode: true,
      centerPadding: '0px 0px',
      infinite: false,
      responsive: [{
        breakpoint: 768,
        settings: {
          arrows: data.length > 1,
          swipeToSlide: true,
          centerMode: true,
          centerPadding: '0px 0px',
          slidesToShow: 1,
          infinite: false,
          slidesToScroll: 1
        }
      },
      { breakpoint: 320,
        settings: {
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    };

    return (
      <Slick {...settings}>
        {
          data.map(d => {
            const item = d.WelcomeCarouselItem;

            return (
              <div>
                <div className="imageContainer">
                  <Image alt={item.title} className="desktop" src={item.desktop_image} />
                  <Image alt={item.title} className="mobile" src={item.mobile_image} />
                </div>
                <div className="textContainer">
                  <div className="titleContainer">
                    {item.title}
                  </div>
                  <div className="descriptionContainer">
                    <RichText richText={item.description} />
                  </div>
                </div>
              </div>
            );
          })
        }
      </Slick>
    );
  }

  render() {
    const { shouldShowModal } = this.state;
    const { data } = this.props;
    const mountNode = document.getElementById('layout-container');

    if (!data || !data.length || !mountNode) return null;

    return (
      <div className="welcome-screen">
        <Modal
          open={shouldShowModal}
          className="welcome-screen-modal"
          id="welcome-screen-modal"
          mountNode={mountNode}
          closeOnEscape={true}
          onClose={this.hideModal}
          dimmer={true}
          closeOnDocumentClick={false}
        >
          <Modal.Content>
            <div className="welcome-screen-close">
              <Button
                tabIndex={0}
                className="modal-close-icon bmo-close-btn bg-icon-props"
                onClick={this.hideModal}
                aria-label="Close Modal"
              />
            </div>
            {this.getModalContent()}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  showOnboardingScreen: (data) => {
    dispatch({ type: SHOW_ONBOARD_SCREEN, data });
  },
  clearWelcomePopup: () => {
    dispatch({ type: CLEAR_WELCOME_POPUP });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePopupComponent);
