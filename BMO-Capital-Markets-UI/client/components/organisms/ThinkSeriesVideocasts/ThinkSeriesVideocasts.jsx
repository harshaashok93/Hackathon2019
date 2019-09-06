/* @flow weak */

/*
 * Component: ThinkSeriesVideocasts
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { VideocastsCard } from 'components';
import { Grid, Button } from 'unchained-ui-react';

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
import './ThinkSeriesVideocasts.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ThinkSeriesVideocasts extends Component {
  props: {
    videocats: [],
    profile: {},
    updateProfileBookmarksData: () => void,
    removeProfileBookmarksData: () => void,
    bookmarks: [],
    total: number,
    getResult: () => void,
    isLoading: bool,
  }

  static defaultProps = {
  };

  state = {
    rows: 2,
    page: 1,
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
      videocasts: {
        page: page + 1,
        rows,
      },
    };
    this.setState({ page: page + 1 });
    this.props.getResult(reqParameter);
  }

  componentDidMount() {
    // Component ready
  }

  render() {
    const { videocats, profile, bookmarks, total, isLoading } = this.props; //eslint-disable-line
    const { page } = this.state;
    const canBookmark = profile && profile.can_access_content && profile.can_bookmark_content;
    return (
      <div className="think-series-videocasts">
        {!isLoading || page > 1 ?
          <div>
            <div className="video-castcard">
              <Grid computer={4} mobile={1} key={Math.random()}>
                <Grid.Row>
                  {
                    videocats.map((data) => {
                      const videocastsInfo = {
                        date: (data.publisher_date || ''),
                        name: ((data.analyst && data.analyst.display_name) || ''),
                        title: (data.title || ''),
                        productId: (data.product_id || ''),
                        historicalPublication: data.historical_publication || '',
                        radarLink: data.radar_link || '',
                        playId: (data.product_id || ''),
                        publicationID: (data._id || ''),
                        active: ((data.analyst && data.analyst.active) || false),
                        role: ((data.analyst && data.analyst.role) || ''),
                        roles: ((data.analyst && data.analyst.roles) || ''),
                        do_not_sync_to_rds: ((data.analyst && data.analyst.do_not_sync_to_rds) || ''),
                        position: ((data.analyst && data.analyst.position) || ''),
                        client_code: ((data.analyst && data.analyst.client_code) || '')
                      };
                      return (
                        <Grid.Column key={Math.random()} className={'cards videocast-column'} computer={4} tablet={6} mobile={12}>
                          <VideocastsCard
                            data={videocastsInfo}
                            isLoggedIn={true}
                            canBookmark={canBookmark}
                            profile={profile}
                            bookmarks={bookmarks || []}
                            bookmarkClick={this.bookmarkClick()}
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
              { !isLoading && ((videocats && videocats.length) < total) ?
                <Button className={'linkBtn bmo_chevron bottom'} content={'Show More'} onClick={this.onShowMore()} />
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
  videocats: thinkseriesSelector.getVideocats(state),
  profile: userSelector.getUserProfileInfo(state),
  bookmarks: userSelector.getBookmarkIds(state),
  total: thinkseriesSelector.getVideocastTotal(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(ThinkSeriesVideocasts);
