/* @flow weak */

/*
 * Component: BmoRedResultSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BmoRedSlidingTable, DownloadFailedModal, DownloadingModal } from 'components';
import { Loader } from 'unchained-ui-react';
import {
  bmoredSelector
} from 'store/selectors';

import {
  DOWNLOAD_BMO_RED_LINK
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BmoRedResultSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BmoRedResultSection extends Component {
  props: {
    resultList: [],
    downloadLink: () => void,
    isDataLoading: boolean,
    downloadUniversalLoading: boolean,
    slidingTableOpen: bool,
    universeDownloadFailed: bool,
    compilationDownloadFailed: bool,
    individualDownloadFailed: bool,
    downloadCompilationLoading: bool,
    downloadIndividualLoading: bool,
  };

  static defaultProps = {
  };

  state = {
    resultLeft: [],
    headerLeft: [],
    headerRight: [],
    resultRight: [],
    mobileViewHeader: [],
    mobileViewRow: [],
    isDataLoading: false,
    downloadingUniverse: false,
    downloadingCompilation: false,
    downloadingIndividual: false,
  };

  componentWillMount() {
    this.setState({ initialLoad: true });
  }

  componentWillReceiveProps(nextProps) {
    const { resultList, isDataLoading, universeDownloadFailed, compilationDownloadFailed, individualDownloadFailed } = nextProps;
    if (isDataLoading !== this.props.isDataLoading) {
      this.setState({ isDataLoading, initialLoad: false });
    }
    this.setState({ universeDownloadFailed, compilationDownloadFailed, individualDownloadFailed });
    this.setResultSet(resultList);
  }

  headerRightConfigMap = {
    RatingDesc: 'Rating',
    ClosingPrice: 'Close',
    TargetPrice: 'Target Price',
    TotalReturn: 'Total Return',
    CurrentEPS: 'Current EPS',
    CurrentPE: 'Current PE',
    NextEPS: 'Next EPS',
    NextPE: 'Next PE',
    Proj2YrEPSGrowth: '2Yr EPS Gr',
    Yield: 'Yield',
    PriceChange1Yr: '1Yr Price Chng',
    MarketCap: 'Market Cap(mm)',
  };

  headerLeftConfigMap = {
    CompanyName: 'Company'
  };

  resultLeftConfigMap = {
    CompanyName: 'Company',
    CompanyTicker: 'Ticker',
    disableCheckBox: 'disableCheckBox',
    is_active: 'active',
    hide: 'hide',
  }

  mobileHeaderConfigMap = {
    RatingDesc: 'Rating',
    ClosingPrice: 'Close',
    TargetPrice: 'Target Price',
    Yield: 'Yield',
  }

  mobileResultConfigMap = {
    CompanyTicker: 'Ticker',
    is_active: 'active',
    hide: 'hide',
    CompanyName: 'Company',
    RatingDesc: 'Rating',
    ClosingPrice: 'Close',
    TargetPrice: 'Target Price',
    Yield: 'Yield',
    disableCheckBox: 'disableCheckBox',
  }

  setResultSet(res = this.props.resultList) {
    if (res && res instanceof Array) {
      const result = res;
      const resultRight = [];
      const resultLeft = [];
      const headerLeft = [];
      const headerRight = [];
      const mobileViewHeader = [];
      const mobileViewRow = [];

      const headerRightKeys = Object.keys(this.headerRightConfigMap);
      const headerLeftKeys = Object.keys(this.headerLeftConfigMap);
      const resultLeftKeys = Object.keys(this.resultLeftConfigMap);
      const mobileHeaderKeys = Object.keys(this.mobileHeaderConfigMap);
      const mobileResultKeys = Object.keys(this.mobileResultConfigMap);

      result.map((r, i) => {
        headerLeftKeys.map((l) => {
          if (i === 0) headerLeft.push(this.headerLeftConfigMap[l]);
          return l;
        }).filter(d => (d !== null));

        resultRight.push(headerRightKeys.map((l) => {
          if (i === 0) headerRight.push(this.headerRightConfigMap[l]);
          return r[l];
        }).filter(d => (d !== null)));
        resultRight[i] = [r.BMID, ...resultRight[i]];

        const resultLeftValue = {};
        resultLeftKeys.map((l) => {
          resultLeftValue[l] = r[l];
        });
        resultLeft.push(['__CHECK_BOX', resultLeftValue]);

        const mobileResultValue = {};
        mobileResultKeys.map((l) => {
          mobileResultValue[l] = r[l];
        });
        mobileViewRow.push(['__CHECK_BOX', mobileResultValue]);

        mobileHeaderKeys.map((l) => {
          if (i === 0) mobileViewHeader.push(this.mobileHeaderConfigMap[l]);
        }).filter(d => (d !== null));
        return null;
      });
      this.setState({ resultRight, resultLeft, headerLeft, headerRight, mobileViewHeader, mobileViewRow });
    }
  }

  callDownloadLink = (linkType, bmIds) => {
    const typemodal = `downloading${linkType}`;
    this.setState({ [typemodal]: true });
    this.props.downloadLink(linkType, bmIds);
  }

  closeDownloadingModal = (type) => {
    const typemodal = `downloading${type}`;
    this.setState({ [typemodal]: false });
  }

  render() {
    let { headerLeft, mobileViewHeader } = this.state;
    const { headerRight, mobileViewRow, resultLeft, resultRight, isDataLoading, downloadingUniverse, downloadingIndividual, downloadingCompilation } = this.state;
    headerLeft = ['__CHECK_BOX', ...headerLeft];
    mobileViewHeader = ['__CHECK_BOX', ...mobileViewHeader];
    const headerRightItems = Object.values(this.headerRightConfigMap);
    const mobileHeaderItem = Object.values(this.mobileHeaderConfigMap);
    const resultRightData = JSON.parse(JSON.stringify(resultRight));
    resultRightData.map((data) => {
      const dataVal = data;
      dataVal.splice(0, 0, true);
    });
    const allInfoAvailable = (resultRightData.length && resultLeft.length && headerLeft.length && headerRight.length && mobileViewHeader.length && mobileViewRow.length);
    const {
      slidingTableOpen,
      downloadUniversalLoading,
      universeDownloadFailed,
      downloadCompilationLoading,
      downloadIndividualLoading,
      compilationDownloadFailed,
      individualDownloadFailed,
    } = this.props;

    return (
      <div className="bmo-red-result-section">
        {
          universeDownloadFailed ?
            <DownloadFailedModal downloadtype={'bmoRedUniverse'} text="BMO RED Universe download unsuccessful. Please try again." />
            :
            null
        }
        {
          compilationDownloadFailed ?
            <DownloadFailedModal downloadtype={'bmoRedCompilation'} text="BMO RED download unsuccessful. Please try again." />
            :
            null
        }
        {
          individualDownloadFailed ?
            <DownloadFailedModal downloadtype={'bmoRedIndividual'} text="BMO RED download unsuccessful. Please try again." />
            :
            null
        }
        {
          downloadUniversalLoading && downloadingUniverse && !universeDownloadFailed ?
            <DownloadingModal closeModal={this.closeDownloadingModal} text="Loading..." modalType={'Universe'} />
            :
            null
        }
        {
          downloadCompilationLoading && downloadingCompilation && !compilationDownloadFailed ?
            <DownloadingModal closeModal={this.closeDownloadingModal} text="Loading..." modalType={'Compilation'} />
            :
            null
        }
        {
          downloadIndividualLoading && downloadingIndividual && !individualDownloadFailed ?
            <DownloadingModal closeModal={this.closeDownloadingModal} text="Loading..." modalType={'Individual'} />
            :
            null
        }
        {slidingTableOpen && !isDataLoading ?
          <BmoRedSlidingTable
            resultRight={resultRightData}
            resultLeft={resultLeft}
            headerLeft={allInfoAvailable ? headerLeft : ['Company']}
            headerRight={allInfoAvailable ? headerRight : headerRightItems}
            allInfoAvailable={allInfoAvailable}
            mobileViewHeader={allInfoAvailable ? mobileViewHeader : mobileHeaderItem}
            mobileViewRow={mobileViewRow}
            callDownloadApi={this.callDownloadLink}
          />
          :
          null
        }
        {isDataLoading ? <div className="bmo-red-loader"><Loader active={true} content="Loading..." /></div> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  resultList: bmoredSelector.getResultList(state),
  isDataLoading: bmoredSelector.getBmoRedLoading(state),
  downloadUniversalLoading: bmoredSelector.getBmoredUniversalDownloadLoading(state),
  downloadCompilationLoading: bmoredSelector.getBmoredCompilationDownloadLoading(state),
  downloadIndividualLoading: bmoredSelector.getBmoredIndividualDownloadLoading(state),
  universeDownloadFailed: bmoredSelector.getBmoredUniverseDownloadLoadingFailed(state),
  compilationDownloadFailed: bmoredSelector.getBmoredCompilationDownloadLoadingFailed(state),
  individualDownloadFailed: bmoredSelector.getBmoredIndividualDownloadLoadingFailed(state),
});

const mapDispatchToProps = (dispatch) => ({
  downloadLink: (linkType, bmIds) => {
    dispatch(DOWNLOAD_BMO_RED_LINK(linkType, bmIds));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BmoRedResultSection);
