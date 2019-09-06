/* @flow weak */

/*
 * Component: BmoRedSlidingTable
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Checkbox, Button, Container } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { appsettingsVariable } from 'constants/UnchainedVariable';
import {
  bmoredSelector,
  userSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { BmoPopUp, CannabisPreviewModal, LibrarySearchResultOverlay } from 'components';
import './BmoRedSlidingTable.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BmoRedSlidingTable extends Component {
  props: {
    resultLeft: [[], []],
    headerLeft: [],
    headerRight: [],
    resultRight: [[], []],
    mobileViewHeader: [],
    mobileViewRow: [[], []],
    callDownloadApi: () => void,
    allInfoAvailable: boolean,
    downloadIndividualLoading: boolean,
    downloadCompilationLoading: boolean,
    profile: {}
  };

  state = {
    selectAll: true,
    allInfoAvailable: false,
    count: 20,
    wrapper1Width: 0,
    isOpen: false,
  }

  opModal = () => () => {
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    this.setState({ isOpen: false });
  }

  componentDidMount() {
    const tableHeader = document.getElementById('bmotable-width-sliding');
    if (tableHeader) {
      this.setState({ wrapper1Width: tableHeader.getBoundingClientRect().width });//eslint-disable-line
    }
  }

  componentWillMount() {
    const { resultLeft, headerRight, headerLeft, resultRight, mobileViewHeader, mobileViewRow, allInfoAvailable } = this.props;
    this.setState({ resultLeft, headerRight, headerLeft, resultRight, mobileViewHeader, mobileViewRow, allInfoAvailable });
  }

  componentWillReceiveProps(nextProps) {
    const { resultLeft, headerRight, headerLeft, resultRight, mobileViewHeader, mobileViewRow, allInfoAvailable } = nextProps;
    this.setState({ resultLeft, headerRight, headerLeft, resultRight, mobileViewHeader, mobileViewRow, allInfoAvailable });
    setTimeout(() => {
      const tableHeader = document.getElementById('bmotable-width-sliding');
      if (tableHeader) {
        this.setState({ wrapper1Width: tableHeader.getBoundingClientRect().width });//eslint-disable-line
      }
    }, 0);
  }

  wrapper1Scroll = () => {
    const wrapper1 = document.getElementById('bmotable-wrapper-1');
    const wrapper2 = document.getElementById('bmotable-wrapper-2');
    wrapper2.scrollLeft = wrapper1.scrollLeft;
  }
  wrapper2Scroll = () => {
    const wrapper1 = document.getElementById('bmotable-wrapper-1');
    const wrapper2 = document.getElementById('bmotable-wrapper-2');
    wrapper1.scrollLeft = wrapper2.scrollLeft;
  }

  checkBoxClick = (index) => (e, checkBox) => {
    const { resultRight } = this.state;
    const isChecked = !checkBox.checked;
    let selectAll = true;
    resultRight[index][0] = isChecked;
    resultRight.map((data) => {
      const dataVal = data;
      if (!dataVal[0]) {
        selectAll = false;
      }
    });
    this.setState({ resultRight, selectAll });
  }

  selectAllCheckbox = () => (e, checkBox) => {
    const { resultRight } = this.state;
    const isChecked = !checkBox.checked;
    resultRight.map((data) => {
      const dataVal = data;
      dataVal[0] = isChecked;
    });
    this.setState({ selectAll: isChecked, resultRight });
  }

  handleDownloadLinkClick = (linkType, linkText) => () => {
    const { resultRight, resultLeft } = this.state;
    const bmIds = [];
    resultRight.map((data, i) => {
      const dataVal = data;
      if (dataVal[0]) {
        if (!resultLeft[i][1].disableCheckBox) {
          bmIds.push(dataVal[1]);
        }
      }
    });
    this.props.callDownloadApi(linkType, bmIds);
    pushToDataLayer('databoutique', 'searchFilter', { action: linkText, label: '' });
  }

  specificCompanyClick = (companyName) => () => {
    pushToDataLayer('databoutique', 'searchFilter', { action: 'Company', label: companyName });
  }

  resultleftsection = () => {
    const { resultLeft, resultRight } = this.state;
    const results = [];
    const count = resultLeft.length <= this.state.count ? resultLeft.length : this.state.count;

    for (let i = 0; i < count; i += 1) {
      const aResultRow = resultLeft[i];
      const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(aResultRow[1].CompanyTicker)}&searchTicker=${encodeURIComponent(aResultRow[1].CompanyTicker)}`;
      results.push(
        <div className={`result-section a-sliding-table-row-left row-color-${(i % 2).toString()}`}>
          <div key={`row-${i}`} className="result-cell-checkbox">
            {aResultRow[1].disableCheckBox ?
              <Button tabIndex={0} className={'user-pref-icon lock-icon desktop-lock'} onTouchStart={this.opModal()} title={'cannabis-modal'}>
                <BmoPopUp
                  debug={false}
                  showInToggleMode={true}
                  rightPosBuff={30}
                  direction="horizontal-mid"
                  strictDirection="right"
                  leftBuff={20}
                >
                  <CannabisPreviewModal message={appsettingsVariable.ENTITLEMENT_CANNABIS_PUBLICATION_MESSAGE || ''} />
                </BmoPopUp>
              </Button>
              :
              <Checkbox
                checked={resultRight[i][0]}
                onClick={this.checkBoxClick(i)}
                className={`${resultRight[i][0] ? 'bmo_chevron tick' : ''}`}
              />
            }
          </div>
          <Container
            className={'result-cell'}
            as={aResultRow[1].is_active && !aResultRow[1].hide ? NavLink : 'div'}
            to={aResultRow[1].is_active && !aResultRow[1].hide ? toUrl : ''}
          >
            <span
              className="cell companyName"
              role="button"
              onClick={this.specificCompanyClick(aResultRow[1].CompanyName)}
              tabIndex={0}
              onKeyPress={() => {}}
              title={aResultRow[1].CompanyName}
            >
              {aResultRow[1].CompanyName}
            </span>
            <span className="companyTicker">{aResultRow[1].CompanyTicker ? `(${aResultRow[1].CompanyTicker})` : ''}</span>
          </Container>
        </div>
      );
    }
    return (results);
  }

  resultRightSection = () => {
    const { resultRight } = this.state;
    const results = [];
    const count = resultRight.length <= this.state.count ? resultRight.length : this.state.count;
    for (let i = 0; i < count; i += 1) {
      const x = resultRight[i];
      results.push(
        <div className={`result-section a-sliding-table-row-right row-color-${(i % 2).toString()}`}>
          {
            x.map((y, i) => {
              if (i === 0 || i === 1) return null;
              return (<div className="result-cell">
                <span className="cell">{y}</span>
              </div>);
            })
          }
        </div>
      );
    }
    return (results);
  }

  mobileresults = () => {
    const { mobileViewRow, resultRight } = this.state;
    const results = [];
    const count = mobileViewRow.length <= this.state.count ? mobileViewRow.length : this.state.count;
    for (let i = 0; i < count; i += 1) {
      const aResultRow = mobileViewRow[i];
      const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(aResultRow[1].CompanyTicker)}&searchTicker=${encodeURIComponent(aResultRow[1].CompanyTicker)}`;
      results.push(
        <div key={`row-mob-${i}`} className={`row-color-${(i % 2).toString()}`}>
          <div className="result-cell-checkbox">
            {aResultRow[1].disableCheckBox ?
              <Button tabIndex={0} className={'user-pref-icon mobile lock-icon'} onClick={this.opModal()} title={'cannabis-modal'} />
              :
              <Checkbox
                checked={resultRight[i][0]}
                onClick={this.checkBoxClick(i)}
                className={`${resultRight[i][0] ? 'bmo_chevron tick' : ''}`}
              />
            }
          </div>
          <div className="result-row">
            <Container
              className={'company'}
              as={aResultRow[1].is_active && !aResultRow[1].hide ? NavLink : 'span'}
              to={aResultRow[1].is_active && !aResultRow[1].hide ? toUrl : ''}
            >
              {aResultRow[1].CompanyName}
            </Container>
            <div className={'row-items'}>
              <span>{aResultRow[1].RatingDesc}</span>
              <span>{aResultRow[1].ClosingPrice}</span>
              <span>{aResultRow[1].TargetPrice}</span>
              <span>{aResultRow[1].Yield}</span>
            </div>
          </div>
        </div>
      );
    }
    return <div className={'body-row'}>{results}</div>;
  }

  addCount = () => {
    this.setState({ count: this.state.count + 20 });
  }
  componentDidUpdate() {
    const rowsRight = document.getElementsByClassName('result-section a-sliding-table-row-right');
    const rowsLeft = document.getElementsByClassName('result-section a-sliding-table-row-left');
    for (let i = 0; i < Math.min(rowsRight.length, rowsLeft.length); i += 1) {
      const heightRight = rowsRight[i].getBoundingClientRect().height;
      const heightLeft = rowsLeft[i].getBoundingClientRect().height;
      const maxPossibleHeight = heightRight < heightLeft ? heightLeft : heightRight;
      rowsRight[i].style.height = `${maxPossibleHeight}px`;
      rowsLeft[i].style.height = `${maxPossibleHeight}px`;
    }
  }
  render() {
    const { headerRight, headerLeft, resultRight, resultLeft, selectAll, mobileViewHeader, allInfoAvailable, wrapper1Width } = this.state;
    const { isOpen } = this.state;
    const { downloadIndividualLoading, downloadCompilationLoading, profile } = this.props;
    const asteriskMessage = (appsettingsVariable.CANNABIS_COMPANY_ASTERISK_MESSAGE) || '';
    let numOfCompanies = 0;
    let cannabiscount = 0;
    let showDownloadButton = true;

    if (allInfoAvailable) {
      resultRight.map((data, i) => {
        if (data[0]) {
          numOfCompanies += 1;
        }
        if (resultLeft[i][1].disableCheckBox) {
          cannabiscount += 1;
        }
        if ((numOfCompanies === cannabiscount) && !profile.cannabis) {
          showDownloadButton = false;
        }
      });
    }
    const numOfCompanyText = numOfCompanies === 1 ? '1 Company Selected' : `${numOfCompanies} Companies Selected`;
    return (
      <div className="bmo-red-sliding-table">
        <div className={'table-top-section'}>
          <div className={'download-link'}>
            { numOfCompanies > 0 && showDownloadButton &&
              <Button
                onClick={this.handleDownloadLinkClick('Individual', 'Individual Company File Download')}
                className={`linkBtn download-report ${downloadIndividualLoading ? 'selected' : ''}`}
                content={downloadIndividualLoading ? 'Requesting Download...' : 'Individual Company Files'}
              />
            }
            {numOfCompanies > 0 && showDownloadButton && <Button
              onClick={this.handleDownloadLinkClick('Compilation', 'Compilation booklet download')}
              className={`linkBtn download-report ${downloadCompilationLoading ? 'selected' : ''}`}
              content={downloadCompilationLoading ? 'Requesting Download...' : 'Compilation Booklet'}
            />}
          </div>
          {allInfoAvailable ? <div className={'num-of-companies'}>{numOfCompanyText}</div> : <div className={'num-of-companies'}>{'0 Companies Found'}</div>}
        </div>
        {
          allInfoAvailable ?
            <div className="results">
              <div className="table-left">
                <div className="head-section">
                  {
                    allInfoAvailable && headerLeft.map(colVal => {
                      if (colVal === '__CHECK_BOX') {
                        return <div className="header-cell-checkbox"><Checkbox checked={selectAll} className={`${selectAll ? 'bmo_chevron tick' : ''}`} onClick={this.selectAllCheckbox()} /></div>;
                      }
                      return <div className={` ${!allInfoAvailable ? 'no-checkbox' : ''} header-cell`}><span className="cell">{colVal}</span></div>;
                    })
                  }
                </div>
                {allInfoAvailable ? this.resultleftsection() : null}
              </div>
              <div className="table-right" id={'bmotable-wrapper-2'} onScroll={this.wrapper2Scroll}>
                <div className="wrapper1" id={'bmotable-wrapper-1'} onScroll={this.wrapper1Scroll}>
                  <div className="div1" style={{ width: `${wrapper1Width}px` }} />
                </div>
                <div className="head-section" id={'bmotable-width-sliding'}>
                  {
                    allInfoAvailable && headerRight.map(x => <div className="header-cell"><span className="cell">{x}</span></div>)
                  }
                </div>
                {allInfoAvailable ? this.resultRightSection() : null }
              </div>
              {!profile.cannabis && cannabiscount > 0 && <div className={'asterisk-message'}>{asteriskMessage}</div>}
              {allInfoAvailable && (allInfoAvailable > (this.state.count)) ?
                <div className="load-more-button"><Button onClick={this.addCount} className="load-more">Load More Results</Button></div>
                : null
              }
            </div>
            :
            null
        }
        {
          allInfoAvailable ?
            <div className={'mobile-result'}>
              <div className={'header-row'}>
                {
                  mobileViewHeader.map(colVal => {
                    if (colVal === '__CHECK_BOX') {
                      return <div className="header-cell-checkbox"><Checkbox checked={selectAll} className={`${selectAll ? 'bmo_chevron tick' : ''}`} onClick={this.selectAllCheckbox()} /></div>;
                    }
                    return <div className={'header-value'}><span>{colVal}</span></div>;
                  })
                }
              </div>
              {allInfoAvailable ? this.mobileresults() : <div className={'empty-table'}>No Results found</div>}
              {allInfoAvailable && (allInfoAvailable >= (this.state.count)) ?
                <div className="load-more-button"><Button onClick={this.addCount} className="load-more">Load More Results</Button></div>
                : null
              }
              {!profile.cannabis && cannabiscount > 0 && <div className={'asterisk-message'}>{asteriskMessage}</div>}
            </div>
            : null
        }
        {(isOpen && (window.innerWidth < 769)) &&
          <LibrarySearchResultOverlay
            isOpen={isOpen}
            message={appsettingsVariable.ENTITLEMENT_CANNABIS_PUBLICATION_MESSAGE || ''}
            isCannabis={true}
            isNotLibrary={true}
            closeModal={() => this.closeModal()}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  downloadIndividualLoading: bmoredSelector.getBmoredIndividualDownloadLoading(state),
  downloadCompilationLoading: bmoredSelector.getBmoredCompilationDownloadLoading(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = () => ({
  //
});

export default connect(mapStateToProps, mapDispatchToProps)(BmoRedSlidingTable);
