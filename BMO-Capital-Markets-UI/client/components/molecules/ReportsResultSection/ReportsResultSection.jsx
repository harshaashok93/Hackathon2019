/* @flow weak */

/*
 * Component: ReportsResultSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Dropdown, Container, Sidebar, Menu, Button } from 'unchained-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import { DatePicker, ReportFilterResults } from 'components';
import { pushToDataLayer } from 'analytics';

import {
  SET_STRATEGY_MOBILE_LAYOUT_STATUS,
  GET_STRATEGY_DROPDOWN_RESULT_LIST,
  UPDATE_SHOW_MORE_OR_LESS_FILTER,
} from 'store/actions';
import {
  strategySelector,
  userSelector,
  librarySelector,
} from 'store/selectors';
import {
  numberWithCommas
} from 'utils';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ReportsResultSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ReportsResultSection extends Component {
  props: {
    dropDownList: [],
    filterResults: [],
    isLoggedIn: bool,
    onShowFiltersBtnClick: () => void,
    mobileLayout: bool,
    getDropDownOptionandResult: () => void,
    bookmarks: [],
    subOption: '',
    isloading: bool,
    fromDate: '',
    toDate: '',
    profile: {},
    total: number,
    isExpand: bool,
    details: bool,
    updateShowMoreOrLessFilter: () => void,
  };

  state = {
    selectedValue: '',
    calendarFromDate: '',
    calendarToDate: '',
    range: 20,
    sortBy: 'date',
    sortOrder: 'desc',
    resetSort: false,
    count: 20,
    pageNo: 0,
  };

  static defaultProps = {
  }

  makeAPICall = (fromDate, toDate, subOption, subFilter, overrideFilter) => {
    const { range, sortBy, sortOrder } = this.state;
    const { getDropDownOptionandResult } = this.props;
    const requestParameter = {
      fromDate,
      toDate,
      filter: subOption,
      from: 0,
      size: range,
      sort_by: sortBy,
      sort_type: sortOrder,
      sub_filter: subFilter,
      override_filter: overrideFilter,
    };

    getDropDownOptionandResult(requestParameter);
    this.setState({ count: 20, pageNo: 0 });
  }

  componentWillMount() {
    const { selectedValue } = this.state;
    const { fromDate, toDate, subOption } = this.props;
    this.setState({ calendarFromDate: fromDate, calendarToDate: toDate });
    this.makeAPICall(fromDate, toDate, subOption, selectedValue);
  }

  componentWillReceiveProps(nextProps) {
    const { fromDate, toDate } = this.props;
    if (nextProps.isLoggedIn && (nextProps.subOption !== this.props.subOption)) {
      this.setState({ calendarFromDate: fromDate, calendarToDate: toDate, resetSort: true, selectedValue: '' }, () => {
        this.makeAPICall(fromDate, toDate, nextProps.subOption, '');
      });
    }
  }

  applySort = () => (sortBy, sortOrder) => {
    const { calendarFromDate, calendarToDate, range, selectedValue } = this.state;
    const { subOption, getDropDownOptionandResult } = this.props;
    const requestParameter = {
      fromDate: calendarFromDate,
      toDate: calendarToDate,
      filter: subOption,
      from: 0,
      size: range,
      sort_by: sortBy,
      sort_type: sortOrder,
      sub_filter: selectedValue,
    };
    getDropDownOptionandResult(requestParameter);
    this.setState({ count: 20, pageNo: 0, sortBy, sortOrder });
  }

  closeOpenFilter = (boolVal) => () => {
    if (boolVal) {
      document.body.classList.add('noscroll');
    } else {
      document.body.classList.remove('noscroll');
    }
    this.props.onShowFiltersBtnClick(boolVal);
  }

  onDropDownChange = () => (e, val) => {
    const value = val.value;
    const { subOption } = this.props;
    const { calendarFromDate, calendarToDate } = this.state;

    let overrideFilter = '';
    val.options.map((data) => {
      if (data.value === value && data.filter) {
        overrideFilter = data.filter;
      }
    });

    pushToDataLayer('strategy', 'subCategorySelect', { label: value });
    this.setState({ selectedValue: value }, () => {
      this.makeAPICall(calendarFromDate, calendarToDate, subOption, value, overrideFilter);
    });
  }

  handleDateChange = (key, value) => {
    const { calendarFromDate, calendarToDate, selectedValue } = this.state;
    const { subOption } = this.props;
    switch (key) {
      case 'fromDate':
        this.setState({ calendarFromDate: moment(value).format('YYYY-MM-DD') });
        this.makeAPICall(moment(value).format('YYYY-MM-DD'), calendarToDate, subOption, selectedValue);
        break;
      case 'toDate':
        this.setState({ calendarToDate: moment(value).format('YYYY-MM-DD') });
        this.makeAPICall(calendarFromDate, moment(value).format('YYYY-MM-DD'), subOption, selectedValue);
        break;
      default: break;
    }
  }

  showMore = () => {
    const { calendarFromDate, calendarToDate, range, sortBy, sortOrder, pageNo, count, selectedValue } = this.state;
    const { subOption, getDropDownOptionandResult } = this.props;
    const requestParameter = {
      fromDate: calendarFromDate,
      toDate: calendarToDate,
      filter: subOption,
      from: pageNo + 1,
      size: range,
      sort_by: sortBy,
      sort_type: sortOrder,
      sub_filter: selectedValue,
    };
    this.setState({ count: count + 20, pageNo: pageNo + 1 });
    getDropDownOptionandResult(requestParameter);
  }

  renderFilter = () => {
    const strategyPlaceholder = 'Select a value';

    const { selectedValue, calendarToDate, calendarFromDate } = this.state;
    const { total, filterResults, dropDownList } = this.props;

    let selectedVal = dropDownList.length ? dropDownList[0].text : '';

    if (selectedValue) {
      dropDownList.map((data) => {
        if (data.value === selectedValue) {
          selectedVal = data.text;
        }
      });
    }

    const targetToDate = `${calendarToDate}T00:00:00`;
    const targetFromDate = `${calendarFromDate}T00:00:00`;

    return (
      <div className={'top-section'}>
        <div className={'table-result-count'}>
          {
            filterResults ?
              <div className="search-result-count">
                <span className="search-summary">{`${numberWithCommas(total)} Results`}</span>
              </div>
              :
              null
          }
        </div>
        <div className={'strategy-dropdown'}>
          <Dropdown
            options={dropDownList}
            className={'dropdown-chevron bmo_chevron bottom'}
            onChange={this.onDropDownChange()}
            placeholder={strategyPlaceholder}
            value={selectedVal}
            text={selectedVal || strategyPlaceholder}
            selectOnBlur={false}
          />
        </div>
        <div className={'strategy-date'}>
          <div className={'from-date'}>
            <DatePicker
              datePickerTitle={'From'}
              onDateChange={(dt) => this.handleDateChange('fromDate', dt)}
              date={targetFromDate}
              dateRange={{ maxDate: new Date(targetToDate) }}
            />
          </div>
          <div className={'to-date'}>
            <DatePicker
              datePickerTitle={'To'}
              onDateChange={(dt) => this.handleDateChange('toDate', dt)}
              date={targetToDate}
              dateRange={{ minDate: new Date(targetFromDate) }}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { resetSort, count, pageNo } = this.state;
    const { filterResults, isLoggedIn, mobileLayout, isloading, profile, total, isExpand, details } = this.props;

    return (
      <div className="reports-result-section">
        <Container className={mobileLayout ? 'show-layout mobile-view' : 'hide-layout mobile-view'} >
          <Sidebar animation={'slide out'} className={'side-bar'} direction="left" as={Menu} visible={true} vertical >
            <div className="close-image">
              <Button className="close bmo-close-btn" onClick={this.closeOpenFilter(false)} />
            </div>
            { this.renderFilter() }
          </Sidebar>
        </Container>
        <div className="reports-filter-top desktop-view">
          { this.renderFilter() }
        </div>
        <ReportFilterResults
          isloading={isloading}
          total={total}
          data={filterResults}
          bookmarks={this.props.bookmarks}
          isLoggedIn={isLoggedIn}
          canBookmark={profile && profile.can_access_content && profile.can_bookmark_content}
          onShowFiltersBtnClick={this.closeOpenFilter(true)}
          sortCall={this.applySort()}
          resetSort={resetSort}
          resetBackSort={() => this.setState({ resetSort: false })}
          showMoreData={this.showMore}
          count={count}
          pageNo={pageNo}
          isExpand={isExpand}
          details={details}
          updateShowMoreOrLessFilter={this.props.updateShowMoreOrLessFilter}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dropDownList: strategySelector.getDropDownList(state),
  filterResults: strategySelector.getFilterResults(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
  profile: userSelector.getUserProfileInfo(state),
  mobileLayout: strategySelector.isMobileLayout(state),
  bookmarks: userSelector.getBookmarkIds(state),
  subOption: strategySelector.getReportSubOption(state),
  isloading: strategySelector.isLoading(state),
  total: strategySelector.getTotal(state),
  isExpand: librarySelector.getShowMoreOrLess(state),
  details: librarySelector.getShowMoreOrLess(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateShowMoreOrLessFilter: () => {
    dispatch(UPDATE_SHOW_MORE_OR_LESS_FILTER());
  },
  onShowFiltersBtnClick: (boolVal) => {
    dispatch({ type: SET_STRATEGY_MOBILE_LAYOUT_STATUS, data: boolVal });
  },
  getDropDownOptionandResult: (data) => {
    dispatch(GET_STRATEGY_DROPDOWN_RESULT_LIST(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportsResultSection);
