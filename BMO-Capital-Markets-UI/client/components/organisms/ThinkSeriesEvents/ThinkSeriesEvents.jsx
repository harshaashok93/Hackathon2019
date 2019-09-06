/* @flow weak */

/*
 * Component: ThinkSeriesEvents
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ConferenceCard } from 'components';
import { Grid, Button } from 'unchained-ui-react';

import {
  GET_THINK_SERIES_RESULTS,
  UPDATE_PROFILE_BOOKMARKS_DATA,
  REMOVE_PROFILE_BOOKMARKS_DATA,
} from 'store/actions';

import {
  thinkseriesSelector,
  userSelector,
  datepickerSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ThinkSeriesEvents.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ThinkSeriesEvents extends Component {
  props: {
    events: [],
    profile: {},
    total: number,
    fromDate: '',
    toDate: '',
    getResult: () => void,
    removeEventBookmarksData: () => void,
    updateEventBookmarksData: () => void,
    eventBookmarkId: [],
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

  updateEventBookmarkData = () => (data) => {
    const { fromDate, toDate, eventBookmarkId } = this.props;
    const dataVal = data;
    dataVal.event_date__gte = fromDate;
    dataVal.event_date__lte = toDate;
    this.props.updateEventBookmarksData(dataVal, eventBookmarkId);
  }

  removeEventBookmarkData = () => (data) => {
    const { fromDate, toDate, eventBookmarkId } = this.props;
    const dataVal = data;
    dataVal.event_date__gte = fromDate;
    dataVal.event_date__lte = toDate;
    this.props.removeEventBookmarksData(dataVal, eventBookmarkId);
  }

  onShowMore = () => () => {
    const { rows, page } = this.state;
    const reqParameter = {
      events: {
        page: page + 1,
        rows,
      },
    };
    this.setState({ page: page + 1 });
    this.props.getResult(reqParameter);
  }

  render() {
    const { events, profile, total, eventBookmarkId, isLoading } = this.props; //eslint-disable-line
    const { page } = this.state;
    const canBookmark = profile && profile.can_access_content && profile.can_bookmark_content;
    return (
      <div className="think-series-events">
        {!isLoading || page > 1 ?
          <div>
            <div className="video-castcard">
              <Grid computer={4} mobile={1} key={Math.random()}>
                <Grid.Row>
                  {
                    events.map((data) => {
                      const eventInformation = {
                        type: (data.type || 'Conference'),
                        eventCardImage: '',
                        date: (data.eventDate || ''),
                        title: (data.eventTitle || ''),
                        topic: (data.topic || 'Real Estate'),
                        place: (data.location || ''),
                        eventId: (data.eventId || ''),
                      };
                      return (
                        <Grid.Column className={'cards videocast-column'} computer={4} tablet={6} mobile={12}>
                          <ConferenceCard
                            eventInformation={eventInformation}
                            isLoggedIn={true}
                            canBookmark={canBookmark}
                            eventBookmarkId={eventBookmarkId}
                            updateBookmarksData={this.updateEventBookmarkData()}
                            removeBookmarksData={this.removeEventBookmarkData()}
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
              { !isLoading && ((events && events.length) < total) ?
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
  events: thinkseriesSelector.getEvents(state),
  profile: userSelector.getUserProfileInfo(state),
  total: thinkseriesSelector.getEventTotal(state),
  eventBookmarkId: userSelector.getEventsIds(state),
  fromDate: datepickerSelector.getFromDate(state),
  toDate: datepickerSelector.getToDate(state),
  isLoading: thinkseriesSelector.getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResult: async (reqParameter) => {
    dispatch(GET_THINK_SERIES_RESULTS(reqParameter));
  },
  updateEventBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('events', data, allBookmarks));
  },
  removeEventBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('events', data, allBookmarks));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ThinkSeriesEvents);
