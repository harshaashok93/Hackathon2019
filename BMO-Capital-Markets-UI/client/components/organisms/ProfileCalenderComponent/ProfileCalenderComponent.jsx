/* @flow weak */

/*
 * Component: ProfileCalenderComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { UpComingCalenderEvent } from 'components';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { connect } from 'react-redux';
import {
  GET_USER_CALENDAR_EVENTS,
  PUT_USER_CALENDAR_FILTER,
  UPDATE_PROFILE_BOOKMARKS_DATA,
  REMOVE_PROFILE_BOOKMARKS_DATA
} from 'store/actions';
import {
  userSelector,
  datepickerSelector
} from 'store/selectors';
import './ProfileCalenderComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileCalenderComponent extends Component {
  props: {
    getUserCalendarEvents: () => void,
    updateEventBookmarksData: () => void,
    removeEventBookmarksData: () => void,
    userCalendarEvents: [],
    calendarType: [],
    calendarLocation: [],
    putFilterUserCalendar: () => void,
    fromDate: '',
    eventsId: [],
    fromEventDate: '',
    toEventDate: '',
    toDate: '',
    isLoggedIn: bool,
    isUserCalendarEventsLoading: bool
  };

  static defaultProps = {
  };

  state = {
    userCalendarEvents: []
  };

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    this.props.getUserCalendarEvents();
    this.setState({ userCalendarEvents: this.props.userCalendarEvents });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ userCalendarEvents: nextProps.userCalendarEvents });
  }

  putFilterApiCall = () => (data) => {
    this.props.putFilterUserCalendar(data);
  }

  updateEventBookmarkData = () => (data) => {
    const { fromEventDate, toEventDate, eventsId } = this.props;
    const dataVal = Object.assign({}, data);
    dataVal.event_date__gte = fromEventDate;
    dataVal.event_date__lte = toEventDate;
    this.props.updateEventBookmarksData(dataVal, eventsId);
  }

  removeEventBookmarkData = () => (data) => {
    const { fromEventDate, toEventDate, eventsId } = this.props;
    const dataVal = Object.assign({}, data);
    dataVal.event_date__gte = fromEventDate;
    dataVal.event_date__lte = toEventDate;
    this.props.removeEventBookmarksData(dataVal, eventsId);
  }

  render() {
    const { calendarType, calendarLocation, fromDate, toDate, isLoggedIn, eventsId, isUserCalendarEventsLoading } = this.props;
    const { userCalendarEvents } = this.state;
    return (
      <div className="profile-landing-page">
        <div className="profile-landing-body">
          <div className="profile-calender-component profile-bottom-container">
            <UpComingCalenderEvent
              data={userCalendarEvents}
              calendarLocation={calendarLocation}
              calendarType={calendarType}
              onChangeFilter={this.putFilterApiCall()}
              fromDate={fromDate}
              toDate={toDate}
              isUserCalendarEventsLoading={isUserCalendarEventsLoading}
              isLoggedIn={isLoggedIn}
              eventBookmarkId={eventsId}
              updateEventBookmark={this.updateEventBookmarkData()}
              removeEventBookmark={this.removeEventBookmarkData()}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userCalendarEvents: userSelector.getUserEvents(state),
  calendarType: userSelector.getCalendarType(state),
  calendarLocation: userSelector.getCalendarLocation(state),
  fromDate: userSelector.getUserEventFromDate(state),
  toDate: userSelector.getUserEventToDate(state),
  fromEventDate: datepickerSelector.getFromDate(state),
  toEventDate: datepickerSelector.getToDate(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
  eventsId: userSelector.getEventsIds(state),
  isUserCalendarEventsLoading: userSelector.getIsUserCalendarEventsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getUserCalendarEvents: () => {
    dispatch(GET_USER_CALENDAR_EVENTS());
  },
  putFilterUserCalendar: (data) => {
    dispatch(PUT_USER_CALENDAR_FILTER(data));
  },
  updateEventBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('events', data, allBookmarks));
  },
  removeEventBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('events', data, allBookmarks));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCalenderComponent);
