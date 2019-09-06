/* @flow weak */

/*
 * Component: ThinkSeriesFlashes
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { PublicationCardComponent } from 'components';
import { Grid, Button } from 'unchained-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  GET_THINK_SERIES_RESULTS,
  UPDATE_PROFILE_BOOKMARKS_DATA,
  REMOVE_PROFILE_BOOKMARKS_DATA
} from 'store/actions';

import {
  thinkseriesSelector,
  userSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ThinkSeriesFlashes.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ThinkSeriesFlashes extends Component {
  props: {
    flashes: [],
    profile: {},
    updateProfileBookmarksData: () => void,
    removeProfileBookmarksData: () => void,
    bookmarks: [],
    total: number,
    getResult: () => void,
    isLoggedIn: bool,
    isLoading: bool,
  };

  static defaultProps = {
  };

  state = {
    rows: 2,
    page: 1,
  }

  componentDidMount() {
    // Component ready
  }

  handleBookmarkClick = ({ publicationID }) => {
    const { bookmarks } = this.props;
    if (bookmarks.indexOf(publicationID) === -1) {
      this.props.updateProfileBookmarksData({ id: publicationID }, bookmarks);
    } else {
      this.props.removeProfileBookmarksData({ id: publicationID }, bookmarks);
    }
  }

  bookmarkClick = () => (data) => {
    this.handleBookmarkClick(data);
  }

  onShowMore = () => () => {
    const { rows, page } = this.state;
    const reqParameter = {
      flashes: {
        page: page + 1,
        rows,
      },
    };
    this.setState({ page: page + 1 });
    this.props.getResult(reqParameter);
  }

  render() {
    const { flashes, bookmarks, profile, total, isLoggedIn, isLoading } = this.props; //eslint-disable-line
    const { page } = this.state;
    const canBookmark = profile && profile.can_access_content && profile.can_bookmark_content;
    const canAccessContent = isLoggedIn && profile.can_access_content;
    return (
      <div className="think-series-flashes">
        {!isLoading || page > 1 ?
          <div>
            <div className="video-castcard">
              <Grid computer={4} mobile={1} key={Math.random()}>
                <Grid.Row>
                  {
                    flashes.map((data) => {
                      const publicationInfo = {
                        analysts_name: (data.analyst ? (`${data.analyst.first_name || ''} ${data.analyst.middle_name || ''} ${data.analyst.last_name || ''}`) : ''),
                        publisherDate: (moment(data.publisher_date).format('MM/DD/YYYY') || ''),
                        description: ((data.company && data.company.description) || ''),
                        analysts_avatar: ((data.analyst && data.analyst.avatar_url) || ''),
                        active: ((data.analyst && data.analyst.active) || false),
                        role: ((data.analyst && data.analyst.role) || ''),
                        roles: ((data.analyst && data.analyst.roles) || ''),
                        do_not_sync_to_rds: ((data.analyst && data.analyst.do_not_sync_to_rds) || ''),
                        client_code: ((data.analyst && data.analyst.client_code) || ''),
                        position: ((data.analyst && data.analyst.position) || ''),
                        designation: ((data.analyst && data.analyst.designation) || ''),
                        historicalPdf: (data.historical_publication || ''),
                        title: (data.title || ''),
                        company: ((data.company && data.company.name) || ''),
                        ticker: ((data.company && data.company.ticker) || ''),
                        radarLink: (data.radar_link || ''),
                        productID: data.product_id || '',
                        email: ((data.analyst && data.analyst.email) || ''),
                        phone: ((data.analyst && data.analyst.phone) || ''),
                        person_id: ((data.analyst && data.analyst.person_id) || ''),
                        bottomLine: (data.bottom_line || data.key_points || ''),
                        keyPointsDetails: (data.key_points || ''),
                        bottomLineDetails: (data.bottomLine || ''),
                        publicationID: (data._id || ''),
                        isCompanyActive: (data.company ? data.company.active === true : false),
                      };
                      return (
                        <Grid.Column key={Math.random()} className={'cards videocast-column'} computer={4} tablet={6} mobile={12}>
                          <PublicationCardComponent
                            data={publicationInfo}
                            isLoggedIn={isLoggedIn}
                            bookmarks={bookmarks || []}
                            bookmarkClick={this.bookmarkClick()}
                            canBookmark={canBookmark}
                            canAccessContent={canAccessContent}
                          />
                        </Grid.Column>
                      );
                    })
                  }
                </Grid.Row>
              </Grid>
            </div>
            <div className={'show-more'}>
              {
                isLoading && (
                  <div className="load-more-button"><div className="load-more">{'Loading...'}</div></div>
                )
              }
              { !isLoading && ((flashes && flashes.length) < total) ?
                <Button onClick={this.onShowMore()} className="linkBtn bmo_chevron bottom">{'Show More'}</Button>
                : null
              }
            </div>
          </div>
          :
          null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  flashes: thinkseriesSelector.getFlashes(state),
  profile: userSelector.getUserProfileInfo(state),
  bookmarks: userSelector.getBookmarkIds(state),
  total: thinkseriesSelector.getFlashTotal(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
  isLoading: thinkseriesSelector.getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResult: async (reqParameter) => {
    dispatch(GET_THINK_SERIES_RESULTS(reqParameter));
  },
  updateProfileBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  removeProfileBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ThinkSeriesFlashes);
