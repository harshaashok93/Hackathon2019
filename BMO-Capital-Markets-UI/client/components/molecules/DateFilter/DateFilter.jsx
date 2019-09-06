/* @flow weak */

/*
 * Component: DateFilter
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { DateFilterCard } from 'components';
import { connect } from 'react-redux';
import moment from 'moment';
import { getParameterByName, libraryURLPush, getDateRangeBasedOnUserStatus } from 'utils';
import { withRouter } from 'react-router';

import {
  datepickerSelector,
  userSelector
} from 'store/selectors';
import {
  SET_LIBRARY_DATE
} from 'store/actions';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './DateFilter.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DateFilter extends Component {
  props: {
    dateText: '',
    fromDate: '',
    toDate: '',
    setFilterDate: () => void,
    fromComponent: '',
    handleDateChange: () => void,
    history: {},
    defaultFilters: {},
    profile: {
      user_status: ''
    }
  };

  state = {
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
  }

  setDateObject(userStatus = this.props.profile.user_status) {
    let fromDate = getParameterByName('fromDate');
    let toDate = getParameterByName('toDate');
    const { defaultFilters } = this.props;

    const dateField = getDateRangeBasedOnUserStatus(userStatus, defaultFilters.date_field, true);
    if (dateField) {
      if (!fromDate) fromDate = dateField.fromDate;
      if (!toDate) toDate = dateField.toDate;
    }

    if (fromDate || toDate) {
      this.setState({ fromDate, toDate });
      this.props.setFilterDate({ fromDate, toDate });
    }
  }

  componentWillMount() {
    this.setDateObject();
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      this.setDateObject();
    });
    this.setDateObject();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentWillReceiveProps(nextProps) {
    const { profile, fromDate, toDate } = nextProps;
    if (profile && (this.props.profile.user_status !== profile.user_status)) {
      this.setDateObject(profile.user_status);
    }
    this.setState({ fromDate, toDate });
  }

  handleDateChange = (src, dt) => {
    const { fromDate, toDate, setFilterDate, fromComponent, handleDateChange } = this.props;
    const date = moment(dt).format('YYYY-MM-DD');
    const obj = {
      fromDate,
      toDate,
      [src]: date
    };
    if (fromComponent === 'bookmarks') {
      handleDateChange(src, dt);
    } else {
      setFilterDate(obj);
      pushToDataLayer('library', 'dateRangeChanged', { label: `${src === 'fromDate' ? date : fromDate} - ${src === 'toDate' ? date : toDate}` });
    }
    if (date) {
      const urlQuery = `${src}=${encodeURIComponent(date)}`;
      libraryURLPush(urlQuery);
    }
  }

  render() {
    const { dateText } = this.props;
    const { fromDate, toDate } = this.state;
    return (
      <DateFilterCard
        dateText={dateText}
        fromDate={fromDate}
        toDate={toDate}
        handleDateChange={this.handleDateChange}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  fromDate: datepickerSelector.getFromDate(state),
  toDate: datepickerSelector.getToDate(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  setFilterDate: ({ fromDate, toDate }) => {
    dispatch({ type: SET_LIBRARY_DATE, data: { fromDate, toDate } });
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DateFilter));
