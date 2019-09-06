/* @flow weak */

/*
 * Component: LibrarySearchResultOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Modal, Image, Heading, Container, Button } from 'unchained-ui-react';
import { DEFAULT_PROFILE, tierImageMap } from 'constants/assets';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';
import st from 'constants/strings';
import { toShowAnalyst } from 'utils';
import {
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
} from 'store/actions';
import {
  userSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { RichText, CustomNavLink, CannabisPreviewModal } from 'components';
import './LibrarySearchResultOverlay.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LibrarySearchResultOverlay extends Component {
  props: {
    closeModal: () => void,
    isOpen: bool,
    data: {},
    canAccessContent: Boolean,
    canBookmark: Boolean,
    // analystSource: {},
    bookmarks: [],
    handleBookmarkClick: () => void,
    setProfileCompanyList: () => void,
    removeUserPreference: () => void,
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
    message: '',
    isCannabis: bool,
    isNotLibrary: bool,
    triangleImage: []
  };

  static defaultProps = {
    isOpen: false,
  };

  state = {
    showTeamMembers: false,
  }

  componentDidMount() {
    // Component ready
  }
  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('noscroll-login-tablet');
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll-login-tablet');
  }

  toggleOtherTeamMembers = () => () => {
    const { showTeamMembers } = this.state;
    this.setState({ showTeamMembers: !showTeamMembers });
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

  handleGTM = (data) => {
    if (data) {
      const gtmData = {
        'BMO Analyst Name': data.display_name,
        'BMO Analyst Job Title': data.position,
        'Follow Type': '',
        'Follow Details': '',
      };
      pushToDataLayer('library', 'libraryFollowClick', { label: data.display_name, data: gtmData });
    }
  }

  followAction = (data) => {
    const { setProfileCompanyList, removeUserPreference } = this.props;
    const follow = this.isFollowed(data);
    if (!data) return;
    if (follow) {
      removeUserPreference({ analysts: [parseInt(data.person_id, 10)] });
    } else {
      setProfileCompanyList({ analysts: [parseInt(data.person_id, 10)] });
    }
    this.handleGTM(data);
  }

  isFollowed = (data) => {
    const { userProfilePreferences } = this.props;
    let analystArr = [];
    try {
      analystArr = userProfilePreferences.user_pref.analysts;
    } catch(e) { // eslint-disable-line
      analystArr = [];
    }
    const follow = analystArr.filter(analyst => analyst.id === parseInt(data.person_id, 10)).length > 0;
    return follow;
  }

  render() {
    const { isOpen, data, canAccessContent, bookmarks, canBookmark, message, isCannabis, isNotLibrary, triangleImage } = this.props;//eslint-disable-line
    // const { showTeamMembers } = this.state;
    let showAnalystInfo = false;
    if (!isNotLibrary) {
      showAnalystInfo = data.active === true && (!data.doNotSyncToRds) && toShowAnalyst(data) && canAccessContent;
    }
    return (
      <div className="library-search-result-overlay">
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
              {!isCannabis ?
                <div className="library-overlay-top-section">
                  <div className={'analyst-info-wrap'}>
                    <NavLink
                      to={showAnalystInfo ? `${config.analystURLPrefix}/${data.analyst_code}/` : '#'}
                    >
                      <Image shape={'circular'} className="analyst-profile-image" alt={data.analysts_name} src={data.analysts_avatar || DEFAULT_PROFILE.img} />
                    </NavLink>
                    <div className={'left-section'}>
                      <div className={'analyst-and-ticker'}>
                        <Container
                          as={showAnalystInfo ? NavLink : 'div'}
                          to={showAnalystInfo ? `${config.analystURLPrefix}/${data.analyst_code}/` : ''}
                        >
                          <Heading as={'h4'} className={'analyst-name'} content={data.analysts_name} />
                          <Heading as={'h4'} className={'analyst-position'} content={data.position || ''} />
                        </Container>
                        {data.analyst_display_title && <div className="author-designation">{data.analyst_display_title}</div>}
                        {data.analyst_division_name && <div className="author-designation">{data.analyst_division_name}</div>}
                      </div>
                      {
                        showAnalystInfo ?
                          <div className={'analyst-contact-div'}>
                            <a href={`mailto:${data.email}`}><Button className={'forgot-mail-icon'} title={data.email} /></a>
                            <a href={`tel:${data.phone}`}><Button className={'forgot-phone-icon'} title={data.phone} /></a>
                            <Button
                              className={`${this.isFollowed(data) ? 'follow-contact selected' : 'follow-contact'}`}
                              onClick={() => this.followAction(data)}
                              title={this.isFollowed(data) ? st.unfollow : st.follow}
                            >
                              <span>{this.isFollowed(data) ? 'Unfollow' : 'Follow'}</span>
                            </Button>
                          </div>
                          : null
                      }
                    </div>
                  </div>
                </div>
                :
                <CannabisPreviewModal message={message} />
              }
            </Container>
            {!isCannabis &&
              <Container className="library-overlay-bottom">
                <div className="library-overlay-bottom-section">
                  <div className="date-ticker">
                    <span className="date">{data.publisherDate}</span>
                  </div>
                  <div className="title-and-bookmark">
                    <div className="title">
                      <Heading as={'h4'}>{data.title}</Heading>
                    </div>
                    <div className={'user-preferences'}>
                      {data.historicalPdf &&
                        <CustomNavLink
                          className="pdf-icon"
                          to={data.historicalPdf ? '' : `/research/${data.productID}/`}
                          isHistoricalPublication={data.historicalPdf}
                          radarLink={data.historicalPdf ? data.radarLink : ''}
                          key={data.publicationID}
                        >
                          <div className="pdf-image user-pref-icon" />
                          <div className={'pdf-size'} />
                        </CustomNavLink>
                      }
                      {(data.researchType === 'Videocast' || data.researchType === 'Podcast') &&
                        <div className={`${data.researchType} g user-pref-icon`} title={data.researchType} />
                      }
                      {
                        canAccessContent && canBookmark ?
                          <div className={'bookmark-button'}>
                            <Button
                              tabIndex={0}
                              onClick={() => this.handleBookmarkClick()}
                              className={`bookmark-link blue-bookmark bg-icon-props ${bookmarks.indexOf(data.publicationID) > -1 ? 'selected' : ''}`}
                            />
                          </div>
                          : null
                      }
                    </div>
                  </div>
                  {triangleImage ?
                    <div className={'triangle-image'}>
                      <Image alt={'Brand-triabgle'} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-licon'} />
                      <span className={'brand-text'}>{triangleImage[1]}</span>
                    </div>
                    :
                    null
                  }
                  <div className="comment-section">
                    {data.keyPointsDetails &&
                      <div className="comment">
                        <span className="comment-heading">{'Key Points'}:</span>
                        <div className="comment-description"><RichText richText={data.keyPointsDetails} /></div>
                      </div>
                    }
                    {data.bottomLineDetails &&
                      <div className="comment">
                        <span className="comment-heading">{'Bottom Line'}:</span>
                        <div className="comment-description"><RichText richText={data.bottomLineDetails} /></div>
                      </div>
                    }
                  </div>
                </div>
                <Button secondary className={'read-more-button'} onClick={document.body.classList.remove('noscroll-login')}>
                  <CustomNavLink
                    className="publication-link"
                    to={data.historicalPdf ? '' : `/research/${data.productID}/`}
                    isHistoricalPublication={data.historicalPdf}
                    radarLink={data.historicalPdf ? data.radarLink : ''}
                    key={data.publicationID}
                  >
                    Read Full Version
                  </CustomNavLink>
                </Button>
              </Container>
            }
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
});

const mapDispatchToProps = (dispatch) => ({
  setProfileCompanyList: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeUserPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LibrarySearchResultOverlay);

