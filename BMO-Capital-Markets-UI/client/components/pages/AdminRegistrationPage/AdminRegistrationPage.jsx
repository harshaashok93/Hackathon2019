/* @flow weak */

/*
 * Component: AdminRegistrationPage
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { AdminRegistrationPanel, AdminPageTopComponent, ThinkSeriesWrapper } from 'components';
import { StaticContentContainer } from 'containers';
import { connect } from 'react-redux';

import {
  GET_USER_MODERATION_INFORMATION,
  GET_CLIENT_LOOKUP_DATA,
  GET_USER_COUNT_ADVANCE_FILTER,
  SET_OR_CLEAR_ADVANCE_FILTER,
} from 'store/actions';
import {
  adminSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminRegistrationPage.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminRegistrationPage extends Component {
  props: {
    getUserProfilePreferences: () => void,
    getClientData: () => void,
    statusLists: [],
    userLists: [],
    clientLookUpData: [],
    isClientLookupLoading: bool,
    notificationCount: number,
    getUserCount: () => void,
    userCount: number,
    isCountLoading: bool,
    advanceFilterStatus: '',
    resetAdvanceFilterStatus: () => void,
    isAdminPageLoading: bool,
    history: {},
  };

  static defaultProps = {
  };

  state = {
    userLists: [],
    data: {
      searchData: '',
      sortValue: 'created_at',
      sortOrder: 'desc',
      filterData: ['Pending_with_access'],
      equity_access: '',
      corp_access: '',
      cannabis_access: '',
      tier1_access: '',
      tier2_access: '',
      tier3_access: '',
      region: [],
      page_number: 1,
    },
  }

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    const { data } = this.state;
    this.props.getUserProfilePreferences(data);
    this.props.getUserCount(data);
    document.title = 'Admin';
  }

  onDropDownChange = () => (Value) => {
    const { data } = this.state;
    const reqData = Object.assign({}, data);
    if (Value === 'All') {
      reqData.filterData = [];
    } else {
      reqData.filterData = [Value];
    }
    reqData.page_number = 1;
    this.setState({ data: Object.assign({}, reqData) }, () => {
      this.props.getUserProfilePreferences(reqData);
      this.props.getUserCount(reqData);
    });
  }

  serachText = () => (value) => {
    const { data } = this.state;
    const reqData = Object.assign({}, data);
    reqData.searchData = value;
    reqData.page_number = 1;
    this.setState({ data: Object.assign({}, reqData) }, () => {
      this.props.getUserProfilePreferences(reqData);
      this.props.getUserCount(reqData);
    });
  }

  columnSortApi = () => (funcParameters) => {
    const { data } = this.state;
    const reqData = Object.assign({}, data);
    reqData.sortValue = funcParameters.data;
    reqData.sortOrder = funcParameters.order;
    reqData.page_number = 1;
    this.setState({ data: Object.assign({}, reqData) }, () => {
      this.props.getUserProfilePreferences(reqData);
      this.props.getUserCount(reqData);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { userLists } = nextProps;
    this.setState({ userLists });
  }

  apiForClientLookUp = () => (email) => {
    this.props.getClientData(email);
  }

  submitAdvanceFilter = () => (type, filterData, isReset) => {
    const { data } = this.state;
    const dataVal = filterData;
    dataVal.sortValue = data.sortValue;
    dataVal.sortOrder = data.sortOrder;
    if (isReset === 'reset') {
      dataVal.searchData = '';
    } else {
      dataVal.searchData = data.searchData;
    }
    dataVal.page_number = 1;
    if (type === 'usercount') {
      this.props.getUserCount(dataVal);
    } else {
      this.setState({ data: Object.assign({}, dataVal) }, () => {
        this.props.getUserProfilePreferences(dataVal);
        this.props.getUserCount(dataVal);
      });
    }
  }

  resetAdvanceFilterStatus = () => (data) => {
    this.props.resetAdvanceFilterStatus(data);
  }

  onPageChange = () => (pageNum) => {
    const { data } = this.state;
    const reqData = Object.assign({}, data);
    reqData.page_number = pageNum;
    this.setState({ data: Object.assign({}, reqData) }, () => {
      this.props.getUserProfilePreferences(reqData);
      this.props.getUserCount(reqData);
    });
  }

  pageurlRedirectGetData = () => (propsData) => {
    this.setState({ data: Object.assign({}, propsData) }, () => {
      this.props.getUserProfilePreferences(propsData);
      this.props.getUserCount(propsData);
    });
  }

  render() {
    const {
      statusLists,
      clientLookUpData,
      isClientLookupLoading,
      notificationCount,
      isCountLoading,
      userCount,
      advanceFilterStatus,
      isAdminPageLoading,
      history,
    } = this.props;
    const { userLists } = this.state;

    return (
      <div className="admin-registration-page">
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Header' : 'CorporateDebt-Header'} />
        <ThinkSeriesWrapper />
        <AdminPageTopComponent notificationNum={notificationCount} />
        <AdminRegistrationPanel
          history={history}
          pageName={'user-accounts'}
          userLists={userLists}
          statusLists={statusLists}
          accountCounts={userCount}
          statusDropdownChange={this.onDropDownChange()}
          onEnter={this.serachText()}
          sortingApi={this.columnSortApi()}
          clientLookUpApi={this.apiForClientLookUp()}
          clientLookUpData={clientLookUpData}
          isClientLookupLoading={isClientLookupLoading}
          isCountLoading={isCountLoading}
          userCount={userCount}
          submitAdvanceFilter={this.submitAdvanceFilter()}
          advanceFilterStatus={advanceFilterStatus}
          resetAdvanceFilterStatus={this.resetAdvanceFilterStatus()}
          isAdminPageLoading={isAdminPageLoading}
          onPageChange={this.onPageChange()}
          pageurlRedirectGetData={this.pageurlRedirectGetData()}
        />
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Footer' : 'CorporateDebt-Footer'} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  statusLists: adminSelector.getStatusLists(state),
  userLists: adminSelector.getUserList(state),
  clientLookUpData: adminSelector.getClientLookUpdata(state),
  isClientLookupLoading: adminSelector.isClientLookupLoading(state),
  notificationCount: adminSelector.getUserNotificationCount(state),
  isCountLoading: adminSelector.getIscountLoading(state),
  userCount: adminSelector.getUserCount(state),
  advanceFilterStatus: adminSelector.getAdvanceFilterStatus(state),
  isAdminPageLoading: adminSelector.getIsAdminPageLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfilePreferences: (data) => {
    dispatch(GET_USER_MODERATION_INFORMATION(data));
  },
  getClientData: (email) => {
    dispatch(GET_CLIENT_LOOKUP_DATA(email));
  },

  getUserCount: (data) => {
    dispatch(GET_USER_COUNT_ADVANCE_FILTER(data));
  },

  resetAdvanceFilterStatus: (data) => {
    dispatch({ type: SET_OR_CLEAR_ADVANCE_FILTER, data });
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRegistrationPage);
