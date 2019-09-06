/* @flow weak */

/*
 * Component: FeaturedResearchMobilePopup
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Modal, Button, Heading, Image } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { RichText } from 'components';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FeaturedResearchMobilePopup.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FeaturedResearchMobilePopup extends Component {
  props: {
    isOpen: boolean,
    data: {},
    bookmarkSelectionClass: '',
    handleBookmarkClick: () => void,
    handleCloseBtnClick: () => void,
    isLoggedIn: boolean,
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
    const {
      isOpen,
      data,
      isLoggedIn,
      handleBookmarkClick,
      bookmarkSelectionClass,
      handleCloseBtnClick
    } = this.props;

    if (!data) return null;

    return (
      <Modal open={isOpen} className="featured-research-mobile-popup">
        <Modal.Content>
          <div className="featured-research-overlay-top">
            <div className="close-image">
              <Button
                onClick={() => handleCloseBtnClick()}
                tabIndex={0}
                className="close-search-overlay bmo-close-btn bg-icon-props"
              />
            </div>
            <div className="featured-research-overlay-top-section">
              <div className={'left-section'}>
                <Image className="analyst-profile-image" alt={data.analysts_name} src={data.analysts_avatar || DEFAULT_PROFILE.img} />
                <div className={'analyst-and-ticker'}>
                  <NavLink to={`${config.analystURLPrefix}/${data.analyst_code}/`}>
                    <Heading as={'h4'} className={'analyst-name'} content={data.analysts_name} />
                  </NavLink>
                </div>
              </div>
            </div>
            <div>
              <div className="detail-info">
                <div>
                  <Heading as="h4" className="subject-heading">{data.title}</Heading>
                  <div className="analyst-contact-div">
                    {
                      isLoggedIn ?
                        <Button
                          tabIndex={0}
                          onClick={() => handleBookmarkClick()}
                          className={`bookmark-link blue-bookmark bg-icon-props ${bookmarkSelectionClass}`}
                        /> :
                        null
                    }
                  </div>
                  <br className="clearBoth" />
                </div>
                <RichText className="details" richText={data.subject} />
              </div>
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default FeaturedResearchMobilePopup;
