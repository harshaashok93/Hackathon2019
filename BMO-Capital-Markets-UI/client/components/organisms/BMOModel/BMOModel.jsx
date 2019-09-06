/* @flow weak */

/*
 * Component: BMOModel
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Dropdown, Button } from 'unchained-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import { DatePicker, BmoModelsReportResultSection } from 'components';
import { pushToDataLayer } from 'analytics';
import { getParameterByName, numberWithCommas } from 'utils';

import {
  GET_BMO_RED_DROPDOWN_LIST,
  GET_BMO_MODEL_RESULTS,
  SET_BMO_MODELS_RESULT_LIST
} from 'store/actions';
import {
  bmomodelsSelector,
  userSelector,
  bmoredSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BMOModel.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BMOModel extends Component {
  props: {
    dropDownList: [],
    resultList: [],
    isLoggedIn: bool,
    getBmoModelDropdownOptions: () => void,
    getBmoModelResultList: () => void,
    isloading: bool,
    fromDate: '',
    toDate: '',
    apiEndPoint: '',
    total: '',
    resetData: () => void,
  };

  state = {
    sortType: 'date',
    sortOrder: 'desc',
    selectedValue: '',
    calendarFromDate: '',
    calendarToDate: '',
    resultList: [],
    pageNo: 1,
    count: 20,
    dropDownValueTextMap: {},
    dropDownList: {},
    mappingDone: false
  };

  static defaultProps = {
  }

  componentWillMount() {
    this.props.getBmoModelDropdownOptions();
    const data = {
      sort: {
        type: 'date',
        order: 'desc',
      },
      ticker: '',
      range: {
        from_date: this.props.fromDate,
        to_date: this.props.toDate,
      },
      page: 1
    };
    this.props.getBmoModelResultList(this.props.apiEndPoint, data);
    this.setState({ calendarFromDate: this.props.fromDate, calendarToDate: this.props.toDate, resultList: this.props.resultList });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({ resultList: nextProps.resultList });
    }
    if (nextProps.dropDownList && nextProps.dropDownList.coverage && !this.state.mappingDone) {
      const coverage = nextProps.dropDownList.coverage;
      const dropDownValueTextMap = {};
      coverage.map(cov => {
        dropDownValueTextMap[cov.value] = cov.text;
      });
      this.setState({ dropDownValueTextMap, dropDownList: nextProps.dropDownList, mappingDone: true }, () => {
        const companyId = parseInt(getParameterByName('searchCompId'), 10);
        if (companyId) {
          this.setState({ selectedValue: companyId }, () => this.onSubmit());
        }
      });
    }
  }

  onDropDownChange = () => (e, val) => {
    const value = val.value;
    const valueText = this.state.dropDownValueTextMap[value];
    this.setState({ selectedValue: value }, () => this.onSubmit());
    pushToDataLayer('databoutique', 'companyTickerClick', { label: valueText ? valueText.text : 'Show all' });
  }

  onSort = (type, order) => {
    this.setState({ sortType: type, sortOrder: order }, () => this.onSubmit());
  }

  onSubmit = () => {
    const { sortType, sortOrder, selectedValue, calendarFromDate, calendarToDate } = this.state;
    const requestBody = {
      sort: {
        type: sortType,
        order: sortOrder,
      },
      ticker: selectedValue === 'all' ? '' : selectedValue,
      range: {
        from_date: calendarFromDate,
        to_date: calendarToDate,
      },
      page: 1,
    };
    this.setState({ count: 20, pageNo: 1 });
    this.props.getBmoModelResultList(this.props.apiEndPoint, requestBody);
  }

  handleDateChange = (key, value) => {
    const { calendarToDate, calendarFromDate } = this.state;
    switch (key) {
      case 'fromDate':
        if (moment(value).format('YYYY-MM-DD') !== this.state.calendarFromDate) {
          this.setState({ calendarFromDate: moment(value).format('YYYY-MM-DD') }, () => this.onSubmit());
          pushToDataLayer('databoutique', 'dateRangeChanged', { label: `${moment(value).format('YYYY-MM-DD')} - ${calendarToDate}` });
        }
        break;
      case 'toDate':
        if (moment(value).format('YYYY-MM-DD') !== this.state.calendarToDate) {
          this.setState({ calendarToDate: moment(value).format('YYYY-MM-DD') }, () => this.onSubmit());
          pushToDataLayer('databoutique', 'dateRangeChanged', { label: `${calendarFromDate} - ${moment(value).format('YYYY-MM-DD')}` });
        }
        break;
      default: break;
    }
  }

  addCount = () => {
    const { getBmoModelResultList, apiEndPoint } = this.props;
    const { sortType, sortOrder, selectedValue, calendarFromDate, calendarToDate, pageNo, count } = this.state;
    const requestBody = {
      sort: {
        type: sortType,
        order: sortOrder,
      },
      ticker: selectedValue === 'all' ? '' : selectedValue,
      range: {
        from_date: calendarFromDate,
        to_date: calendarToDate,
      },
      page: pageNo + 1,
    };
    this.setState({ count: count + 20, pageNo: pageNo + 1 });
    getBmoModelResultList(apiEndPoint, requestBody);
  }

  render() {
    const { selectedValue, calendarToDate, calendarFromDate, resultList, pageNo, dropDownList } = this.state;
    const { isLoggedIn, isloading, total } = this.props;
    const selectedVal = selectedValue;
    const otherOption = dropDownList.coverage ? dropDownList.coverage : [];
    const dropdownOptions = [{
      key: 'all',
      value: 'all',
      text: 'Show All',
    }, ...otherOption];

    const targetToDate = `${calendarToDate}T00:00:00`;
    const targetFromDate = `${calendarFromDate}T00:00:00`;

    return (
      <div className="bmo-model">
        <div className={'top-section'}>
          <div className={'table-result-count'}>
            {
              resultList ?
                <div className="search-result-count">
                  <span className="search-summary">{`${numberWithCommas(total)} Results`}</span>
                </div>
                :
                null
            }
          </div>
          <div className={'strategy-dropdown'}>
            <Dropdown
              options={dropdownOptions}
              className={'dropdown-chevron bmo_chevron bottom'}
              onChange={this.onDropDownChange()}
              value={selectedVal}
              placeholder={'Company / Ticker'}
              search={true}
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
                dateRange={{ minDate: new Date(targetFromDate) }}
                datePickerTitle={'To'}
                onDateChange={(dt) => this.handleDateChange('toDate', dt)}
                date={targetToDate}
              />
            </div>
          </div>
        </div>
        <div>
          <BmoModelsReportResultSection resetdata={() => { this.props.resetData(); }}isloading={isloading} pageNo={pageNo} api={this.props.apiEndPoint} BMOmodel={true} onSort={this.onSort} data={resultList} isLoggedIn={isLoggedIn} total={total} />
          {
            (isloading && pageNo > 1) && (
              <div className="load-more-button"><Button className="load-more">{'Loading...'}</Button></div>
            )
          }
          { !isloading && total && (total > (this.state.count)) ?
            <div className="load-more-button"><Button onClick={this.addCount} className="load-more">{'Load More Results'}</Button></div>
            : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dropDownList: bmoredSelector.getdropdownList(state),
  resultList: bmomodelsSelector.getResultList(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
  mobileLayout: bmomodelsSelector.isMobileLayout(state),
  isloading: bmomodelsSelector.isLoading(state),
  total: bmomodelsSelector.getBMOMOdelTotal(state),
});

const mapDispatchToProps = (dispatch) => ({
  getBmoModelDropdownOptions: () => {
    dispatch(GET_BMO_RED_DROPDOWN_LIST());
  },
  resetData: () => {
    dispatch({ type: SET_BMO_MODELS_RESULT_LIST, count: 1, data: Object.assign([]), total: 0 });
  },
  getBmoModelResultList: (api, data) => {
    dispatch(GET_BMO_MODEL_RESULTS(api, data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BMOModel);
