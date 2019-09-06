/* @flow weak */

/*
 * Component: StrategyVideocast
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Grid, Button, Container } from 'unchained-ui-react';
import moment from 'moment';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import st from 'constants/strings';
import { toShowAnalyst } from 'utils';
import { CannabisPreviewModal, BmoPopUp, LibrarySearchResultOverlay } from 'components';

import {
  userSelector,
  strategySelector
} from 'store/selectors';

import {
  UPDATE_PROFILE_BOOKMARKS_DATA,
  REMOVE_PROFILE_BOOKMARKS_DATA,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StrategyVideocast.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyVideocast extends Component {
  props: {
    videoResult: [],
    bookmarks: [],
    updateProfileBookmarksData: () => void,
    removeProfileBookmarksData: () => void,
    isLoggedIn: bool,
    isloading: bool,
    profile: {},
    getResults: () => void,
    total: number,
  };

  static defaultProps = {
  };

  state = {
    page: 0,
    isCannabis: false,
  };

  componentDidMount() {
    // Component ready
  }

  handleBookmarkClick = (publicationID) => {
    const { bookmarks, updateProfileBookmarksData, removeProfileBookmarksData } = this.props;
    if (bookmarks.indexOf(publicationID) === -1) {
      updateProfileBookmarksData({ id: publicationID }, bookmarks);
    } else {
      removeProfileBookmarksData({ id: publicationID }, bookmarks);
    }
  }

  partitionToGroups = (items, n) => {
    const arrays = [];
    while (items.length > 0) {
      arrays.push(items.splice(0, n));
    }
    return arrays;
  }

  onShowMore = () => {
    const { page } = this.state;
    const pageNum = page + 9;
    this.setState({ page: pageNum });
    this.props.getResults(pageNum);
  }

  closeModal = () => {
    this.setState({ isOpen: false, isCannabis: false });
  }

  opModal = (type) => {
    this.setState({ isOpen: true, isCannabis: (type === 'cannabis') });
  }

  renderBookmark = (publicationID, canBookmark) => {
    const { bookmarks, isLoggedIn } = this.props;
    if (isLoggedIn && canBookmark) {
      return (
        <div className={'book-mark'}>
          <Button
            className={`blue-bookmark ${bookmarks.indexOf(publicationID) > -1 ? 'selected' : ''}`}
            tabIndex={0}
            onClick={() => this.handleBookmarkClick(publicationID)}
            title={st.bookmark}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    const { videoResult, isloading, profile, total } = this.props;
    const { isOpen, isCannabis } = this.state;
    const canBookmark = profile && profile.can_access_content && profile.can_bookmark_content;

    if (!videoResult) return null;
    if (Object.keys(videoResult).length === 0) {
      return <div className={'no-results-found'}>No Results Found</div>;
    }
    const arrayOfGroups = this.partitionToGroups(JSON.parse(JSON.stringify(videoResult)), 3);
    return (
      <div className="video-castcard">
        <Grid computer={4} mobile={1} key={Math.random()}>
          {arrayOfGroups.map((videoGroups) => {
            return (
              <Grid.Row key={Math.random()}>
                {
                  videoGroups.map((data) => {
                    const src = data._source;
                    const publicationID = data._id;
                    if (!src) return null;
                    const date = (moment(src.publisher_date).format('MM/DD/YYYY') || '');
                    const analyst = (src.analysts && src.analysts[0]) || {};
                    const title = (src.title || '');
                    const playId = (src.product_id || src.rds_pub_id);
                    const isAnalystActive = analyst.active === true && toShowAnalyst(analyst) && (!analyst.do_not_sync_to_rds);
                    const canAccessPublication = src.can_access_publication || false;
                    const message = src.entitlement_preview_message || '';

                    return (
                      <Grid.Column key={Math.random()} className={'videocast-column'} computer={4} mobile={12}>
                        <div className={'videocast-info-card'}>
                          <div className={'videocast-info'}>
                            <div className={'date-name'}>
                              <div className={'date'}>{date}</div>
                              <Container
                                className={'name'}
                                as={isAnalystActive ? NavLink : 'div'}
                                to={isAnalystActive ? `${config.analystURLPrefix}/${analyst.client_code}` : ''}
                              >
                                {analyst.position ? `${analyst.display_name}, ${analyst.position}` : analyst.display_name}
                              </Container>
                            </div>
                            <Container
                              className={'videocast-link'}
                              as={playId ? NavLink : 'div'}
                              to={`/research/${playId}`}
                            >
                              {`Videocast: ${title}`}
                            </Container>
                          </div>
                          {canAccessPublication ?
                            this.renderBookmark(publicationID, canBookmark)
                            :
                            <Button
                              tabIndex={0}
                              className={'user-pref-icon lock-icon'}
                              // onClick={() => this.opModal('cannabis')}
                            >
                              <BmoPopUp
                                debug={false}
                                showOnClick={false}
                                showInToggleMode={true}
                                rightPosBuff={30}
                                hideController={'hover'}
                                direction="horizontal-mid"
                                strictDirection="right"
                                leftBuff={20}
                                topBuff={20}
                              >
                                <CannabisPreviewModal message={message} />
                              </BmoPopUp>
                            </Button>
                          }
                        </div>
                        {
                          canAccessPublication && playId ?
                            <NavLink to={`/research/${playId}`}>
                              <Button
                                secondary
                                className={'play-icon'}
                              >
                                {'Play Video'}
                              </Button>
                            </NavLink>
                            :
                            <Button
                              secondary
                              className={'grey-play-icon'}
                              // onClick={() => this.opModal('cannabis')}
                            >
                              {'Play Video'}
                              <BmoPopUp
                                debug={false}
                                showOnClick={false}
                                showInToggleMode={true}
                                rightPosBuff={30}
                                hideController={'hover'}
                                direction="horizontal-mid"
                                strictDirection="right"
                                leftBuff={20}
                                topBuff={20}
                              >
                                <CannabisPreviewModal message={message} />
                              </BmoPopUp>
                            </Button>
                        }
                        {isOpen &&
                          <LibrarySearchResultOverlay
                            isOpen={isOpen}
                            message={message}
                            isCannabis={isCannabis}
                            isNotLibrary={true}
                            closeModal={() => this.closeModal()}
                          />
                        }
                      </Grid.Column>
                    );
                  })
                }
              </Grid.Row>
            );
          })
          }
        </Grid>
        <div className={'show-more'} id={'strategy-video-load-more'}>
          {
            isloading && (
              <div className="load-more-button"><div className="load-more">{'Loading...'}</div></div>
            )
          }
          { !isloading && ((videoResult && videoResult.length) < total) ?
            <Button onClick={this.onShowMore} className="linkBtn bmo_chevron bottom">{'Show More'}</Button>
            : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  bookmarks: userSelector.getBookmarkIds(state),
  profile: userSelector.getUserProfileInfo(state),
  videoResult: strategySelector.getVideoResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateProfileBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  removeProfileBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategyVideocast);
