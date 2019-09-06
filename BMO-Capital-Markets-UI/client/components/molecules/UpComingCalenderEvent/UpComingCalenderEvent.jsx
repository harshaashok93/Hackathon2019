/* @flow weak */

/*
 * Component: UpComingCalenderEvent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Dropdown, Button, Loader } from 'unchained-ui-react';
import { DatePicker, EventCard } from 'components';
import moment from 'moment';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './UpComingCalenderEvent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class UpComingCalenderEvent extends Component {
  props: {
    data: [],
    calendarType: [],
    calendarLocation: [],
    onChangeFilter: () => void,
    fromDate: '',
    isLoggedIn: bool,
    eventBookmarkId: [],
    updateEventBookmark: () => void,
    removeEventBookmark: () => void,
    isUserCalendarEventsLoading: bool
  };

  static defaultProps = {
  };

  state = {
    fromDate: '',
    toDate: moment().format('YYYY-MM-DD'),
    selectedType: '',
    selectedLocation: '',
    upto: 20,
    range: 20,
    reqPara: {}
  }

  componentDidMount() {
    // Component ready
  }

  onEventTypeDropDownChange = () => (e, val) => {
    const { fromDate, toDate, selectedLocation } = this.state;
    const selectValue = (val.value === 'All' ? '' : val.value);
    const reqPara = {
      event_date__gte: fromDate,
      event_date__lte: toDate,
      event_type: selectValue,
      location: selectedLocation,
    };
    this.props.onChangeFilter(reqPara);
    this.setState({ selectedType: selectValue, reqPara });
  }

  onLocationDropDownChange = () => (e, val) => {
    const { fromDate, toDate, selectedType } = this.state;
    const selectValue = (val.value === 'All' ? '' : val.value);
    const reqPara = {
      event_date__gte: fromDate,
      event_date__lte: toDate,
      event_type: selectedType,
      location: selectValue,
    };
    this.props.onChangeFilter(reqPara);
    this.setState({ selectedLocation: selectValue, reqPara });
  }

  handleDateChange = (key, value) => {
    const { fromDate, toDate, selectedType, selectedLocation } = this.state;
    switch (key) {
      case 'fromDate': {
        const reqPara = {
          event_date__gte: moment(value).format('YYYY-MM-DD'),
          event_date__lte: toDate,
          event_type: selectedType,
          location: selectedLocation,
        };
        this.props.onChangeFilter(reqPara);
        this.setState({ fromDate: moment(value).format('YYYY-MM-DD') });
        break;
      }
      case 'toDate': {
        const reqPara = {
          event_date__gte: fromDate,
          event_date__lte: moment(value).format('YYYY-MM-DD'),
          event_type: selectedType,
          location: selectedLocation,
        };
        this.props.onChangeFilter(reqPara);
        this.setState({ toDate: moment(value).format('YYYY-MM-DD') });
        break;
      }
      default: break;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fromDate } = nextProps;
    if (fromDate) {
      this.setState({ fromDate: moment(fromDate).format('YYYY-MM-DD') });
    }
  }

  componentWillMount() {
    const { toDate } = this.state;
    const { fromDate } = this.props;
    if (fromDate && toDate) {
      const reqPara = {
        event_date__gte: moment(fromDate).format('YYYY-MM-DD'),
        event_date__lte: moment(toDate).format('YYYY-MM-DD'),
        event_type: 'All',
        location: 'All',
      };
      this.setState({ reqPara, fromDate: moment(fromDate).format('YYYY-MM-DD'), toDate: moment(toDate).format('YYYY-MM-DD') });
    } else {
      const reqPara = {
        event_date__gte: moment().subtract(180, 'days').format('YYYY-MM-DD'),
        event_date__lte: moment().format('YYYY-MM-DD'),
        event_type: 'All',
        location: 'All',
      };
      this.setState({ reqPara, fromDate: moment().subtract(180, 'days').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') });
    }
  }

  updateBookmarkdata = () => (data) => {
    this.props.updateEventBookmark(data);
  }

  removeBookmarkdata = () => (data) => {
    this.props.removeEventBookmark(data);
  }

  renderCalendarEvents = (data) => {
    const { eventBookmarkId, isUserCalendarEventsLoading } = this.props;
    const ResultRow = [];
    if (isUserCalendarEventsLoading === true) {
      return <Loader active={true} content={'Loading...'} />;
    }
    if (data && data.length) {
      for (let i = 0; i < this.state.upto && i < data.length; i += 1) {
        const eventInformation = {
          date: moment(data[i].event_date).format('MM/DD/YYYY') || '',
          title: data[i].event_title || '',
          type: data[i].event_type || '',
          place: data[i].location || '',
          presenter: data[i].presenter || '',
          eventId: data[i].id || '',
          eventCardImage: data[i].event_logo || '',
        };
        ResultRow.push(<EventCard key={Math.random()} reqPara={this.state.reqPara} eventBookmarkId={eventBookmarkId} updateBookmarksData={this.updateBookmarkdata()} removeBookmarksData={this.removeBookmarkdata()} isLoggedIn={this.props.isLoggedIn} eventInformation={eventInformation} status={data[i].user_status} sfId={data[i].salesforce_id} index={i} />);
      }
      return ResultRow;
    }
    return <div className={'no-results-found'}>No Results Found</div>;
  }

  showMore = (len) => () => {
    if (this.state.upto < len) {
      this.setState({ upto: (this.state.upto + this.state.range) });
    }
  }

  render() {
    const { data, calendarType, calendarLocation, isUserCalendarEventsLoading } = this.props;
    const { fromDate, toDate, selectedType, selectedLocation } = this.state;
    const eventTypePlaceHolder = 'Event Type';
    const calLocPlaceholder = 'Location';

    const targetToDate = `${toDate}T00:00:00`;
    const targetFromDate = `${fromDate}T00:00:00`;

    const typeText = selectedType ? calendarType.filter(t => t.value === selectedType)[0].text : eventTypePlaceHolder;
    const calLocText = selectedLocation ? calendarLocation.filter(t => t.value === selectedLocation)[0].text : calLocPlaceholder;

    return (
      <div className="up-coming-calender-event">
        <div className="filters">
          <DatePicker
            datePickerTitle="From"
            className="from-date"
            onDateChange={(dt) => this.handleDateChange('fromDate', dt)}
            date={targetFromDate}
            dateRange={{ maxDate: new Date(targetToDate) }}
          />
          <DatePicker
            datePickerTitle="To"
            className="to-date"
            onDateChange={(dt) => this.handleDateChange('toDate', dt)}
            date={targetToDate}
            dateRange={{ minDate: new Date(targetFromDate) }}
          />
          <div className="drop-downs">
            <div className="search-in-calender-box">
              <Dropdown
                className="as-search dropdown-chevron bmo_chevron bottom"
                placeholder={eventTypePlaceHolder}
                search
                selection
                options={calendarType}
                onChange={this.onEventTypeDropDownChange()}
                value={selectedType}
                text={typeText}
                selectOnBlur={false}
              />
            </div>
            <Dropdown
              className="all-event-in-calender dropdown-chevron bmo_chevron bottom"
              placeholder={calLocPlaceholder}
              selection
              search
              options={calendarLocation}
              onChange={this.onLocationDropDownChange()}
              value={selectedLocation}
              text={calLocText}
              selectOnBlur={false}
            />
          </div>
        </div>
        <div className="event-cards">
          {
            this.renderCalendarEvents(data)
          }
          { data && !isUserCalendarEventsLoading && data.length > this.state.upto ?
            <div className="show-more-btn-holder">
              <Button content="Show More" onClick={this.showMore(data.length)} className="show-more-btn dropdown-chevron bmo_chevron bottom" />
            </div>
            :
            null
          }
        </div>
      </div>
    );
  }
}

export default UpComingCalenderEvent;
