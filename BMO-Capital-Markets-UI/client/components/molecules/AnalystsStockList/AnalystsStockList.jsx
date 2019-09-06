/* @flow weak */

/*
 * Component: AnalystsStockList
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Dropdown } from 'unchained-ui-react';
import { AnalystsTable } from 'components';
import _ from 'lodash';
import { pushToDataLayer } from 'analytics';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystsStockList.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsStockList extends Component {
  props: {
    data: {},
    profile: {}
  };

  static defaultProps = {
  };

  state = {
    selected: 'all',
    text: 'All',
    total: '',
    coverageArray: [],
    topright: ['Company', 'Rating', 'Close', 'Target Price', 'Total Return', 'Current EPS', 'Current PE', 'Next EPS', 'Next PE', 'Yield', 'Mkt Cap'],
  };

  componentWillReceiveProps(nextProps) {
    this.addCoverage('all', nextProps);
  }

  componentWillMount() {
    const { data } = this.props;
    const topright = ['Company', 'Rating', 'Close', 'Target Price', 'Total Return', `Current ${data.tableHeader.EPSLabel}`, `Current ${data.tableHeader.PELabel}`, `Next ${data.tableHeader.EPSLabel}`, `Next ${data.tableHeader.PELabel}`, 'Yield', 'Mkt Cap'];
    this.addCoverage('all');
    this.setState({ topright });
  }

  addCoverage = (sector, props = this.props) => {
    const { data } = props;
    const coverageData = [];
    if (sector === 'all') {
      Object.keys(data.sectors).map((key) =>
        data.sectors[key].map((coverage) => coverageData.push(coverage))
      );
      this.setState({ text: 'All', total: coverageData.length });
    } else {
      coverageData.push(...(data.sectors[sector]));
      this.setState({ text: sector });
    }
    this.setState({ coverageArray: coverageData, selected: sector });
    this.updateState(coverageData);
  }

  updateState = (coverages) => {
    let cannabiscount = 0;
    const sortedCoverageList = _.orderBy(coverages, [comp => comp.CompanyName.toLowerCase()], ['asc']);
    const resultArray = sortedCoverageList.map(coverage => {
      if (coverage.disableCheckBox) {
        cannabiscount += 1;
      }
      return ([
        `${coverage.CompanyName};${coverage.is_active ? coverage.CompanyTicker : ''};${coverage.TickerFinancialInfo}`,
        coverage.RatingDesc,
        coverage.ClosingPrice,
        coverage.TargetPrice,
        coverage.TotalReturn,
        coverage.CurrentEPS,
        coverage.CurrentPE,
        coverage.NextEPS,
        coverage.NextPE,
        coverage.Yield,
        coverage.MarketCap
      ]);
    });
    this.setState({ bottomright: resultArray, cannabiscount });
  }

  addCoverageMobile = (e, { value }) => {
    this.addCoverage(value);
  }

  mobileDropdown = () => {
    const { data } = this.props;
    const { text, total } = this.state;
    const sectorArray = [];
    sectorArray.push({ key: 'all', value: 'all', text: `All (${total})` });
    Object.keys(data.sectors).map((key) =>
      sectorArray.push({ key, value: key, text: `${key} (${data.sectors[key].length})` })
    );
    return (
      <Dropdown
        placeholder={'All'}
        defaultValue={'all'}
        className="show-mobile"
        text={`${text} (${total})`}
        fluid
        selection
        options={sectorArray}
        onChange={this.addCoverageMobile}
      />
    );
  }

  handleGTM = (company) => {
    const { data } = this.props;
    const { selected } = this.state;
    if (company) {
      const gtmData = {
        'Company Name': company,
        'BMO Analyst Name': data.display_name,
        'BMO Analyst Job Title': data.position,
        'Sector Name': data.sectors ? Object.keys(data.sectors).map((key) => key).join(';') : '',
      };
      pushToDataLayer('ourdepartment', 'coverageStockList', { label: `${selected}: ${company}`, data: gtmData });
    }
  }

  render() {
    const { data, profile } = this.props;
    const { topright, bottomright, selected, total, cannabiscount } = this.state;
    const asteriskMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.CANNABIS_COMPANY_ASTERISK_MESSAGE) || '';
    return (
      <div className="analysts-stock-list">
        <div className="stock-list-heading">Coverage Stock List</div>
        <div className="table-wrap">
          <div className="show-desktop">
            <div className={`button-wrap all ${selected === 'all' ? 'active' : ''}`}>
              <Button
                className="sector-button"
                onClick={() => this.addCoverage('all')}
                content={`All (${total})`}
              />
            </div>
            {Object.keys(data.sectors).map((key) => {
              const displayText = `${key} (${data.sectors[key].length})`;
              // const sectorLength = Object.keys(data.sectors).length; eslint-disable-line
              const popupText = (
                <div
                  className={`button-wrap ${selected === key ? 'active' : ''}`}
                >
                  <Button
                    className="sector-button"
                    onClick={() => this.addCoverage(key)}
                    content={displayText}
                  />
                </div>
              );
              return popupText;
            })}
          </div>
        </div>
        {this.mobileDropdown()}
        <AnalystsTable
          isResultLoaded={true}
          headerRight={topright}
          resultRight={bottomright}
          handleGTM={this.handleGTM}
        />
        {!profile.cannabis && cannabiscount > 0 && <div className={'asterisk-message'}>{asteriskMessage}</div>}
      </div>
    );
  }
}

export default AnalystsStockList;
