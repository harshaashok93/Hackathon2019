/* @flow weak */

/*
 * Component: AdminEventCalendarPage
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { StaticContentContainer } from 'containers';
import moment from 'moment';
import { AdminCalendarPanel, AdminPageTopComponent } from 'components';
import {
  postPublishEvent
} from 'api/admin';

import { connect } from 'react-redux';
import {
  GET_ADMIN_CALENDAR_EVENTS,
  GET_ADMIN_PUBLISHED_CALENDAR_EVENTS,
  PUT_CMS_FILTER_CALL,
  PUT_SF_FILTER_CALL,

} from 'store/actions';
import {
  adminSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminEventCalendarPage.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminEventCalendarPage extends Component {
  props: {
    getAdminCalendarEvents: () => void,
    getAdminPublishedCalendarEvents: () => void,
    sfCalendarEvents: [],
    sfEventDropdown: [],
    sfLocationDropdown: [],
    publishedEvents: [],
    postPublishEvents: () => void,
    sfdataIsLoading: bool,
    cmsdataIsLoading: bool,
    makePutSFFilterCall: () => void,
    makePutCMSFilterCall: () => void,
    sfFromdate: '',
    sfTodate: '',
    cmsFromdate: '',
    cmsTodate: '',
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  }

  defaultDates = {
    from: moment().subtract(42, 'days').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  };

  componentWillMount() {
    this.props.getAdminCalendarEvents(this.defaultDates);
    document.title = 'Event Calendar';
  }

  apiToGetPublishedEvents = () => () => {
    this.props.getAdminPublishedCalendarEvents();
  }

  apiToGeSFEventsprops = () => () => {
    this.props.getAdminCalendarEvents(this.defaultDates);
  }

  filterApiCall = () => (data, tabname) => {
    if (tabname === 'salesforce') {
      this.props.makePutSFFilterCall(data);
    } else {
      this.props.makePutCMSFilterCall(data);
    }
  }

  componentDidMount() {
    // Component ready
  }
  publishEvent = () => (data) => {
    this.props.postPublishEvents(data);
  }

  refreshForm = () => () => {
    this.props.getAdminPublishedCalendarEvents();
  }

  render() {
    const { sfCalendarEvents, sfEventDropdown, sfLocationDropdown, publishedEvents, sfdataIsLoading, cmsdataIsLoading, sfFromdate, sfTodate, cmsFromdate, cmsTodate, } = this.props;
    return (
      <div className="admin-event-calendar-page">
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Header' : 'CorporateDebt-Header'} />
        <AdminPageTopComponent />
        <AdminCalendarPanel
          sfCalendarEvents={sfCalendarEvents}
          publishedAdminEvents={publishedEvents}
          sfLocationDropdown={sfLocationDropdown}
          sfEventDropdown={sfEventDropdown}
          publishEvents={this.publishEvent()}
          getPublishedData={this.apiToGetPublishedEvents()}
          getSfEventsdata={this.apiToGeSFEventsprops()}
          sfdataIsLoading={sfdataIsLoading}
          cmsdataIsLoading={cmsdataIsLoading}
          onChangeFilter={this.filterApiCall()}
          sfFromdate={sfFromdate}
          sfTodate={sfTodate}
          cmsFromdate={cmsFromdate}
          cmsTodate={cmsTodate}
          refreshCMSEventsForm={this.refreshForm()}
        />
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Footer' : 'CorporateDebt-Footer'} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sfCalendarEvents: adminSelector.getSfAdminEvents(state),
  sfEventDropdown: adminSelector.getSfEventDropdown(state),
  sfLocationDropdown: adminSelector.getSfLocationDrop(state),
  publishedEvents: adminSelector.getPublishedAdminEvents(state),
  sfdataIsLoading: adminSelector.getSfdataIsLoading(state),
  cmsdataIsLoading: adminSelector.getCmsdataIsLoading(state),
  sfFromdate: adminSelector.getSfFromDate(state),
  sfTodate: adminSelector.getSfToDate(state),
  cmsFromdate: adminSelector.getCmsFromDate(state),
  cmsTodate: adminSelector.getCmsToDate(state),
});

const mapDispatchToProps = (dispatch) => ({
  getAdminCalendarEvents: (data) => {
    dispatch(GET_ADMIN_CALENDAR_EVENTS(data));
  },
  getAdminPublishedCalendarEvents: () => {
    dispatch(GET_ADMIN_PUBLISHED_CALENDAR_EVENTS());
  },
  postPublishEvents: (data) => {
    postPublishEvent(data);
  },
  makePutCMSFilterCall: (data) => {
    dispatch(PUT_CMS_FILTER_CALL(data));
  },
  makePutSFFilterCall: (data) => {
    dispatch(PUT_SF_FILTER_CALL(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminEventCalendarPage);
