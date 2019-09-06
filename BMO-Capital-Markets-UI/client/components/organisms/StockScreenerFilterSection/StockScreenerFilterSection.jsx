/* @flow weak */

/*
 * Component: StockScreenerFilterSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Dropdown, Button, Grid, Modal, Loader } from 'unchained-ui-react';
import { SlidingTable, StockScreenerFilterOverlay, DownloadFailedModal, DownloadingModal } from 'components';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';

import {
  SET_STOCK_SCREENER_DATA,
  GET_BMO_RED_DROPDOWN_LIST,
  DOWNLOAD_STOCK_SCREENER_EXCEL_LINK,
  DOWNLOAD_STOCK_SCREENER_PDF_LINK,
  SET_SCREENER_RESULT
} from 'store/actions';

import {
  resultSelector,
  bmoredSelector,
  userSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StockScreenerFilterSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StockScreenerFilterSection extends Component {
  props: {
    result: [], // eslint-disable-line
    setStockScreenerData: () => void,
    setDropDownData: () => void,
    api: '',
    dropDown: {},
    downloadExcelLink: () => void,
    downloadPdfLink: () => void,
    isDataLoading: boolean,
    total: '',
    excelDownload: boolean,
    pdfDownload: boolean,
    pdfDownloadFailed: boolean,
    excelDownloadFailed: boolean,
    resetData: () => void,
    profile: {}
  };

  componentWillReceiveProps(nextProps) {
    this.populateState(nextProps); // eslint-disable-line
    this.setState({ pdfFailed: nextProps.pdfDownloadFailed, excelFailed: nextProps.excelDownloadFailed });
    if (!nextProps.isDataLoading) {
      this.setState({ sortClick: false });
    }
  }

  componentWillUnmount() {
    this.props.resetData();
  }

  populateState(props = this.props) {
    const { result } = props;
    if (!result) return;
    const leftResult = [];
    const rightResult = [];
    let cannabiscount = 0;
    result.map((data) => {
      rightResult.push([
        data.RatingDesc,
        data.ClosingPrice,
        data.TargetPrice,
        data.TotalReturn,
        data.CurrentEPS,
        data.CurrentPE,
        data.NextEPS,
        data.NextPE,
        data.Proj2YrEPSGrowth,
        data.Yield,
        data.PriceChange1Yr,
        data.MarketCap,
      ]);
      leftResult.push([`${data.CompanyName}**${data.is_active && !data.hide ? data.CompanyTicker : ''}**${data.FiscalYear}`]);
      if (data.disableCheckBox) {
        cannabiscount += 1;
      }
    });
    this.setState({ resultLeft: leftResult, resultRight: rightResult, cannabiscount });
  }

  componentWillMount() {
    const { setDropDownData, setStockScreenerData, api } = this.props;
    const filters = {
      AnalystIDs: [],
      SectorIDs: [],
      RatingCSV: ['R', 'NR', 'UND', 'MKT', 'OP'],
      Country: 'ALL',
    };
    setStockScreenerData(api, { filters, count: 1 });
    setDropDownData();
    this.setState({ filters, filterToDownload: JSON.parse(JSON.stringify(filters)) });
    this.populateState();
  }

  static defaultProps = {
    //
  };

  state = {
    dropDownType: '',
    downloadingExcel: false,
    downloadingPdf: false,
    data: {
      rating: { all: true, R: true, NR: true, UND: true, MKT: true, OP: true },
      location: { ALL: true, US: true, CA: true },
      minimum: { Min2YrEPSGrowth: '', MinCap: '', MinYield: '', MinTotalReturn: '', Min1YrPriceChange: '' },
      maximum: { MaxCurrentPE: '', MaxCap: '', MaxNextPE: '', MaxPrice2BookVal: '', Max1YrPriceChange: '' },
      fieldErrors: {},
    },
    showList: [],
    isOpen: false,
    filters: {
      AnalystIDs: [],
      SectorIDs: [],
      RatingCSV: [],
      country: '',
      sortType: 'company',
      sortOrder: 'ASC'
    },
    resultRight: [],
    resultLeft: [],
    headerLeft: [{ text: 'Company', key: 'company' }],
    headerRight: [
      { text: 'Rating', key: 'RatingDesc' },
      { text: 'Close', key: 'ClosingPrice' },
      { text: 'Target Price', key: 'TargetPrice' },
      { text: 'Total Return', key: 'TotalReturn' },
      { text: 'Current EPS', key: 'CurrentEPS' },
      { text: 'Current PE', key: 'CurrentPE' },
      { text: 'Next EPS', key: 'NextEPS' },
      { text: 'Next PE', key: 'NextPE' },
      { text: '2Yr EPS Gr', key: 'Proj2YrEPSGrowth' },
      { text: 'Yield', key: 'Yield' },
      { text: '1Yr price chng', key: 'PriceChange1Yr' },
      { text: 'Market Cap', key: 'MarketCap' }
    ],
    count: 20,
    pageNo: 1,
    filterToDownload: {
      AnalystIDs: [],
      SectorIDs: [],
      RatingCSV: [],
      country: '',
    },
  };

  handleCompanyChange = (e, { value }) => {
    const { dropDownType } = this.state;
    let showList = this.state.showList;
    const { dropDown } = this.props;
    let valueList = {};
    valueList = this.state.filters;
    if (dropDownType === 'analyst') {
      valueList.AnalystIDs = [];
      showList = [];
    }
    const isPresent = valueList.SectorIDs ? valueList.SectorIDs.filter((item) => item === value).length : 0;
    if (valueList.SectorIDs && isPresent <= 0) {
      valueList.SectorIDs.push(value);
    } else {
      const SectorIDs = [];
      SectorIDs.push(value);
      valueList.SectorIDs = SectorIDs;
    }
    dropDown.sector.map((item) => {
      if (item.value === value && isPresent <= 0) {
        showList.push({ text: item.text, value: item.value });
        this.handleGTM('companyDropdownSelect', item.text);
      }
      this.setState({ showList });
    });
    this.setState({ filters: valueList, dropDownType: 'sector' });
  }

  handleAnalystChange = (e, { value }) => {
    const { dropDownType } = this.state;
    let showList = this.state.showList;
    const { dropDown } = this.props;
    let valueList = {};
    valueList = this.state.filters;
    if (dropDownType === 'sector') {
      valueList.SectorIDs = [];
      showList = [];
    }
    const isPresent = valueList.AnalystIDs ? valueList.AnalystIDs.filter((item) => item === value).length : 0;
    if (valueList.AnalystIDs && isPresent <= 0) {
      valueList.AnalystIDs.push(value);
    } else {
      const AnalystIDs = [];
      AnalystIDs.push(value);
      valueList.AnalystIDs = AnalystIDs;
    }
    dropDown.analyst.map((item) => {
      if (item.value === value && isPresent <= 0) {
        showList.push({ text: item.text, value: item.value });
        this.handleGTM('analystsDropdownSelect', item.text);
      }
      this.setState({ showList });
    });
    this.setState({ filters: valueList, dropDownType: 'analyst' });
  }

  handleMouseUp = (e) => {
    if ((e.target.className.indexOf('ui page modals dimmer transition visible active') > -1)) {
      // Adding new classname to overlay parent will not let to close overlay in tablets, on touch of background.
      this.closeModal();
    }
  }

  openModal = () => {
    document.body.addEventListener('touchstart', this.handleMouseUp);
    this.setState({ isOpen: true });
    window.scrollTo(0, 0);
  }

  closeModal = () => {
    document.body.removeEventListener('touchstart', this.handleMouseUp);
    this.setState({ isOpen: false });
  }

  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('noscroll');
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll');
  }

  callDownloadLink = (data) => {
    const filters = this.state.filterToDownload;
    if (data === 'excel') {
      this.setState({ downloadingExcel: true });
      this.props.downloadExcelLink(this.props.api, { filters });
      this.handleGTM('excelDownload', 'StockScreener.xlsx');
    } else {
      this.setState({ downloadingPdf: true });
      this.props.downloadPdfLink(this.props.api, { filters });
      this.handleGTM('pdfDownload', 'StockScreener.pdf');
    }
  }

  submitHandler = () => {
    const { setStockScreenerData, api } = this.props;
    const filters = this.state.filters;
    filters.sortOrder = 'ASC';
    filters.sortType = 'company';
    setStockScreenerData(api, { filters, count: 1 });
    pushToDataLayer('databoutique', 'stockScreenerSubmit', { label: '', action: 'submit' });
    this.setState({ count: 20, pageNo: 1, filterToDownload: JSON.parse(JSON.stringify(filters)) });
  }

  sortTableBy = (type, order) => {
    const { setStockScreenerData, api } = this.props;
    const filters = this.state.filters;
    filters.sortOrder = order;
    filters.sortType = type;
    this.setState({ filters, filterToDownload: filters, count: 20, pageNo: 1, sortClick: true }, () => setStockScreenerData(api, { filters, count: 1 }));
  }

  handleSubmit = (data) => {
    this.setState({ data });
    const { setStockScreenerData, api } = this.props;
    // const { filters } = this.state;
    const filters = this.state.filters;
    filters.sortOrder = 'ASC';
    filters.sortType = 'company';
    Object.keys(data).map((parentKey) => {
      if (parentKey === 'minimum' || parentKey === 'maximum') {
        Object.keys(data[parentKey]).map((key) => {
          filters[key] = data[parentKey][key];
          return null;
        });//eslint-disable-line
      } else if (parentKey === 'location') {
        if (data[parentKey].US && data[parentKey].CA) {
          filters.Country = 'ALL';
        } else if (data[parentKey].US) {
          filters.Country = 'US';
        } else if (data[parentKey].CA) {
          filters.Country = 'CA';
        } else {
          filters.Country = 'ALL';
        }
      } else if (parentKey === 'rating') {
        const rating = [];
        Object.keys(data[parentKey]).map((key) => {
          if (data[parentKey][key] && key !== 'all') {
            rating.push(key);
          }
          return null;
        });//eslint-disable-line
        filters.RatingCSV = rating;
      }
      return null;
    });
    this.setState({ filters, filterToDownload: JSON.parse(JSON.stringify(filters)) });
    setStockScreenerData(api, { filters, count: 1 });
    this.setState({ count: 20, pageNo: 1 });
    this.handleGTM('fieldRangeClick', '');
  }

  handleGTM = (triggerType, label, data) => {
    if (data) {
      pushToDataLayer('databoutique', triggerType, { label, data });
    } else {
      pushToDataLayer('databoutique', triggerType, { label });
    }
  }

  deleteValue = (value) => {
    const { dropDownType } = this.state;
    const showList = this.state.showList;
    const valueList = this.state.filters;
    if (dropDownType === 'sector') {
      valueList.SectorIDs = valueList.SectorIDs.filter(item => item !== value);
    } else {
      valueList.AnalystIDs = valueList.AnalystIDs.filter(item => item !== value);
    }
    this.setState({ showList: showList.filter(item => item.value !== value), filter: JSON.parse(JSON.stringify(valueList)) });
  }

  addCount = () => {
    const { setStockScreenerData, api } = this.props;
    const { count, pageNo } = this.state;
    const filters = this.state.filters;
    this.setState({ count: count + 20, pageNo: pageNo + 1 });
    setStockScreenerData(api, { filters, count: pageNo + 1 });
  }

  closeDownloadingModal = (type) => {
    const typemodal = `downloading${type}`;
    this.setState({ [typemodal]: false });
  }

  getDownloadButtonLinks(result) {
    const { excelDownload, pdfDownload } = this.props;
    if (result) {
      if (Object.keys(result).length) {
        return (
          <div className="download-links">
            <Button className={`pdf download-report ${pdfDownload ? 'selected' : ''}`} onClick={() => this.callDownloadLink('pdf')} content={pdfDownload ? 'Requesting Download...' : 'Download PDF'} />
            <Button className={`pdf download-report ${excelDownload ? 'selected' : ''}`} onClick={() => this.callDownloadLink('excel')} content={excelDownload ? 'Requesting Download...' : 'Excel'} />
          </div>
        );
      }

      return (<div className={'no-result'}>{'No Results Found'}</div>);
    }
    return (<div className={'no-result error'}>Oops! There was an error loading this page. Please try again.</div>);
  }

  render() {
    const { resultLeft, resultRight, headerLeft, headerRight, showList, dropDownType, pageNo, count, pdfFailed, excelFailed, downloadingExcel, downloadingPdf, sortClick, cannabiscount } = this.state;
    const { dropDown, isDataLoading, total, excelDownload, pdfDownload, result, profile } = this.props;
    const asteriskMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.CANNABIS_COMPANY_ASTERISK_MESSAGE) || '';
    const miniSummary = `${total} Companies Found`;
    return (
      <div className="stock-screener-filter-section">
        {
          pdfFailed ?
            <DownloadFailedModal downloadtype={'stockScreenerPdf'} text="PDF Download Unsuccessful" />
            :
            null
        }
        {
          excelFailed ?
            <DownloadFailedModal downloadtype={'stockScreenerExcel'} text="Excel Download Unsuccessful" />
            :
            null
        }
        {
          excelDownload && !excelFailed && downloadingExcel ?
            <DownloadingModal closeModal={this.closeDownloadingModal} text="Loading..." modalType={'Excel'} />
            :
            null
        }
        {
          pdfDownload && !pdfFailed && downloadingPdf ?
            <DownloadingModal closeModal={this.closeDownloadingModal} text="Loading..." modalType={'Pdf'} />
            :
            null
        }
        {this.state.isOpen &&
          <Modal
            open={this.state.isOpen}
            className={'stock-screener-modal'}
            onMount={this.hideBodyScroll()}
            onUnmount={this.showBodyScroll()}
            onClose={this.closeModal}
            closeOnDocumentClick={false}
            closeOnDimmerClick={true}
          >
            <Modal.Content>
              <StockScreenerFilterOverlay
                closeModal={() => this.closeModal()}
                handleSubmit={(data) => this.handleSubmit(data)}
                filters={this.state.data}
              />
            </Modal.Content>
          </Modal>
        }
        <Button className="inline linkBtn field-range-button filter-section-title bmo_chevron right" onClick={this.openModal} content={'Advanced Filters'} />
        <div className="filters-and-buttons">
          <Grid>
            <Grid.Column className={'filter-row'} mobile={12} tablet={12} computer={6}>
              <Grid.Row className={`drops sector-dropdown ${(showList.length && dropDownType === 'sector') ? 'active-div' : 'inactive-div'}`}>
                <div className="mobile-hide">Sector:</div>
                <Dropdown
                  placeholder={'Search'}
                  onChange={this.handleCompanyChange}
                  selection
                  search
                  value={''}
                  options={dropDown.sector}
                  icon={'search'}
                  selectOnBlur={false}
                />
              </Grid.Row>
              <Grid.Row className={`drops sector-dropdown ${(showList.length && dropDownType === 'analyst') ? 'active-div' : 'inactive-div'}`}>
                <div className="mobile-hide">Analyst:</div>
                <Dropdown
                  placeholder={'Search'}
                  onChange={this.handleAnalystChange}
                  selection
                  search
                  value={''}
                  options={dropDown.analyst}
                  icon={'search'}
                  selectOnBlur={false}
                />
              </Grid.Row>
            </Grid.Column>
            {
              showList.length ?
                <Grid.Column className={`selected-section ${dropDownType ? 'active-selected' : 'inactive-selected'}`} mobile={12} tablet={12} computer={6}>
                  {
                    showList.map((item) => {
                      return (
                        <div className="selected-option-div stock-screener-selection">
                          <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={() => this.deleteValue(item.value)} />
                          {item.text}
                        </div>
                      );
                    })
                  }
                </Grid.Column>
                : null
            }
            <div className="sector-dropdown button-div">
              <Button secondary className="inline field-range-button" onClick={this.submitHandler} content={'Submit'} />
            </div>
          </Grid>
        </div>
        <div className={'stock-screener-result-section'}>
          {isDataLoading && pageNo === 1 && !sortClick ? <div className="bmo-red-loader"><Loader active={true} content="Loading..." /></div> : null}
          {(!isDataLoading || pageNo > 1) || sortClick ?
            <div>
              {this.getDownloadButtonLinks(result)}
              {
                result && Object.keys(result).length ?
                  <SlidingTable
                    isResultLoaded={resultRight.length}
                    resultLeft={resultLeft}
                    headerRight={headerRight}
                    headerLeft={headerLeft}
                    resultRight={resultRight}
                    miniSummary={miniSummary}
                    fromStockScreener={true}
                    data={this.props.result}
                    handleGTM={this.handleGTM}
                    sortTableBy={this.sortTableBy}
                    sortClick={sortClick}
                  />
                  : null
              }
              {!profile.cannabis && cannabiscount > 0 && <div className={'asterisk-message'}>{asteriskMessage}</div>}
              {
                isDataLoading && !sortClick && (
                  <div className="load-more-button"><Button onClick={this.addCount} className="load-more">{'Loading...'}</Button></div>
                )
              }
              { !isDataLoading && !sortClick && total && (total >= (this.state.count)) && (total !== count) ?
                <div className="load-more-button"><Button onClick={this.addCount} className="load-more">{'Load More Results'}</Button></div>
                : null
              }
            </div>
            :
            null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  result: resultSelector.stockScreenerData(state),
  dropDown: bmoredSelector.getdropdownList(state),
  isDataLoading: resultSelector.getStockScreenerLoading(state),
  total: resultSelector.getStockScreenerTotal(state),
  excelDownload: bmoredSelector.getBmoStockExcelDownloadLoading(state),
  pdfDownload: bmoredSelector.getBmoStockPdfDownloadLoading(state),
  pdfDownloadFailed: bmoredSelector.getBmoStockPdfDownloadLoadingFailed(state),
  excelDownloadFailed: bmoredSelector.getBmoStockExcelDownloadLoadingFailed(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  setStockScreenerData: (d, data) => {
    dispatch(SET_STOCK_SCREENER_DATA(d, data));
  },
  resetData: () => {
    dispatch({ type: SET_SCREENER_RESULT, data: Object.assign({}), count: 0 });
  },
  setDropDownData: () => {
    dispatch(GET_BMO_RED_DROPDOWN_LIST());
  },
  downloadExcelLink: (api, data) => {
    dispatch(DOWNLOAD_STOCK_SCREENER_EXCEL_LINK(api, data));
  },
  downloadPdfLink: (api, data) => {
    dispatch(DOWNLOAD_STOCK_SCREENER_PDF_LINK(api, data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StockScreenerFilterSection);
