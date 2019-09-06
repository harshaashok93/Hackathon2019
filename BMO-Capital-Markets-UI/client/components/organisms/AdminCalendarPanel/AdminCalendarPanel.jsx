/* @flow weak */

/*
 * Component: AdminCalendarPanel
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { DatePicker, EventCalendarCard, EventCard } from 'components';
import moment from 'moment';
import { Dropdown, Button, Heading, Loader } from 'unchained-ui-react';
import './AdminCalendarPanel.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminCalendarPanel extends Component {
  props: {
    sfCalendarEvents: [],
    sfLocationDropdown: [],
    sfEventDropdown: [],
    publishedAdminEvents: [],
    publishEvents: () => void,
    getPublishedData: () => void,
    getSfEventsdata: () => void,
    sfdataIsLoading: bool,
    cmsdataIsLoading: bool,
    onChangeFilter: () => void,
    refreshCMSEventsForm: () => void,
    sfFromdate: '',
    sfTodate: '',
    cmsFromdate: '',
    cmsTodate: '',
  };

  static defaultProps = {
  };

  state = {
    fromDate: moment().subtract(180, 'days').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    currentTab: 'salesforce',
    selectedType: '',
    selectedLocation: '',
    sfUpto: 20,
    range: 20,
    sfNoMore: false,
    cmsUpto: 20,
    cmsNoMore: false,
  }

  componentDidMount() {
    // Component ready
  }

  componentWillReceiveProps(nextProps) {
    const { currentTab } = this.state;
    const { sfFromdate, sfTodate, cmsFromdate, cmsTodate } = nextProps;
    switch (currentTab) {
      case 'salesforce':
        if (sfFromdate && sfTodate) {
          this.setState({ fromDate: moment(sfFromdate).format('YYYY-MM-DD'), toDate: moment(sfTodate).format('YYYY-MM-DD') });
        }
        break;
      case 'cms' :
        if (cmsFromdate && cmsTodate) {
          this.setState({ fromDate: moment(cmsFromdate).format('YYYY-MM-DD'), toDate: moment(cmsTodate).format('YYYY-MM-DD') });
        }
        break;
      default: break;
    }
  }

  onEvenetTypeDropDownChange = () => (e, val) => {
    const { fromDate, toDate, selectedLocation, currentTab } = this.state;
    const selectValue = (val.value === 'All' ? '' : val.value);
    const reqPara = {
      event_date__gte: fromDate,
      event_date__lte: toDate,
      event_type: selectValue,
      location: selectedLocation
    };
    this.props.onChangeFilter(reqPara, currentTab);
    this.setState({ selectedType: selectValue });
  }

  onLocationDropDownChange = () => (e, val) => {
    const { fromDate, toDate, selectedType, currentTab } = this.state;
    const selectValue = (val.value === 'All' ? '' : val.value);
    const reqPara = {
      event_date__gte: fromDate,
      event_date__lte: toDate,
      event_type: selectedType,
      location: selectValue,
    };
    this.props.onChangeFilter(reqPara, currentTab);
    this.setState({ selectedLocation: selectValue });
  }

  publishEventByAdmin = () => (data) => {
    this.props.publishEvents(data);
  }

  handleDateChange = (key, value) => {
    const { fromDate, toDate, selectedType, selectedLocation, currentTab } = this.state;
    switch (key) {
      case 'fromDate': {
        const reqPara = {
          event_date__gte: moment(value).format('YYYY-MM-DD'),
          event_date__lte: toDate,
          event_type: selectedType,
          location: selectedLocation,
        };
        this.props.onChangeFilter(reqPara, currentTab);
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
        this.props.onChangeFilter(reqPara, currentTab);
        this.setState({ toDate: moment(value).format('YYYY-MM-DD') });
        break;
      }
      default: break;
    }
  }

  changeTab = (tabName) => () => {
    if (tabName === 'cms') {
      this.props.getPublishedData();
      this.setState({
        selectedLocation: '',
        selectedType: ''
      });
    } else {
      this.props.getSfEventsdata();
      this.setState({
        selectedLocation: '',
        selectedType: ''
      });
    }
    this.setState({ currentTab: tabName });
  }

  refreshForm = () => () => {
    this.props.refreshCMSEventsForm();
  }

  renderSFEvents = (sfCalendarEvents) => {
    const ResultRow = [];
    const { sfUpto } = this.state;
    if (sfCalendarEvents.length) {
      for (let i = 0; i < sfUpto && i < sfCalendarEvents.length; i += 1) {
        ResultRow.push(<EventCalendarCard data={sfCalendarEvents[i]} publishEvent={this.publishEventByAdmin()} />);
      }
      return ResultRow;
    }
    return <div className={'no-results-found'}>No Results Found</div>;
  }

  renderCMSEvents = (publishedAdminEvents) => {
    const ResultRow = [];
    const { cmsUpto } = this.state;
    if (publishedAdminEvents.length) {
      for (let i = 0; i < cmsUpto && i < publishedAdminEvents.length; i += 1) {
        const eventInformation = {
          date: moment(publishedAdminEvents[i].event_date).format('MM/DD/YYYY'),
          title: publishedAdminEvents[i].event_title,
          type: publishedAdminEvents[i].event_type,
          place: publishedAdminEvents[i].location,
          presenter: publishedAdminEvents[i].presenter,
          eventId: publishedAdminEvents[i].id,
          eventCardImage: publishedAdminEvents[i].event_logo || '',
        };
        ResultRow.push(<EventCard eventInformation={eventInformation} pageName={'admin-event-card'} sfId={publishedAdminEvents[i].salesforce_id} refreshPublishedEvents={this.refreshForm()} index={i} />);
      }
      return ResultRow;
    }
    return <div className={'no-results-found'}>No Results Found</div>;
  }

  showMore = (len) => () => {
    const { sfUpto, range } = this.state;
    if (sfUpto < len) {
      this.setState({ sfUpto: (sfUpto + range) });
    } else {
      this.setState({ sfNoMore: true });
    }
  }

  cmsShowMore = (len) => () => {
    const { cmsUpto, range } = this.state;
    if (cmsUpto < len) {
      this.setState({ cmsUpto: (cmsUpto + range) });
    } else {
      this.setState({ cmsNoMore: true });
    }
  }

  render() {
    const { fromDate, toDate, currentTab, selectedType, selectedLocation, sfUpto, cmsUpto } = this.state;
    const { sfCalendarEvents, sfLocationDropdown, sfEventDropdown, publishedAdminEvents, sfdataIsLoading, cmsdataIsLoading } = this.props;//eslint-disable-line

    const targetToDate = `${toDate}T00:00:00`;
    const targetFromDate = `${fromDate}T00:00:00`;

    return (
      <div className="admin-calendar-panel">
        <div className={'calendar-top-sectoion'}>
          <Heading as={'h2'} className={'calendar-page-heading'} content={'Event Calendar'} />
          <div className={'sf-cms'}>
            <Button className={`${currentTab === 'salesforce' ? 'current' : ''} linkBtn sales-force`} content={'Sales Force'} onClick={this.changeTab('salesforce')} />
            <Button className={`${currentTab === 'cms' ? 'current' : ''} linkBtn cms`} content={'Published to CMS'} onClick={this.changeTab('cms')} />
          </div>
          <div className={'filter'}>
            <div className={'row from-date'}>
              <DatePicker
                datePickerTitle={'From'}
                dateRange={{ maxDate: new Date(targetToDate) }}
                onDateChange={(dt) => this.handleDateChange('fromDate', dt)}
                date={targetFromDate}
              />
            </div>
            <div className={'row to-date'}>
              <DatePicker
                datePickerTitle={'To'}
                dateRange={{ minDate: new Date(targetFromDate) }}
                onDateChange={(dt) => this.handleDateChange('toDate', dt)}
                date={targetToDate}
              />
            </div>
            <div className={'row event-type'}>
              <Dropdown
                placeholder={'Event Type'}
                className={'dropdown-chevron bmo_chevron bottom'}
                search
                selection
                options={sfEventDropdown}
                onChange={this.onEvenetTypeDropDownChange()}
                value={selectedType}
                selectOnBlur={false}
              />
            </div>
            <div className={'row location-dropdown'}>
              <Dropdown
                placeholder={'Location'}
                className={'dropdown-chevron bmo_chevron bottom'}
                search
                selection
                options={sfLocationDropdown}
                onChange={this.onLocationDropDownChange()}
                value={selectedLocation}
                selectOnBlur={false}
              />
            </div>
          </div>
        </div>
        {currentTab === 'salesforce' &&
          <div className={'result-lists'}>
            {sfdataIsLoading ?
              <div className={'result-list'}><Loader active={true} content="Loading..." /></div>
              :
              this.renderSFEvents(sfCalendarEvents)
            }
            {!sfdataIsLoading && sfCalendarEvents && sfCalendarEvents.length > sfUpto ?
              <div className="show-more-btn-holder">
                <Button className="show-more-btn" onClick={this.showMore(sfCalendarEvents.length)}>
                  Show More
                  <span className="bmo_chevron bottom drop-down-indicator" />
                </Button>
              </div>
              : null
            }
          </div>
        }
        {currentTab === 'cms' &&
          <div className={'result-lists'}>
            {cmsdataIsLoading ?
              <div className={'result-list'}><Loader active={true} content="Loading..." /></div>
              :
              this.renderCMSEvents(publishedAdminEvents)
            }
            {publishedAdminEvents && publishedAdminEvents.length > cmsUpto ?
              <div className="show-more-btn-holder">
                <Button className="show-more-btn" onClick={this.cmsShowMore(publishedAdminEvents.length)}>
                  Show More
                  <span className="bmo_chevron bottom drop-down-indicator" />
                </Button>
              </div>
              : null
            }
          </div>
        }
      </div>
    );
  }
}

export default AdminCalendarPanel;
