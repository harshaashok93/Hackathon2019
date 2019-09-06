/* @flow weak */

/*
 * Component: VideocastDetailsListing
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import {
  EVENT_CARD,
  DEFAULT_PROFILE,
  tierImageMap,
  APPLE_PODCAST_LINK_ICON,
  GOOGLE_PLAY_PODCAST_LINK_ICON,
  SPOTIFY_PODCAST_LINK_ICON,
  SOUNDCLOUD_PODCAST_LINK_ICON
} from 'constants/assets';
import { Image, Button, Heading, Modal, Container, List } from 'unchained-ui-react';
import ImageGallery from 'react-image-gallery';
import { connect } from 'react-redux';
import { appsettingsVariable } from 'constants/UnchainedVariable';
import { RichText, PublicationCardSmall } from 'components';
import { Disclosures } from 'containers/ResearchLayoutBuilder/components';
import { ResearchLayoutFilters } from 'containers';
import st from 'constants/strings';
import { NavLink } from 'react-router-dom';
import { toShowAnalyst, formatAnalystName, getTriangleImage } from 'utils';
import Plyr from 'plyr';
import {
  userSelector,
} from 'store/selectors';
import {
  REMOVE_PROFILE_BOOKMARKS_DATA,
  UPDATE_PROFILE_BOOKMARKS_DATA,
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
  GET_USER_PROFILE_PREFERENCES,
} from 'store/actions';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './VideocastDetailsListing.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class VideocastDetailsListing extends Component {
  props: {
    dispDate: '',
    allInfo: {},
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
    type: '',
    removeFollowPreference: () => void,
    updateProfileBookmarksData: () => void,
    removeProfileBookmarksData: () => void,
    getUserProfilePreferences: () => void,
    setFollowPreference: () => void,
    bookmarks: [],
    isLoggedIn: bool,
    canFollow: bool,
    isAccordionComponent: bool
  };

  static defaultProps = {
  };

  state = {
    openSlidesModal: false,
    playVideoAction: false,
    isAccordionOpen: false
  }

  removePreference = () => (id) => {
    this.props.removeFollowPreference(id);
  }

  setPreference = () => (id) => {
    this.props.setFollowPreference(id);
  }

  handleBookmarkClick = (data) => {
    const { bookmarks } = this.props;
    if (bookmarks.indexOf(data.publicationID) === -1) {
      this.props.updateProfileBookmarksData({ id: data.publicationID }, bookmarks);
    } else {
      this.props.removeProfileBookmarksData({ id: data.publicationID }, bookmarks);
    }
  }

  bookmarkClick = () => (data) => {
    this.handleBookmarkClick(data);
  }

  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.playVideoSpace);
  }

  componentWillMount() {
    const { isLoggedIn, getUserProfilePreferences, allInfo } = this.props;
    if (isLoggedIn) {
      getUserProfilePreferences();
    }
    this.setState({ allInfo });
    document.addEventListener('keydown', this.playVideoSpace);
  }

  componentWillReceiveProps(nextProps) {
    const { allInfo } = nextProps;
    this.setState({ allInfo });
  }

  playVideoSpace = (e) => {
    if (e.keyCode === 32 && document.activeElement.id !== 'search-input-text-box') {
      e.preventDefault();
      this.playVideo();
    }
  }

  openPageSlides = () => () => {
    this.setState({ openSlidesModal: true });
  }

  handleClose = () => {
    this.setState({ openSlidesModal: false });
  }

  followAction = (data) => {
    const { setFollowPreference, removeFollowPreference } = this.props;
    const follow = this.isFollowed(data);
    if (!data) return;
    if (follow) {
      removeFollowPreference({ analysts: [parseInt(data.personId, 10)] });
    } else {
      setFollowPreference({ analysts: [parseInt(data.personId, 10)] });
    }
  }

  isFollowed = (data) => {
    const { userProfilePreferences } = this.props;
    let analystArr = [];
    try {
      analystArr = userProfilePreferences.user_pref.analysts;
    } catch(e) { // eslint-disable-line
      analystArr = [];
    }
    const follow = analystArr.filter(analyst => analyst.id === parseInt(data.personId, 10)).length > 0;
    return follow;
  }

  handleAccordionClick = () => {
    const { isAccordionOpen } = this.state;
    this.setState({ isAccordionOpen: !isAccordionOpen });
  }

  renderAnalystsDatails = (analyst, isLoggedIn) => {
    const { canFollow, isAccordionComponent } = this.props;
    const { isAccordionOpen } = this.state;
    const analystData = {
      ...analyst,
      client_code: analyst.clientCode,
    };
    const isActive = (analyst.active === true && toShowAnalyst(analystData) && (!analyst.doNotSyncToRds));
    const analystName = formatAnalystName(
      analyst.firstName || analyst.displayName,
      analyst.middleName,
      analyst.lastName
    );
    return (
      <div className={`author-details deskTop ${isAccordionComponent ? 'accordion-border' : ''}`}>
        {!isAccordionComponent ?
          <div className={'profile'}>
            <Container
              as={isActive ? NavLink : 'div'}
              to={(isActive && analyst.clientCode) ? `${config.analystURLPrefix}/${analyst.clientCode}` : ''}
            >
              <Image shape={'circular'} src={analyst.avatarUrl || DEFAULT_PROFILE.img} alt={'profile-image'} />
            </Container>
          </div> : null
        }
        <div className={`author-details ${isAccordionComponent && isAccordionOpen ? 'accordion-open-container' : ''}${isAccordionComponent && !isAccordionOpen ? 'accordion-closed-container' : ''}`}>
          <Container
            className="analystsLink"
            as={isActive ? NavLink : 'div'}
            to={(isActive && analyst.clientCode) ? `${config.analystURLPrefix}/${analyst.clientCode}` : ''}
          >
            <span className={'row'}>{analyst.position ? `${analystName}, ${analyst.position}` : analystName}</span>
          </Container>
          {
            !isAccordionComponent || (isAccordionComponent && isAccordionOpen) ?
              <div>
                <span className={'row'}>{analyst.displayTitle || ''}</span>
                <span className={'row'}>{analyst.divisionName || ''}</span>
                <div className={`preferences ${isAccordionComponent && isAccordionOpen ? 'preferences-mobile-view-padding' : ''}`}>
                  {
                    analyst.email && isLoggedIn &&
                    <a href={`mailto:${analyst.email}`}><Button className={'forgot-mail-icon'} title={analyst.email} /></a>
                  }
                  {
                    analyst.phone && isLoggedIn &&
                    <a href={`tel:${analyst.phone}`}><Button className={'forgot-phone-icon'} title={analyst.phone} /></a>
                  }
                  {analyst.personId && isLoggedIn && canFollow &&
                    <Button
                      className={`${this.isFollowed(analyst) ? 'follow-contact selected' : 'follow-contact'}`}
                      onClick={() => this.followAction(analyst)}
                      title={this.isFollowed(analyst) ? st.unfollow : st.follow}
                    >
                      <span>{this.isFollowed(analyst) ? 'Unfollow' : 'Follow'}</span>
                    </Button>
                  }
                </div>
              </div>
              : null
          }
          {isAccordionComponent &&
            <Button className={`linkBtn ${isAccordionOpen ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={() => this.handleAccordionClick()} />
          }
        </div>
      </div>
    );
  }

  renderTimezoneTitle = () => {
    const { dispDate } = this.props;
    const { allInfo } = this.state;
    const tierMap = {
      tier1: allInfo.tier_1 || false,
      tier2: allInfo.tier_2 || false,
      tier3: allInfo.tier_3 || false,
    };

    const triangleImage = getTriangleImage(tierMap);

    return (
      <div className={'time-zone-date'}>
        <span>{dispDate}</span>
        {triangleImage ?
          <div className={'triangle-image'}>
            <Image alt={'Brand-triangle'} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-licon'} />
            <span className={'brand-text'}>{triangleImage[1]}</span>
          </div>
          :
          null
        }
        <div className={'title'}>
          <Heading as={'h1'} content={allInfo.title} />
        </div>
      </div>
    );
  }

  playVideo = () => {
    const video = document.getElementById('player');
    if (!this.state.playVideoAction) {
      video.play();
    } else {
      video.pause();
    }
    this.setState({ playVideoAction: !this.state.playVideoAction });
  }

  render() {
    const { openSlidesModal, allInfo } = this.state; //eslint-disable-line
    const { isLoggedIn, bookmarks, type } = this.props;
    let src = allInfo.VideocastHighDefVideo || null;
    const isYouTubeVideo = src && src.indexOf('youtube.com') !== -1;
    if (isYouTubeVideo) {
      const videoId = src.split('=')[1];
      src = `https://www.youtube.com/embed/${videoId}`;
    }
    const analystInfo = allInfo.Analysts.data[0];
    const dataSets = allInfo.other_publications || [];
    const images = [
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
      {
        original: EVENT_CARD.img,
        thumbnail: EVENT_CARD.img,
        thumbnailLabel: 'Page 1',
      },
    ];

    if (src && !isYouTubeVideo && type === 'videocast') {
      const player = new Plyr('video',
        {
          captions: { active: false },
          tooltips: { controls: true }
        }
      );
      window.player = player;
    }

    const imageArray = [];

    if (type === 'podcast') {
      if (appsettingsVariable.APPLE_PODCAST_LINK) {
        imageArray.push({
          image: APPLE_PODCAST_LINK_ICON,
          link: appsettingsVariable.APPLE_PODCAST_LINK
        });
      }

      if (appsettingsVariable.GOOGLE_PLAY_PODCAST_LINK) {
        imageArray.push({
          image: GOOGLE_PLAY_PODCAST_LINK_ICON,
          link: appsettingsVariable.GOOGLE_PLAY_PODCAST_LINK
        });
      }

      if (appsettingsVariable.SPOTIFY_PODCAST_LINK) {
        imageArray.push({
          image: SPOTIFY_PODCAST_LINK_ICON,
          link: appsettingsVariable.SPOTIFY_PODCAST_LINK
        });
      }

      if (appsettingsVariable.SOUNDCLOUD_PODCAST_LINK) {
        imageArray.push({
          image: SOUNDCLOUD_PODCAST_LINK_ICON,
          link: appsettingsVariable.SOUNDCLOUD_PODCAST_LINK
        });
      }
    }

    return (
      <div className="videocast-details-listing" id="videocast-details-listing">
        <div className={'top-section'}>
          {this.renderTimezoneTitle()}
          {this.renderAnalystsDatails(analystInfo, isLoggedIn)}
        </div>
        <ResearchLayoutFilters productId={allInfo.productId} />
        {type === 'videocast' ?
          <div className={'video-section'}>
            {src &&
              <div>
                <div className={'video-play-div'}>
                  {/* eslint-disable */}
                  {(isYouTubeVideo && src) && <iframe className={'youtube-iframe'} src={src} />}
                  {// <video width="320" height="240" controls id="video-player" onClick={this.playVideo}>
                    //   <source src={src} type="video/mp4" />
                    //   <source src={src} type="video/ogg" />
                    //   Your browser does not support the video tag.
                    // </video>
                  }
                  {!isYouTubeVideo && src &&
                    <video tooltips='{"controls": true}' id="player" playsinline controls>
                      <source src={src} type="video/mp4" />
                      <source src={src} type="video/oog" />
                    </video>
                  }
                  {/* eslint-enable */}
                </div>
                {allInfo.ReportLink &&
                  <div className={'link-section'}>
                    <a target="_blank" href={allInfo.ReportLink}>
                      <span>{allInfo.title}</span>
                    </a>
                  </div>
                }
              </div>
            }
            {!src &&
              <div className="no-video">No video attached to this videocast</div>
            }
          </div>
          :
          <div className={' video-section podcast-main-section'}>
            <div className={'podcast-iframe'}><RichText richText={src} /></div>
            <div className={'overview-message'}>
              {allInfo.Summary && <div className={'overview-text'}>Overview</div>}
              {
                allInfo.Summary &&
                <div className={'description'}>
                  <RichText richText={allInfo.Summary} />
                </div>
              }
              <div>
                {
                  allInfo.ReportLink &&
                  <a target="_blank" href={allInfo.ReportLink}>
                    <div className={'report-link'}>{allInfo.title}</div>
                  </a>
                }
              </div>
            </div>
            <div className={'subscribe-section'}>
              <div className={'heading'}>Subscribe</div>
              <div className={'description'}>{appsettingsVariable.PODCAST_SUBSCRIBE_DESCRIPTION || ''}</div>
              <div className={'subscribe-links'}>
                {imageArray.map((data) => {
                  return (
                    <div className={'each-link'}>
                      <a
                        href={data.link}
                        className="each-link"
                        target="_blank"
                      >
                        <Image src={data.image.img} alt={data.image.alt} />
                      </a>
                    </div>
                  );
                })
                }
              </div>
            </div>
            <Disclosures data={allInfo.Disclosures} type={type} />
          </div>
        }
        <div className={'video-listing'}>
          {dataSets.length ? <div className={'other-related-publication'}>{`Related ${type === 'podcast' ? 'Podcasts' : 'Videocasts'}`}</div> : null }
          {dataSets.length ?
            <List className={'result-cards'}>
              {
                dataSets && dataSets.map((publicationCard) => {
                  return (
                    <List.Item key={publicationCard._source.productID}>
                      <PublicationCardSmall
                        bookmarks={bookmarks}
                        data={publicationCard}
                        isLoggedIn={isLoggedIn}
                        parentComponent={'Strategy'}
                      />
                    </List.Item>
                  );
                })
              }
            </List>
            :
            null
          }
        </div>
        <Modal
          open={openSlidesModal}
          className={'publication-page-modal'}
          onMount={this.hideBodyScroll()}
          onUnmount={this.showBodyScroll()}
        >
          <Modal.Content>
            <div className="analysts-listing-overlay">
              <div className="close-button-bar">
                <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={this.handleClose} />
              </div>
              <div className={'top-section'}>
                {this.renderTimezoneTitle()}
                {this.renderAnalystsDatails(analystInfo, isLoggedIn)}
              </div>
              <div className={'slideshow'}>
                <ImageGallery
                  items={images}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  originalClass={'original-class'}
                />
              </div>
            </div>
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
  updateProfileBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  removeProfileBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  setFollowPreference: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeFollowPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  },
  getUserProfilePreferences: () => {
    dispatch(GET_USER_PROFILE_PREFERENCES());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VideocastDetailsListing);
