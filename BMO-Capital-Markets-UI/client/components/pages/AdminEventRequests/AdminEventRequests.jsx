/* @flow weak */

/*
 * Component: AdminEventRequests
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { AdminRegistrationPannel, AdminPageTopComponent } from 'components';
import { StaticContentContainer } from 'containers';
import { connect } from 'react-redux';
import {
  GET_ADMIN_CALENDAR_REQUESTS,
  GET_RESULTS_ON_SEARCH,
  SORT_CALENDAR_REQUESTS_COLUMN
} from 'store/actions';
import {
  adminSelector
} from 'store/selectors';

import {
  updateStatus
} from 'api/admin';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminEventRequests.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminEventRequests extends Component {
  props: {
    getAdminEventRequests: () => void,
    statusLists: [],
    userLists: [],
    onEnterSearch: () => void,
    sortingApi: () => void,
  };

  static defaultProps = {
  };

  state = {
    userLists: [],
  }

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    this.props.getAdminEventRequests();
  }

  postUpdatedStatus = () => (data) => {
    updateStatus(data);
  }

  onDropDownChange = () => (Value) => {
    const { userLists } = this.props;
    if (Value === 'All') {
      this.setState({ userLists });
    } else {
      const filterUserList = userLists.filter(data => data.status === Value);
      this.setState({ userLists: Object.assign([], filterUserList) });
    }
  }

  serachText = () => (value) => {
    const data = {
      data: value
    };
    this.props.onEnterSearch(data);
  }

  columnSortApi = () => (data) => {
    this.props.sortingApi(data);
  }

  componentWillReceiveProps(nextProps) {
    const { userLists } = nextProps;
    this.setState({ userLists });
  }

  render() {
    const { statusLists } = this.props;
    const { userLists } = this.state;
    const acountRequestCount = 0;
    return (
      <div className="admin-event-requests">
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Header' : 'CorporateDebt-Header'} />
        <AdminPageTopComponent />
        <AdminRegistrationPannel
          pageName={'event-request'}
          userLists={userLists}
          statusLists={statusLists}
          postUpdatedStatus={this.postUpdatedStatus()}
          acountRequestCount={acountRequestCount}
          statusDropdownChange={this.onDropDownChange()}
          onEnter={this.serachText()}
          sortingApi={this.columnSortApi()}
        />
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Footer' : 'CorporateDebt-Footer'} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  statusLists: adminSelector.getRequestStatusList(state),
  userLists: adminSelector.getCalendarRequets(state),
});

const mapDispatchToProps = (dispatch) => ({
  getAdminEventRequests: () => {
    dispatch(GET_ADMIN_CALENDAR_REQUESTS());
  },
  onEnterSearch: (data) => {
    dispatch(GET_RESULTS_ON_SEARCH(data));
  },
  sortingApi: (data) => {
    dispatch(SORT_CALENDAR_REQUESTS_COLUMN(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminEventRequests);
