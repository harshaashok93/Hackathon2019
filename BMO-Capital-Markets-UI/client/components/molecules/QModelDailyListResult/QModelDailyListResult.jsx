/* @flow weak */

/*
 * Component: QModelDailyListResult
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Dropdown, Modal, Checkbox, Input, Loader } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import { SlidingTable, DownloadFailedModal, DownloadingModal } from 'components';
import _ from 'lodash';
import { connect } from 'react-redux';
import { numberWithCommas, downloadBlobFile } from 'utils';
import {
  downloadExcel,
} from 'api/qmodel';
import {
  resultSelector,
  userSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QModelDailyListResult.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QModelDailyListResult extends Component {
  props: {
    result: {},
    defaults: {},
    isResultLoading: bool,
    profile: {}
  };

  state = {
    isModalOpen: false,
    marketCapSelectedVal: '',
    resultLeft: [],
    resultRight: [],
    headerLeft: [],
    headerRight: [],
    fieldValues: {},
    fieldErrors: {},
    maxRank: {},
    rawResult: {},
    submittedFieldValues: {},
    error: {},
    count: 20,
    filteredResult: '',
    isDownloadingFailed: false,
    downloadingExcel: false,
    sortType: '',
    sortOrder: '',
    profile: {}
  };

  componentWillMount() {
    const { defaults, result } = this.props;
    this.selectAllFieldSelections(true);
    this.setState({ marketCapSelectedVal: defaults && defaults.qModel !== 'all' ? defaults.qModel : this.marketCapOptions[0].value, rawResult: result, filteredResult: result.length });
  }

  componentWillReceiveProps(nextProps) {
    this.setResultSet(nextProps.result);
    this.setState({ rawResult: nextProps.result });
  }

  headerRightConfigMap = {
    ticker: 'Ticker',
    rating: 'Rating',
    price: 'Price',
    yield: 'Yield',
    pe: 'PE',
    pbv: 'P/BV',
    roe: 'ROE',
    earnmom: 'Earn MoM',
    pricemom: 'Price MoM',
    compositerank: 'Comp Rank',
    gainloss: 'Gain Loss',
    yieldrank: 'Yield Rank',
    perank: 'PE Rank',
    pbvrank: 'P/BV Rank',
    roerank: 'ROE Rank',
    earnmomrank: 'Earn MoM Rank',
    pricemomrank: 'Price MoM Rank',
    marketcap: '(In Millions) Market Cap'
  };

  headerLeftConfigMap = {
    company: 'Company',
  };

  marketCapOptions = [{
    key: 'LARGECAP',
    value: 'LARGECAP',
    text: 'Large Cap'
  },
  {
    key: 'SMALLCAP',
    value: 'SMALLCAP',
    text: 'Small Cap'
  }];

  rankDropdownOpts = [{
    key: '',
    value: '',
    text: 'All'
  },
  {
    key: 'top_10',
    value: 'top_10',
    text: 'Top 10'
  }, {
    key: 'top_quartile',
    value: 'top_quartile',
    text: 'Top Quartile'
  }, {
    key: 'top_half',
    value: 'top_half',
    text: 'Top Half'
  }, {
    key: 'bottom_quartile',
    value: 'bottom_quartile',
    text: 'Bottom Quartile'
  }, {
    key: 'bottom_half',
    value: 'bottom_half',
    text: 'Bottom Half'
  }, {
    key: 'bottom_10',
    value: 'bottom_10',
    text: 'Bottom 10'
  }];

  ratingOpts = [{
    key: '',
    value: '',
    text: 'All'
  },
  {
    key: 'op',
    value: 'OP',
    text: 'OP'
  }, {
    key: 'mkt',
    value: 'MP',
    text: 'OP & MP'
  }];

  selectAllFieldSelections(updateCacheField) {
    const fieldSelections = Object.keys(this.headerLeftConfigMap).concat(Object.keys(this.headerRightConfigMap));
    if (updateCacheField) {
      this.cachedFieldSelections = Object.assign([], fieldSelections);
    }
    this.setState({ fieldSelections, hasFormChanged: true });
  }

  clearAllFieldSelections() {
    this.setState({ fieldValues: {}, fieldErrors: {}, hasFormChanged: true });
  }

  addCount = () => {
    this.setState({ count: this.state.count + 20 }, () => {
      this.setResultSet();
    });
  }

  closeDownloadingModal = (type) => {
    const typemodal = `downloading${type}`;
    this.setState({ [typemodal]: false });
  }

  checkBoxClick = (selection) => (e, obj) => {
    const { checked } = obj;
    const { fieldSelections } = this.state;
    if (!selection) return;
    const index = fieldSelections.indexOf(selection);
    if (!checked) {
      if (index === -1) {
        fieldSelections.push(selection);
      }
    } else {
      if (index > -1) { // eslint-disable-line
        fieldSelections.splice(index, 1);
      }
    }
    this.setState({ fieldSelections, hasFormChanged: true });
  }

  handleMouseUp = (e) => {
    if ((e.target.className.indexOf('ui page modals dimmer transition visible active') > -1)) {
      // Adding new classname to overlay parent will not let to close overlay in tablets, on touch of background.
      this.closeModal();
    }
  }

  openModal = () => {
    document.body.style.overflow = 'hidden';
    pushToDataLayer('qmodel', 'qModelDailyList', { action: 'Configure Field Range', label: '' });
    document.body.addEventListener('touchstart', this.handleMouseUp);
    this.setState({ isModalOpen: true, submittedFieldValues: Object.assign([], this.state.fieldValues), hasFormChanged: false });
  }

  closeModal = () => {
    let canClose = true;
    if (this.state.hasFormChanged) {
      canClose = window.confirm('The Changes you made will be lost.\n Continue?'); // eslint-disable-line
    }
    if (canClose) {
      document.body.style.overflow = '';
      document.body.removeEventListener('touchstart', this.handleMouseUp);
      this.setState({ isModalOpen: false, error: {}, fieldValues: Object.assign([], this.state.submittedFieldValues), fieldSelections: Object.assign([], this.cachedFieldSelections) });
    }
  }

  downloadExcel = async () => {
    pushToDataLayer('qmodel', 'qModelDailyList', { action: 'Download Excel', label: '' });
    this.setState({ isDownloading: true, downloadingExcel: true });
    const { fieldSelections, companyIds, sortOrder, sortType } = this.state;
    downloadExcel({
      companyIds,
      headerNames: Object.assign([], fieldSelections),
      capType: this.state.marketCapSelectedVal,
      sortOrder,
      sortType
    }).then(r => {
      if (r.ok) {
        return r.blob();
      }
      return null;
    }).then((result) => {
      if (!result) {
        this.setState({ isDownloadingFailed: true });
        return;
      }
      downloadBlobFile({
        content: result,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: 'qmodel.xlsx'
      });
      this.setState({ isDownloading: false });
    }).catch(() => {
      this.setState({ isDownloading: false });
    });
  }

  closeFailedModal = () => {
    this.setState({ isDownloadingFailed: false, isDownloading: false });
  }

  submitFieldRange = () => {
    document.body.style.overflow = '';
    this.cachedFieldSelections = Object.assign([], this.state.fieldSelections);
    this.setState({ isModalOpen: false, error: {}, submittedFieldValues: Object.assign([], this.state.fieldValues), count: 20 }, () => {
      this.setResultSet();
    });
    if (window.location.pathname === '/q-model/q-model-daily-list/') {
      pushToDataLayer('qmodel', 'submitFieldRange', { action: 'Submit field range', label: '' });
    } else {
      pushToDataLayer('qmodel', 'submitFieldRange', { action: 'Submit field range', label: window.location.href });
    }
  }

  handleMarketCapOptionChange = (e, { value }) => {
    this.setState({ marketCapSelectedVal: value, count: 20 }, () => {
      this.setResultSet();
    });
  }

  getRankItems = (value, filter, label) => {
    const val = this.getNumber(value);
    const { maxRank, marketCapSelectedVal } = this.state;
    let minNum = 1;
    let maxNum = maxRank[marketCapSelectedVal][label];

    switch (filter) {
      case 'top_10' :
        maxNum = 10;
        break;
      case 'top_quartile' :
        maxNum = Math.round(maxNum / 4);
        break;
      case 'top_half' :
        maxNum = Math.round(maxNum / 2);
        break;
      case 'bottom_quartile' :
        minNum = maxNum - Math.round(maxNum / 4);
        break;
      case 'bottom_half' :
        minNum = maxNum - Math.round(maxNum / 2);
        break;
      case 'bottom_10' :
        if (maxNum > 10) {
          minNum = maxNum - 10;
        }
        break;
      default: break;
    }
    return (val >= minNum && val <= maxNum);
  }

  geRatingMKTItems = (filterVal) => {
    const options = ['OP', 'MKT', 'R'];
    return (options.indexOf(options.filter(el => el.toLowerCase() === filterVal.toLowerCase())[0]) > -1);
  }
  getResults = (rawResult, marketCapSelectedVal) => {
    const { profile } = this.props;
    const { resultLeft, headerRight, headerLeft, resultRight, filteredResult } = this.state;
    const asteriskMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.CANNABIS_COMPANY_ASTERISK_MESSAGE) || '';
    if (rawResult[marketCapSelectedVal]) {
      return (
        <div>
          <SlidingTable
            isResultLoaded={Object.keys(this.props.result || {}).length}
            resultLeft={resultLeft}
            headerRight={headerRight}
            headerLeft={headerLeft}
            resultRight={resultRight}
            sortTableBy={this.sortTableBy}
            filteredResultCount={filteredResult}
            fromStockScreener={false}
          />
          {!profile.cannabis && this.state.cannabiscount > 0 && <div className={'asterisk-message'}>{asteriskMessage}</div>}
          {rawResult[marketCapSelectedVal].length && this.state.filteredResult >= (this.state.count) ?
            <div className="load-more-button"><Button onClick={this.addCount} className="load-more">Load More Results</Button></div>
            : null
          }
        </div>
      );
    }
    return <div className="no-results"> No result found for selection! </div>;
  }
  setResultSet(res = this.props.result) {
    if (res) {
      const { fieldValues, marketCapSelectedVal } = this.state;
      const fieldValueObj = {};
      const result = res[marketCapSelectedVal];
      let cannabiscount = 0;

      // Transform the fieldValues state obj in a format that can be used to filter the result set
      Object.keys(fieldValues).map(t => {
        const val = fieldValues[t];
        if ((t.indexOf('max') === 0 || t.indexOf('min') === 0) && t.indexOf('-') === 3) {
          const arr = t.split('-');
          const range = arr[0];
          const key = arr[1];

          if (!fieldValueObj[key]) {
            fieldValueObj[key] = [(range === 'min' ? val : null), (range === 'min' ? null : val)];
          } else {
            fieldValueObj[key][range === 'min' ? 0 : 1] = val;
          }
        } else {
          fieldValueObj[t] = val;
        }
        return null;
      });

      if (result && result instanceof Array) {
        let resultRight = [];
        let resultLeft = [];
        const headerLeft = [];
        const headerRight = [];
        const { fieldSelections } = this.state;
        const headerRightKeys = Object.keys(this.headerRightConfigMap);
        const headerLeftKeys = Object.keys(this.headerLeftConfigMap);
        let companyIds = [];
        let companyData = [];
        const count = result.length <= this.state.count ? result.length : this.state.count;
        let totalCountAfterFilter = 0;
        for (let i = 0; i < result.length; i += 1) {
          const r = result[i];
          let shouldPushRow = true;

          const resL = headerLeftKeys.map((l) => {
            if (i === 0) headerLeft.push({ text: this.headerLeftConfigMap[l], key: l });
            return (`${r[l]}**${r.is_active ? r.ticker : ''}` || '-');
          }).filter(d => ((d !== null && d !== undefined)));

          const resR = headerRightKeys.map((l) => {
            if (fieldSelections.indexOf(l) > -1) {
              if (i === 0) headerRight.push({ text: this.headerRightConfigMap[l], key: l });
            }

            // Filter Based on the selections from field range
            if (fieldValueObj) {
              const filterVal = fieldValueObj[l];

              if (filterVal) {
                if (filterVal instanceof Array && filterVal.length === 2) {
                  const resultSetVal = this.getNumber(r[l]);
                  const minVal = this.getNumber(filterVal[0]);
                  const maxVal = this.getNumber(filterVal[1]);

                  if ((minVal !== '' ? (resultSetVal - 0) >= minVal : true) &&
                      (maxVal !== '' ? (resultSetVal - 0) <= maxVal : true)) {
                    if (fieldSelections.indexOf(l) > -1) {
                      return (r[l] || 'A');
                    }
                    return null;
                  }
                  shouldPushRow = false;
                  return null;
                }

                let shouldReturnRow = true;
                if (filterVal === 'OP') {
                  shouldReturnRow = (r[l] === filterVal);
                } else if (filterVal === 'MP') {
                  shouldReturnRow = this.geRatingMKTItems(r[l]);
                } else {
                  shouldReturnRow = this.getRankItems(r[l], filterVal, l);
                }
                if (shouldReturnRow) {
                  if (fieldSelections.indexOf(l) > -1) return (r[l] || '-');
                  return null;
                }
                shouldPushRow = false;
                return null;
              }
            }
            if (fieldSelections.indexOf(l) > -1) return (r[l] || '-');
            return null;
          }).filter(d => ((d !== null && d !== undefined)));

          // Push the filtered rows
          if (shouldPushRow === true) {
            companyIds.push(r.ticker);
            companyData.push(r);
            resultLeft.push(resL);
            resultRight.push(resR);
            totalCountAfterFilter += 1;
          }
        }
        companyIds = companyIds.splice(0, count);
        companyData = companyData.splice(0, count);
        companyData.map((r) => {
          if (r.isCannabis) {
            cannabiscount += 1;
          }
        });
        resultLeft = resultLeft.splice(0, count);
        resultRight = resultRight.splice(0, count);
        this.setState({ filteredResult: totalCountAfterFilter, resultRight, resultLeft, headerLeft, headerRight, companyIds, maxRank: res.maxRank, cannabiscount });
      }
    }
  }

  handleRangeValueChange = (value, field) => {
    const { fieldValues } = this.state;
    if (field) {
      fieldValues[field] = value;
      this.setState({ fieldValues, hasFormChanged: true });
    }
  }

  handleRankValueChange = (field, value) => {
    const { fieldValues } = this.state;
    if (field) {
      fieldValues[field] = value;
      this.setState({ fieldValues, hasFormChanged: true });
    }
  }

  getNumber = (str) => {
    if (str) {
      return `${str}`.replace(/,/g, '') - 0;
    }
    return '';
  }

  reFormatNumberField = (field, isFocussed, type) => {
    const { fieldValues, fieldErrors, error } = this.state;
    const range = `${type}-${field}`;
    const rangeVal = fieldValues[range];
    if (rangeVal && !((/^-?\d{1,3}(?:,?\d{3})*(?:\.\d*)?$/).test(rangeVal))) {
      error[`${type}-${field}`] = true;
      fieldValues[`${type}-${field}`] = '';
      this.setState({ error, fieldValues });
      return false;
    }
    if (field) {
      const maxRange = `max-${field}`;
      const minRange = `min-${field}`;

      error[range] = false;
      this.setState({ error });

      if (rangeVal) {
        const reformatedValue = this.getNumber(rangeVal);
        fieldValues[range] = isFocussed ? reformatedValue : numberWithCommas(reformatedValue);
        if (!isFocussed) {
          fieldErrors[range] = false;
          const maxVal = fieldValues[maxRange] ? this.getNumber(fieldValues[maxRange]) : '';
          const minVal = fieldValues[minRange] ? this.getNumber(fieldValues[minRange]) : '';

          if (type === 'min') {
            if (maxVal && maxVal !== 0 && maxVal < this.getNumber(fieldValues[range])) {
              fieldErrors[range] = true;
            }
          } else if (type === 'max') {
            if (minVal && minVal !== 0 && minVal > this.getNumber(fieldValues[range])) {
              fieldErrors[range] = true;
            }
          }
        }
        this.setState({ fieldValues });
      }
    }
    error[`${type}-${field}`] = false;
    this.setState({ error });
    return true;
  }

  getRangeFilters() {
    const { result } = this.props;
    const { fieldSelections, fieldValues, fieldErrors, error } = this.state;
    if (result && result.mapping && result.mapping.range) {
      return Object.keys(result.mapping.range).map((range, i) => {
        const minRange = `min-${range}`;
        const maxRange = `max-${range}`;
        return (
          <div className="range-filter" key={(`${i + 1}`)}>
            <div className="qm-daily-li-range-filter">
              <Checkbox label={result.mapping.range[range]} checked={fieldSelections.indexOf(range) > -1} onClick={this.checkBoxClick(range)} />
            </div>
            <div className="qm-daily-li-range-input min-field">
              <Input
                className={`${fieldErrors[minRange] === true ? 'error-field' : ''} ${error[minRange] ? 'redBox' : ''}`}
                input={
                  {
                    type: 'text',
                    onChange: (e) => this.handleRangeValueChange(e.target.value, minRange),
                    value: fieldValues[minRange] || '',
                    onFocus: () => this.reFormatNumberField(range, true, 'min'),
                    onBlur: () => this.reFormatNumberField(range, false, 'min')
                  }
                }
              />
              {fieldErrors[minRange] === true ? <div className="errorMsg">Min Value should be less than Max</div> : null}
            </div>
            <div className="qm-daily-li-range-input">
              <Input
                className={`${fieldErrors[maxRange] === true ? 'error-field' : ''} ${error[maxRange] ? 'redBox' : ''}`}
                input={
                  {
                    type: 'text',
                    onChange: (e) => this.handleRangeValueChange(e.target.value, maxRange),
                    value: fieldValues[maxRange] || '',
                    onFocus: () => this.reFormatNumberField(range, true, 'max'),
                    onBlur: () => this.reFormatNumberField(range, false, 'max')
                  }
                }
              />
              {fieldErrors[maxRange] === true ? <div className="errorMsg">Max Value should be greater than Min</div> : null}
            </div>
          </div>
        );
      });
    }
    return null;
  }

  getRankFilters() {
    const { result } = this.props;
    const { fieldSelections, fieldValues } = this.state;
    const placeholderText = 'All';

    if (result && result.mapping && result.mapping.rank) {
      return Object.keys(result.mapping.rank).map((rank, i) => {
        const rankingOptions = rank === 'rating' ? this.ratingOpts : this.rankDropdownOpts;
        const dropDownText = fieldValues[rank] ? rankingOptions.filter(r => r.value === fieldValues[rank])[0].text : placeholderText;

        return (
          <div className="qm-daily-li-drop-down-row" key={(`${i + 1}`)}>
            <div className="qm-daily-li-range-filter">
              <Checkbox label={result.mapping.rank[rank]} checked={fieldSelections.indexOf(rank) > -1} onClick={this.checkBoxClick(rank)} />
            </div>
            <div className="qm-daily-li-drop-down full">
              <Dropdown
                className={'dropdown-chevron bmo_chevron bottom'}
                fluid search selection
                placeholder={placeholderText}
                options={rankingOptions}
                onChange={(e, obj) => this.handleRankValueChange(rank, obj.value)}
                value={fieldValues[rank]}
                text={dropDownText}
                selectOnBlur={false}
              />
            </div>
          </div>
        );
      });
    }
    return null;
  }
  sortTableBy = (type, order) => {
    const resultData = this.state.rawResult;
    const orderResult = _.orderBy(resultData[this.state.marketCapSelectedVal], type, order !== 'DESC' ? 'asc' : 'desc');
    resultData[this.state.marketCapSelectedVal] = Object.assign([], orderResult);
    this.setState({
      sortType: type,
      sortOrder: order
    });
    this.setResultSet(resultData);
  }

  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('noscroll');
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll');
  }

  getTheModal = () => {
    const { isModalOpen, fieldErrors } = this.state;
    const disableSubmitBtn = Object.keys(fieldErrors).filter(e => fieldErrors[e] === true).length > 0;
    return (
      <Modal
        className="modal-Q-model-daily-list"
        open={isModalOpen}
        onMount={this.hideBodyScroll()}
        onUnmount={this.showBodyScroll()}
        onClose={this.closeModal}
        closeOnDimmerClick={true}
      >
        <Modal.Content>
          <div className="close-button-bar">
            <Button className="close-button mega-menu-close-icon bmo-close-btn bg-icon-props" onClick={this.closeModal} />
          </div>
          <div className="box-title">Set Field Range</div>
          <div className="drops-and-checks">
            <div className="l-side">
              <div className="range-filter-header">
                <div className="header-cell col-three first-cell">
                  Field
                </div>
                <div className="header-cell col-three max-min-range">
                  Min
                </div>
                <div className="header-cell col-three max-min-range">
                  Max
                </div>
              </div>
              <div className="qm-daily-li-filters-left">
                {this.getRangeFilters()}
              </div>
            </div>
            <div className="v-hr" />
            <div className="r-side">
              <div className="qm-daily-li-range-filter-header">
                <div className="header-cell col-three first-cell">
                  Field
                </div>
                <div className="header-cell full">
                  Set Value
                </div>
              </div>
              <div className="qm-daily-li-filters-right">
                {this.getRankFilters()}
              </div>
            </div>
          </div>
          <div className="button-bottoms">
            <Button secondary className="inline claer-all-button" onClick={() => this.clearAllFieldSelections()}> Clear All </Button>
            <Button secondary className="inline" onClick={() => this.selectAllFieldSelections()} > Select All </Button>
            <Button secondary className="inline right" disabled={disableSubmitBtn} onClick={this.submitFieldRange} > Done </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
  render() {
    const { marketCapSelectedVal, rawResult, isDownloading, isDownloadingFailed, downloadingExcel } = this.state;
    const selectedVal = this.marketCapOptions.filter(opt => opt.value === marketCapSelectedVal);
    const marketCapPlaceholder = 'Select a value';

    return (
      <div className="q-model-daily-list-result">
        {
          isDownloadingFailed ?
            <DownloadFailedModal closeModal={this.closeFailedModal} text="Oops! There was an error loading this page. Please try again." />
            :
            null
        }
        {
          !isDownloadingFailed && isDownloading && downloadingExcel ?
            <DownloadingModal closeModal={this.closeDownloadingModal} text="Loading..." modalType={'Excel'} />
            :
            null
        }
        <div className="filter-range-buttom">
          <div className="buttons inline right button-holders">
            {this.getTheModal()}
            <Button secondary className={'inline dropdown-chevron bmo_chevron right'} onClick={this.openModal}> Set Field Range </Button>
          </div>
        </div>
        <div className="filters-and-buttons">
          <div className="summary-and-excel">
            <span className="min-summary">
              {rawResult && rawResult.date && rawResult.date[marketCapSelectedVal] ? `Using Prices For ${rawResult.date[marketCapSelectedVal]}` : ''}
            </span>
            {
              rawResult[marketCapSelectedVal] ?
                <Button
                  className={`user-pref-icon download-report inline excel-download ${isDownloading ? 'selected' : ''}`}
                  onClick={this.downloadExcel}
                  content={`${isDownloading ? 'Requesting download...' : 'Excel'}`}
                />
                : null
            }
          </div>
          <div className="filters inline cap-drop-down">
            <Dropdown
              className="dropdown-chevron bmo_chevron bottom filter-set"
              value={marketCapSelectedVal}
              text={(selectedVal && selectedVal.length) ? selectedVal[0].text : marketCapPlaceholder}
              onChange={this.handleMarketCapOptionChange}
              fluid
              selection
              placeholder={marketCapPlaceholder}
              options={this.marketCapOptions}
            />
          </div>
        </div>
        {
          this.props.isResultLoading ?
            <Loader className="daily-list-result-loading" active={true} content="Loading..." />
            : this.getResults(rawResult, marketCapSelectedVal)
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isResultLoading: resultSelector.getIsResultLoading(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = () => ({
  // ...
});

export default connect(mapStateToProps, mapDispatchToProps)(QModelDailyListResult);
