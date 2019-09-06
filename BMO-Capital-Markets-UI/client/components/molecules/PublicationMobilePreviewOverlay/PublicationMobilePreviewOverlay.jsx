/* @flow weak */

/*
 * Component: PublicationMobilePreviewOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Modal, Heading, Container, Button } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { RichText } from 'components';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './PublicationMobilePreviewOverlay.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class PublicationMobilePreviewOverlay extends Component {
  props: {
    closeModal: () => void,
    isOpen: bool,
    data: {},
    isLoggedIn: Boolean,
    handleBookmarkClick: () => void,
    bookmarks: [],
    canBookmark: bool
  };

  static defaultProps = {
    isOpen: false,
  };

  state = {
    // Initialize state here
  }

  componentDidMount() {
    // Component ready
  }

  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
  }

  handleClose = () => {
    this.props.closeModal();
  }

  handleBookmarkClick = () => {
    const { handleBookmarkClick } = this.props;
    if (handleBookmarkClick) {
      handleBookmarkClick();
    }
  }

  render() {
    const { isOpen, data, isLoggedIn, bookmarks, canBookmark } = this.props;
    return (
      <div className="publication-mobile-preview-overlay">
        <Modal
          open={isOpen}
          className={'publication-mobile-preview-overlay'}
          onMount={this.hideBodyScroll()}
          onUnmount={this.showBodyScroll()}
        >
          <Modal.Content>
            <Container className="library-overlay-bottom">
              <div className="close-image">
                <Button tabIndex={0} className="close-search-overlay bmo-close-btn bg-icon-props" onClick={() => this.handleClose()} />
              </div>
              <div className="library-overlay-bottom-section">
                <div className="date-ticker">
                  <span className="date">{data.publisherDate}</span>
                </div>
                <div className="title-and-bookmark">
                  <div className="title">
                    <Heading as={'h4'}>{data.title}</Heading>
                  </div>
                  <div className={'user-preferences'}>
                    {isLoggedIn && canBookmark &&
                      <div className={'bookmark-button'}>
                        <Button
                          tabIndex={0}
                          onClick={() => this.handleBookmarkClick()}
                          className={`bookmark-link blue-bookmark bg-icon-props ${bookmarks.indexOf(data.product_id) > -1 ? 'selected' : ''}`}
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className="comment-section">
                  {data.key_points &&
                    <div className="comment">
                      <span className="comment-heading">{'Key Points'}:</span>
                      <div className="comment-description"><RichText richText={data.key_points} /></div>
                    </div>
                  }
                  {data.bottom_line &&
                    <div className="comment">
                      <span className="comment-heading">{'Bottom Line'}:</span>
                      <div className="comment-description"><RichText richText={data.bottom_line} /></div>
                    </div>
                  }
                </div>
              </div>
              <Button secondary className={'read-more-button'}>
                <NavLink className="publication-link" to={'/'}>
                  Read Full Version
                </NavLink>
              </Button>
            </Container>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default PublicationMobilePreviewOverlay;
