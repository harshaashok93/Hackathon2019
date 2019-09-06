/* @flow weak */

/*
 * Component: CoverageListingResult
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { CoverageResultSlice, CoverageOverlay } from 'components';
import { Button, Loader } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { appsettingsVariable } from 'constants/UnchainedVariable';

import {
  GET_OUR_DEPARTMENT_SECTOR_DATA,
  GET_USER_PROFILE_PREFERENCES
} from 'store/actions';
import {
  departmentSelector,
  userSelector
} from 'store/selectors';
import {
  numberWithCommas
} from 'utils';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './CoverageListingResult.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CoverageListingResult extends Component {
  props: {
    sectorData: [],
    isLoading: bool,
    applySelection: () => void,
    selectedSectorId: number,
    extendedSubSectors: [],
    getUserProfilePreferences: () => void,
    isSubsector: boolean,
    total: number,
    isOverLayLoading: bool,
    profile: {},
    showCannabis: bool
  };

  static defaultProps = {
  };

  state = {
    defaultOrderClass: 'click-area',
    selectedSectorId: 0,
    orderby: 'ticker',
    checkOrder: 'ticker',
    order: 0,
    count: 20,
    noOfResultRow: 20,
    pageNo: 1,
  };
  marketCapOptions = [{
    key: 'LARGE_CAP',
    value: 'large_cap',
    text: 'Large Cap'
  },
  {
    key: 'SMALL_CAP',
    value: 'small_cap',
    text: 'Small Cap'
  }];

  pageScrollPosition = '';
  resetScrollPosition = false;
  pageSortScrollPosition = '';
  componentWillMount() {
    const { applySelection, selectedSectorId, extendedSubSectors, isSubsector } = this.props;
    this.setState({ extendedSubSectors });
    if (isSubsector) {
      applySelection('', { gics_code: selectedSectorId, ordertype: 0, orderby: 'ticker', count: 1 });
    } else {
      applySelection('', { sectorId: selectedSectorId, ordertype: 0, orderby: 'ticker', count: 1 });
    }
    this.props.getUserProfilePreferences();
  }

  componentWillReceiveProps(nextProps) {
    this.resetScrollPosition = false;
    this.nodataScrollPosition = false;
    this.sortScrollPosition = false;
    if (((nextProps.sectorData && (nextProps.isLoading && this.state.pageNo <= 1)) || (nextProps.sectorData && nextProps.sectorData.length < 20))) {
      this.nodataScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.sectorData ? nextProps.sectorData.length : 0 });
    } else if (nextProps.sectorData && this.state.noOfResultRow < nextProps.sectorData.length && this.pageScrollPosition) {
      this.resetScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.sectorData.length });
    } else if (nextProps.sectorData && this.state.noOfResultRow >= nextProps.sectorData.length) {
      this.sortScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.sectorData.length });
    }
    this.setState({ extendedSubSectors: nextProps.extendedSubSectors });
    if (nextProps.selectedSectorId !== this.state.selectedSectorId) {
      this.setState({ selectedSectorId: nextProps.selectedSectorId, defaultOrderClass: 'click-area', count: 20, pageNo: 1 });
      nextProps.isSubsector ?
        this.props.applySelection('', { gics_code: nextProps.selectedSectorId, ordertype: 0, orderby: 'ticker', count: 1 })
        :
        this.props.applySelection('', { sectorId: nextProps.selectedSectorId, ordertype: 0, orderby: 'ticker', count: 1 });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.closeModal);
  }

  closeModal = (e) => {
    if (e.keyCode === 27) {
      this.closeGraphModal();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.closeModal);
  }

  componentDidUpdate() {
    if (this.resetScrollPosition && this.pageScrollPosition) {
      document.getElementById('sticky-component-ii').style.position = 'fixed';
      if (window.innerHeight <= 450) {
        document.getElementById('sticky-component-ii').style.bottom = '20px';
      } else if (window.innerWidth > 768) {
        document.getElementById('sticky-component-ii').style.bottom = '245px';
      } else {
        document.getElementById('sticky-component-ii').style.bottom = '290px';
      }
      window.scrollTo(0, this.pageScrollPosition);
    }

    if (this.sortScrollPosition && this.pageSortScrollPosition) {
      window.scrollTo(0, this.pageSortScrollPosition);
    }

    if (this.nodataScrollPosition) {
      this.pageScrollPosition = '';
      this.pageSortScrollPosition = '';
      window.scrollTo(0, 0);
    }
  }

  sortBy = (orderby, selectedSectorId) => () => {
    this.pageSortScrollPosition = document.getElementById('coverage-title-bar-id').offset;
    this.pageScrollPosition = '';
    let order = '';
    if (this.state.orderby !== orderby) {
      this.setState({ orderby, checkOrder: orderby, defaultOrderClass: 'click-area reverse-sort', order: 1, count: 20, pageNo: 1 });
      order = 1;
    } else {
      this.setState({ orderby: '', checkOrder: orderby, defaultOrderClass: 'click-area', order: 0, count: 20, pageNo: 1 });
      order = 0;
    }
    if (this.props.isSubsector) {
      this.props.applySelection('', { gics_code: selectedSectorId, ordertype: order, orderby, count: 1 });
    } else {
      this.props.applySelection('', { sectorId: selectedSectorId, ordertype: order, orderby, count: 1 });
    }
  }
  renderResults = (sectorData) => {
    if (!sectorData) return null;
    const ResultRow = [];
    if (sectorData && sectorData.length) {
      sectorData.map((item, i) => {
        ResultRow.push(<CoverageResultSlice index={i} showCoverageModel={this.showCoverageModel} data={item} />);
      });
      return ResultRow;
    }
    return <div className={'no-results-found'}>No Results Found</div>;
  }
  getResultCount = () => {
    const { sectorData } = this.props;
    const { total } = this.props;
    if (sectorData && sectorData.length === 1) {
      return `${numberWithCommas(total)} Result`;
    }
    return `${numberWithCommas(total)} Results`;
  }

  addCount = () => {
    this.pageScrollPosition = document.getElementById('srp-view-more').offsetTop;
    this.pageSortScrollPosition = '';
    const { applySelection, selectedSectorId, isSubsector } = this.props;
    const { count, pageNo, order, checkOrder } = this.state;
    this.setState({ count: count + 20, pageNo: pageNo + 1 }, () => {
      if (isSubsector) {
        applySelection('load', { gics_code: selectedSectorId, ordertype: order, orderby: checkOrder, count: pageNo + 1 });
      } else {
        applySelection('load', { sectorId: selectedSectorId, ordertype: order, orderby: checkOrder, count: pageNo + 1 });
      }
    });
  }
  showCoverageModel = () => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('noscroll');
    this.setState({ showCoverageOverlay: true });
  }
  closeGraphModal = () => {
    document.body.style.overflow = 'auto';
    document.body.classList.remove('noscroll');
    this.setState({ showCoverageOverlay: false });
  }

  getOverlay = (showCoverageOverlay) => {
    if (showCoverageOverlay) {
      return (
        <div className={'dimmer-wrapper-coverage'}>
          <div className="coverage-overlay-modal" id="coverage-overlay-modal" onKeyPress={() => {}} role="button" tabIndex={0}>
            <div className="coverage-overlay-modal-content">
              <div className="bmo-close-btn-holder">
                <Button className="close-icon bmo-close-btn" onClick={this.closeGraphModal} />
              </div>
              {
                !this.props.isOverLayLoading ?
                  <CoverageOverlay
                    container="coverage-overlay-modal"
                  />
                  : <div className="coverage-result-loader"><Loader active={true} content="Loading..." /></div>
              }
            </div>
          </div>
          <div className="clickable-background" onKeyPress={() => {}} role="button" tabIndex={0} onClick={this.closeGraphModal} />
        </div>
      );
    }
    return null;
  }
  render() {
    const { sectorData, selectedSectorId, isLoading, total, profile, showCannabis } = this.props;
    const { count, pageNo, showCoverageOverlay } = this.state;
    const asteriskMessage = (appsettingsVariable.CANNABIS_COMPANY_ASTERISK_MESSAGE) || '';
    return (
      <div className="coverage-listing-result right-layout" id={'our-dept-result-wrapper-id'}>
        <div className="result-count-sector-name">
          <div className="result-count">
            {this.getResultCount()}
          </div>
        </div>
        <div className="result-card">
          <div className="result-card-header" id={'coverage-title-bar-id'}>
            <div className="company head-cell">
              <Button className={this.state.orderby === 'name' ? 'click-area reverse-sort' : 'click-area'} onClick={this.sortBy('name', selectedSectorId)}>
                Company<i aria-hidden="true" className="caret down icon" title={'Sort by Company'} />
              </Button>
            </div>
            <div className="sector head-cell">
              <Button className={this.state.orderby === 'sector' ? 'click-area reverse-sort' : 'click-area'} onClick={this.sortBy('sector', selectedSectorId)}>
                Sector <i aria-hidden="true" className="caret down icon" title={'Sort by Sector'} />
              </Button>
            </div>
            <div className="rating head-cell">
              <Button className={this.state.orderby === 'rating' ? 'click-area reverse-sort' : 'click-area'} onClick={this.sortBy('rating', selectedSectorId)}>
                Rating <i aria-hidden="true" className="caret down icon" title={'Sort by Rating'} />
              </Button>
            </div>
            <div className="analyst head-cell">
              <Button className={this.state.orderby === 'analyst' ? 'click-area reverse-sort' : 'click-area'} onClick={this.sortBy('analyst', selectedSectorId)}>
                Analysts <i aria-hidden="true" className="caret down icon" title={'Sort by Analysts'} />
              </Button>
            </div>
          </div>
          <div className="result-card-data">
            {isLoading && pageNo === 1 ? <div className={'sector-result-loader'}><Loader active={true} content="Loading..." /></div> : null}
          </div>
          {
            !isLoading || pageNo > 1 ?
              <div>
                <div className="result-card-data">
                  {this.renderResults(sectorData)}
                  {this.getOverlay(showCoverageOverlay)}
                </div>
                { !profile.cannabis && showCannabis && <div className={'asterisk-message'}>{asteriskMessage}</div>}
                {
                  isLoading && (
                    <div className="load-more-button"><Button onClick={this.addCount} className="load-more">{'Loading...'}</Button></div>
                  )
                }
                { !isLoading && total && (total >= (count)) && (total !== count) ?
                  <div className="load-more-button"><Button id="srp-view-more" onClick={this.addCount} className="load-more">{isLoading ? 'Loading...' : 'Load More Results'}</Button></div>
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
  isOverLayLoading: departmentSelector.isOverLayLoading(state),
  sectorData: departmentSelector.getSectorData(state),
  selectedSectorId: departmentSelector.getSelectedSectorId(state),
  isLoading: departmentSelector.isSectorDataLoading(state),
  extendedSubSectors: departmentSelector.getExtendedSubSectors(state),
  isSubsector: departmentSelector.getSelectedSectorIsSubsector(state),
  total: departmentSelector.getCoverageDataArrayTotal(state),
  profile: userSelector.getUserProfileInfo(state),
  showCannabis: departmentSelector.getShowCannabis(state)
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfilePreferences: () => {
    dispatch(GET_USER_PROFILE_PREFERENCES());
  },
  applySelection: (type, data) => {
    dispatch(GET_OUR_DEPARTMENT_SECTOR_DATA(type, data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CoverageListingResult);
