/* @flow weak */

/*
 * Component: ChangeSummarySection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Dropdown, Container, Loader, Button } from 'unchained-ui-react';
import { DatePicker } from 'components';
import { connect } from 'react-redux';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { getParameterByName, removeQueryParams, getDateRangeBasedOnUserStatus } from 'utils';

import {
  GET_PROFILE_COMPANY_LIST,
  GET_RESULTS_METHOD_POST
} from 'store/actions';
import {
  userSelector,
  resultSelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ChangeSummarySection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ChangeSummarySection extends Component {
  props: {
    profileCompanyList: {
      sector: [],
      coverage: [],
      analyst: []
    },
    getProfileCompanyList: () => void,
    getChangeSummaryData: () => void,
    apiEndPoint: '',
    result: {},
    dateRange: number,
    isDataLoading: bool,
    profile: {}
  };

  static defaultProps = {
  };

  state = {
    profileCompanyList: {},
    apiEndPoint: '',
    filterData: {
      industry: '',
      company: '',
      change_type: '',
      from_date: moment().format('YYYY-MM-DD'),
      to_date: moment().format('YYYY-MM-DD'),
      page: 1,
      page_size: 10
    },
    count: 20,
    wrapper1Width: 0,
  };

  componentWillMount() {
    const { filterData } = this.state;
    const id = getParameterByName('ticker') || '';
    if (id) {
      filterData.company = id - 0;
    }
    this.props.getProfileCompanyList();
    this.setState({ apiEndPoint: this.props.apiEndPoint, filterData }, () => this.setConfig());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileCompanyList && (nextProps.profileCompanyList !== this.state.profileCompanyList)) {
      this.setState({ profileCompanyList: nextProps.profileCompanyList, count: 20 });
      this.setAutosuggestList(nextProps);
    }
    const userStatus = nextProps.profile.user_status; // eslint-disable-line
    if (userStatus && (userStatus !== this.props.profile.user_status)) {
      this.setConfig(nextProps);
    }
    const ele = document.getElementById('changesummary-width-sliding');
    const tableHeader = (ele && ele.getBoundingClientRect() && ele.getBoundingClientRect().width) || '720';
    this.setState({ wrapper1Width: tableHeader });
  }

  componentDidMount() {
    const ele = document.getElementById('changesummary-width-sliding');
    const tableHeader = (ele && ele.getBoundingClientRect() && ele.getBoundingClientRect().width) || '720';
    this.setState({ wrapper1Width: tableHeader });//eslint-disable-line
  }
  setConfig = (props = this.props) => {
    const { filterData } = this.state;
    const { dateRange, apiEndPoint, getChangeSummaryData, profile } = props;

    filterData.to_date = moment().format('YYYY-MM-DD');
    filterData.from_date = moment().subtract(dateRange * 7, 'days').format('YYYY-MM-DD');

    const dateField = getDateRangeBasedOnUserStatus(profile.user_status, dateRange);
    if (dateField) {
      filterData.to_date = dateField.toDate;
      filterData.from_date = dateField.fromDate;
    }

    this.setState({ filterData }, () => getChangeSummaryData(apiEndPoint, filterData));
  }
  resetFilters = () => {
    const { filterData } = this.state;
    removeQueryParams();
    const { dateRange, apiEndPoint, getChangeSummaryData, profile } = this.props;
    filterData.to_date = moment().format('YYYY-MM-DD');
    filterData.from_date = moment().format('YYYY-MM-DD');

    const dateField = getDateRangeBasedOnUserStatus(profile.user_status, dateRange);
    if (dateField) {
      filterData.from_date = dateField.fromDate;
      filterData.to_date = dateField.toDate;
    }

    filterData.page = 1;
    filterData.industry = '';
    filterData.company = '';
    filterData.change_type = '';
    this.setState({ filterData }, () => getChangeSummaryData(apiEndPoint, filterData));
  }
  setAutosuggestList(props) {
    let companyList = [];
    let industryList = [];
    if (props.profileCompanyList.coverage) {
      companyList = props.profileCompanyList.coverage.map((coverage, i) => ({ text: coverage.text, value: coverage.value, key: `${i}` }));
    }
    if (props.profileCompanyList.sector) {
      industryList = props.profileCompanyList.sector.map((sector, i) => ({ text: sector.text, value: sector.value, key: `${i}` }));
    }
    this.setState({ companyList, industryList });
  }

  addCount = () => {
    this.setState({ count: this.state.count + 20 });
  }

  wrapper1Scroll = () => {
    const wrapper1 = document.getElementById('changesummary-wrapper-1');
    const wrapper2 = document.getElementById('changesummary-wrapper-2');
    wrapper2.scrollLeft = wrapper1.scrollLeft;
  }

  wrapper2Scroll = () => {
    const wrapper1 = document.getElementById('changesummary-wrapper-1');
    const wrapper2 = document.getElementById('changesummary-wrapper-2');
    wrapper1.scrollLeft = wrapper2.scrollLeft;
  }

  getResults = (results, displayCompany) => {
    const { filterData } = this.state;
    const HTML = [];
    const count = results.length <= this.state.count ? results.length : this.state.count;
    for (let i = 0; i < count; i += 1) {
      const aRaw = results[i];
      const ticker = aRaw && aRaw.ticker ? `(${aRaw.ticker})` : '';
      const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(aRaw.ticker)}&searchTicker=${encodeURIComponent(aRaw.ticker)}`;
      HTML.push(
        <div className="a-row" key={Math.random()}>
          {displayCompany ?
            <Container
              className={'cell comp-and-ticker'}
              as={aRaw.is_active && !aRaw.hide ? NavLink : 'div'}
              to={aRaw.is_active && !aRaw.hide ? toUrl : ''}
            >
              <span className="comp">
                {aRaw.company}
              </span>
              <span className="ticker">{ticker}</span>
            </Container>
            :
            null
          }
          <span className="cell pull-left not-on-mobile">{aRaw.date ? moment(aRaw.date).format('MM/DD/YYYY') : 'NA' }</span>
          <span className="cell not-on-mobile">{aRaw.type ? aRaw.type : 'NA' }</span>
          <span className="cell">{aRaw.to ? aRaw.to : 'NA' }</span>
          <span className="cell">{aRaw.from ? aRaw.from : 'NA' }</span>
          {(filterData.change_type === 'Rating Changes' || filterData.change_type === 'Rating Increases' || filterData.change_type === 'Rating Decreases') ?
            null
            :
            <span
              className={`cell ${(aRaw.change && aRaw.change.charAt(0) === '+') ? 'green' : ''} ${(aRaw.change && aRaw.change.charAt(0) === '-') ? 'red' : ''}`}
            >
              {aRaw.change ? aRaw.change : 'NA' }
            </span>
          }
          {(filterData.change_type === 'Rating Changes' || filterData.change_type === 'Rating Increases' || filterData.change_type === 'Rating Decreases') ?
            null
            :
            <span
              className={`cell ${(aRaw.change_percent && aRaw.change_percent.charAt(0) === '+') ? 'green' : ''} ${(aRaw.change_percent && aRaw.change_percent.charAt(0)) === '-' ? 'red' : ''}`}
            >
              {aRaw.change_percent ? aRaw.change_percent : 'NA' }
            </span>
          }
        </div>
      );
    }
    return (
      <div className={`results ${!displayCompany ? 'no-company' : ''}`}>
        {HTML}
      </div>
    );
  }
  setFilter= (type) => (e, val) => {
    const { filterData } = this.state;
    filterData[type] = val.value;
    removeQueryParams();
    if (type === 'industry') {
      filterData.company = '';
    } else if (type === 'company') {
      filterData.industry = '';
    }
    this.setState({ filterData, count: 20 });
    /*eslint-disable*/
    const { industry, company, change_type, from_date, to_date, page, page_size } = filterData;
    this.props.getChangeSummaryData(this.state.apiEndPoint, {
      industry: industry === 'all' ? '' : industry,
      company: company === 'all' ? '' : company,
      change_type: change_type === 'All Changes' ? '' : change_type,
      from_date,
      to_date,
      page,
      page_size
    });
  }
  handleDateChange = (type, date) => {
    const { filterData } = this.state;
    filterData[type] = moment(date).format('YYYY-MM-DD');
    this.setState({ filterData, count: 20 }, () => {
      const { industry, company, change_type, from_date, to_date, page, page_size } = this.state.filterData;
      this.props.getChangeSummaryData(this.state.apiEndPoint, {
        industry: industry === 'all' ? '' : industry,
        company: company === 'all' ? '' : company,
        change_type: change_type === 'All Changes' ? '' : change_type,
        from_date,
        to_date,
        page,
        page_size
      });
    });
    /*eslint-disable*/
  }
  changeTypes =[
    { key: 'All Changes', value: 'All Changes', text: 'All Changes' },
    { key: 'CFPS Changes', value: 'CFPS Changes', text: 'CFPS Changes' },
    { key: 'CFPS Increases', value: 'CFPS Increases', text: 'CFPS Increases' },
    { key: 'CFPS Decreases', value: 'CFPS Decreases', text: 'CFPS Decreases' },
    { key: 'EPS Changes', value: 'EPS Changes', text: 'EPS Changes' },
    { key: 'EPS Increases', value: 'EPS Increases', text: 'EPS Increases' },
    { key: 'EPS Decreases', value: 'EPS Decreases', text: 'EPS Decreases' },
    { key: 'Rating Changes', value: 'Rating Changes', text: 'Rating Changes' },
    { key: 'Rating Increases', value: 'Rating Increases', text: 'Rating Increases' },
    { key: 'Rating Decreases', value: 'Rating Decreases', text: 'Rating Decreases' },
    { key: 'Target Price Changes', value: 'Target Price Changes', text: 'Target Price Changes' },
    { key: 'Target Price Increases', value: 'Target Price Increases', text: 'Target Price Increases' },
    { key: 'Target Price Decreases', value: 'Target Price Decreases', text: 'Target Price Decreases' }
  ]
  render() {
    const { companyList, industryList, filterData, wrapper1Width } = this.state;
    const { result, isDataLoading } = this.props;
    const { from_date, to_date } = filterData;

    const companyTickerPlaceholder = 'Company / Ticker';
    const sectorPlaceholder = 'Industry / Sector';
    const changeTypePlaceholder = 'Change Type';

    const displayCompany = !filterData.company || filterData.company === 'all';

    const optionArrayCompany = companyList ? companyList: [];
    const companyListDropDown = [{
      key: 'all',
      value: 'all',
      text: 'Show All',
    }, ...optionArrayCompany];

    const optionArrayIndustry = industryList ? industryList : [];
    const industryListDropDown = [{
      key: 'all',
      value: 'all',
      text: 'Show All',
    }, ...optionArrayIndustry];

    const companySelectedOption = companyListDropDown.filter(opt => opt.value === filterData.company);
    const sectorSelectedOption = industryListDropDown.filter(opt => opt.value === filterData.industry);
    const changeTypeOption = (this.changeTypes ? this.changeTypes.filter(opt => opt.value === filterData.change_type) : '');
    const targetToDate = `${to_date}T00:00:00`;
    const targetFromDate = `${from_date}T00:00:00`;

    return (
      <div className="change-summary-section">
        <div className="filter-section">
          <div className="drop-downs-list">
            <div className="industry-sector-dropdown a-drop-down">
              <Dropdown
                onChange={this.setFilter('industry')}
                className="dropdown-chevron bottom bmo_chevron"
                selection
                search
                selectOnBlur={false}
                value={filterData.industry}
                placeholder={sectorPlaceholder}
                options={industryListDropDown}
                text={(sectorSelectedOption && sectorSelectedOption.length) ? sectorSelectedOption[0].text : sectorPlaceholder}
              />
            </div>
            <div className="company-ticker-dropdown a-drop-down">
              <Dropdown
                onChange={this.setFilter('company')}
                className="dropdown-chevron bottom bmo_chevron"
                selection
                search
                selectOnBlur={false}
                value={filterData.company}
                placeholder={companyTickerPlaceholder}
                options={companyListDropDown}
                text={(companySelectedOption && companySelectedOption.length) ? companySelectedOption[0].text : companyTickerPlaceholder}
              />
            </div>
            <div className="change-type-dropdown a-drop-down">
              <Dropdown
                onChange={this.setFilter('change_type')}
                className="dropdown-chevron bottom bmo_chevron"
                selection
                search
                selectOnBlur={false}
                placeholder={changeTypePlaceholder}
                value={filterData.change_type}
                options={this.changeTypes}
                text={(changeTypeOption && changeTypeOption.length) ? changeTypeOption[0].text : changeTypePlaceholder}
              />
            </div>
          </div>
          <div className="date-filters">
            <DatePicker
              dateRange={{ maxDate: new Date(targetToDate) }}
              onDateChange={(dt) => this.handleDateChange('from_date', dt)}
              date={targetFromDate}
              datePickerTitle={'From'}
              key={1}
              className="from-date"
            />
            <DatePicker
              dateRange={{ minDate: new Date(targetFromDate) }}
              onDateChange={(dt) => this.handleDateChange('to_date', dt)}
              date={targetToDate}
              key={2}
              datePickerTitle={'To'}
              className="to-date"
            />
            <div className="reset-all-btn-holder">
              <Button content="Reset All" className="reset-all-btn" secondary onClick={this.resetFilters} />
            </div>
          </div>
        </div>
        {isDataLoading ? <div className="bmo-red-loader"><Loader active={true} content="Loading..." /></div> : null}
        {!isDataLoading && result.data && result.data.length <= 0 ? <div className="no-results">No results found</div> : null }
        {!isDataLoading && result.data && result.data.length > 0 ?
          <div className={'result-section'}>
            <div className="summary">
              {(result.data && result.data.length) ? result.data.length : '0'} Companies
            </div>
            <div className="wrapper1" id={'changesummary-wrapper-1'} onScroll={this.wrapper1Scroll}>
              <div className="div1" style={{ width: `${wrapper1Width}px` }} />
            </div>
            <div className="data-table " id={'changesummary-wrapper-2'} onScroll={this.wrapper2Scroll}>
              <div className={`table-head ${!displayCompany ? 'no-company' : ''}`} id={'changesummary-width-sliding'} >
                {!filterData.company || filterData.company === 'all' ? <div className="cell comp-and-ticker"><span className="comp">Company / Ticker</span></div> : ''}
                <span className="cell pull-left not-on-mobile">Date</span>
                <span className="cell not-on-mobile">Metric</span>
                <span className="cell">Current</span>
                <span className="cell">Previous</span>
                {(filterData.change_type === 'Rating Changes' || filterData.change_type === 'Rating Increases' || filterData.change_type === 'Rating Decreases') ?
                  null
                  :
                  <span className="cell">Change</span>
                }
                {(filterData.change_type === 'Rating Changes' || filterData.change_type === 'Rating Increases' || filterData.change_type === 'Rating Decreases') ?
                  null
                  :
                  <span className="cell">%Change</span>
                }
              </div>
              {
                result.data ?
                  this.getResults(result.data, displayCompany)
                  : null
              }
            </div>
            {result.data && (result.data.length >= (this.state.count)) ?
              <div className="load-more-button"><Button onClick={this.addCount} className="load-more">Load More Results</Button></div>
              : null
            }
          </div>
          : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profileCompanyList: userSelector.getProfileCompanyList(state),
  isDataLoading: resultSelector.getChangeSummaryLoading(state),
  profile: userSelector.getUserProfileInfo(state)
});

const mapDispatchToProps = (dispatch) => ({
  getProfileCompanyList: () => {
    dispatch(GET_PROFILE_COMPANY_LIST());
  },
  getChangeSummaryData: (url, d) => {
    dispatch(GET_RESULTS_METHOD_POST(url, d));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(ChangeSummarySection);
