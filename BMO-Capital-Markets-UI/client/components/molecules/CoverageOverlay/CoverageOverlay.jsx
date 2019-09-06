/* @flow weak */

/*
 * Component: CoverageOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { BmoHighChart, CoverageOverlayAnalystConnection } from 'components';
import { Image, Button, Container } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { DEFAULT_PROFILE } from 'constants/assets';
import { toShowAnalyst } from 'utils';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  SET_COMP_TICKER_FROM_DEPARTMENT
} from 'store/actions';
import {
  departmentSelector,
  researchSelector
} from 'store/selectors';
import './CoverageOverlay.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CoverageOverlay extends Component {
  props: {
    isLoading: bool,
    fromMobileLibrary: bool,
    coverageData: {
      companyData: {},
      tableData: {},
      graphData: {},
      tableHeader: {},
      day_5: [],
      month_6: [],
      year_1: [],
      year_3: [],
      publicationData: [],
    },
    onlyGraphData: bool,
    forThePage: '',
    graphHeight: '',
    setCompanyTicker: () => void,
    researchLayoutMetaDataLoading: bool,
    container: '',
    closeGraphModal: () => void,
  };

  static defaultProps = {
  };

  state = {
    isExpanded: false,
    isTableSummaryExpanded: true,
    currentGraphData: '1_YEAR_DATA',
    publicationData: []
  };
  expandSectionDetails = () => {
    const isExpanded = !this.state.isExpanded;
    this.setState({ isExpanded });
  }
  componentWillUnmount = () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll');
  }
  expandTableSummary = () => {
    const isTableSummaryExpanded = !this.state.isTableSummaryExpanded;
    this.setState({ isTableSummaryExpanded });
  }
  graphPeriodChange = (duration) => () => {
    this.setState({ currentGraphData: duration });
  }

  linkConfig = {
    disclosure: 'Disclosure',
    changes: 'Changes',
    redSheet: 'Red Sheet',
    website: 'Website',
    charts: 'Charts',
  };
  setCompanyTicker = (ticker) => () => {
    this.props.setCompanyTicker(ticker);
  }

  handleNavClick = (label) => {
    pushToDataLayer('ourdepartment', 'OurCoverageOverlayPage', { label, action: 'Related Click' });
  }

  getRelatedLinks = (relatedLinks) => {
    if (!relatedLinks) {
      return null;
    }
    const keys = Object.keys(relatedLinks);
    const validKeys = [];
    let count = -1;
    keys.map(links => { relatedLinks[links] !== '' ? validKeys.push(links) : null; return null; });
    const relatedLinksHTML = validKeys.map(links => {
      const linkName = this.linkConfig[links] || '';

      if (relatedLinks[links]) {
        count += 1;
        if (count < validKeys.length - 1) {
          return (
            <span className="a-link">
              {relatedLinks[links].link_target === 'newTab' ?
                <a target="_blank" onClick={() => this.handleNavClick(linkName)} href={relatedLinks[links].url}>{linkName}</a>
                :
                <NavLink to={relatedLinks[links].url} onClick={() => this.handleNavClick(linkName)}>{linkName}</NavLink>
              }
            •</span>
          );
        }
        return (
          <span className="a-link">
            {relatedLinks[links].link_target === 'newTab' ?
              <a target="_blank" href={relatedLinks[links].url} onClick={() => this.handleNavClick(linkName)}>{linkName}</a>
              :
              <NavLink to={relatedLinks[links].url} onClick={() => this.handleNavClick(linkName)}>{linkName}</NavLink>
            }
          </span>
        );
      }
      return null;
    });
    return <div className="links">{relatedLinksHTML}</div>;
  }

  onAnalystClick = (analystInfo) => () => {
    const gtmData = {
      'BMO Analyst Name': analystInfo.name,
      'BMO Analyst Job Title': analystInfo.position || '',
      'Sector Name': analystInfo.sectors ? Object.keys(analystInfo.sectors).map((key) => key).join(';') : '',
    };
    pushToDataLayer('ourdepartment', 'OurCoverageOverlayPage', { label: analystInfo.name, action: 'Analyst Click', data: gtmData });
  }

  render() {
    const { isExpanded, isTableSummaryExpanded, currentGraphData } = this.state;
    if (!this.props.coverageData && !this.props.isLoading) return <div className="coverage-overlay coverage-errorMsg">Oops! There was an error loading this page. Please try again.</div>;

    const {
      companyData,
      tableData,
      graphData,
      tableHeader,
      publicationData
    } = this.props.coverageData;
    const { onlyGraphData, forThePage, graphHeight, researchLayoutMetaDataLoading } = this.props;

    let roles = [];
    roles = companyData && companyData.analyst && companyData.analyst.roles.map((item) => {
      return (
        { name: item }
      );
    });

    let secondaryAnalystRoles = [];
    secondaryAnalystRoles = companyData && companyData.secondary_analyst && companyData.secondary_analyst.roles.map((item) => {
      return (
        { name: item }
      );
    });

    const analystData = {
      roles,
      client_code: companyData && companyData.analyst && companyData.analyst.client_code
    };

    const secondaryAnalystData = {
      roles: secondaryAnalystRoles,
      client_code: companyData && companyData.secondary_analyst && companyData.secondary_analyst.client_code
    };

    const secondaryAnalystCompanyData = {
      analyst: companyData && companyData.secondary_analyst
    };

    const isActive = (companyData && companyData.analyst && companyData.analyst.is_active === true && toShowAnalyst(analystData) && (!companyData.analyst.do_not_sync_to_rds));

    const isActiveSecondaryAnalyst = (companyData && companyData.secondary_analyst && companyData.secondary_analyst.is_active === true && toShowAnalyst(secondaryAnalystData) && (!companyData.secondary_analyst.do_not_sync_to_rds));

    const asteriskMessage = (window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.CANNABIS_COMPANY_ASTERISK_MESSAGE) || '';

    if (companyData && tableData && tableHeader && !this.props.isLoading) {
      return (
        <div className={`coverage-overlay ${forThePage}`}>
          {
            !onlyGraphData ?
              <div className="analyst-details-data">
                <div className="top-section section">

                  <div className="left-section">
                    <div className="company-name">
                      {companyData.name}
                    </div>
                    <div className="ticker-and-comp-type">
                      <div className="company-ticker">
                        {companyData.ticker || 'ticker: N/A'}
                      </div>
                      <div className="company-category">
                        <span>
                          {companyData.type}
                        </span>
                      </div>

                      <div className="tab-only link-sets">
                        <div className="section-title">
                          Related Links
                        </div>
                        <div className="links">
                          {
                            this.getRelatedLinks(companyData.relatedLinks)
                          }
                        </div>
                      </div>
                    </div>
                    <div className="company-logo-holder">
                      <Image className="comp-logo" src={companyData.logoUrl} />
                    </div>
                  </div>
                  <div className="right-section">
                    <div className="section-title">
                      Company Description
                    </div>
                    <div className={`section-details ${this.state.isExpanded.toString()}`}>
                      {companyData.description}
                    </div>
                    <div className="link-sets desktop-only">
                      <div className="section-title">
                        Related Links
                      </div>
                      {
                        this.getRelatedLinks(companyData.relatedLinks)
                      }
                    </div>
                  </div>
                </div>
                <div className="mid-section section desktop-only">
                  <div className="coverage-overlay-analyst">
                    <div onClick={isActive ? this.onAnalystClick(companyData.analyst) : null} onKeyPress={() => {}} role="button" tabIndex={0}>
                      {
                        companyData.analyst ?
                          <Container
                            as={isActive ? NavLink : 'div'}
                            to={isActive ? `${config.analystURLPrefix}/${companyData.analyst.client_code}` : ''}
                          >
                            <div className="analyst-image-holder">
                              <Image className="analyst-image" shape={'circular'} src={`${companyData.analyst.imageUrl}` || DEFAULT_PROFILE.img} />
                            </div>
                          </Container>
                          : null
                      }
                    </div>
                    {
                      companyData.analyst ?
                        <div className="analyst-details">
                          <div className="analyst-name">
                            <Container
                              as={isActive ? NavLink : 'div'}
                              to={isActive ? `${config.analystURLPrefix}/${companyData.analyst.client_code}` : ''}
                            >
                              {companyData.analyst.position ? `${companyData.analyst.name}, ${companyData.analyst.position}` : companyData.analyst.name}
                            </Container>
                          </div>
                          <div className="analyst-type">
                            <div className="displayTitle">{companyData.analyst.display_title || ''}</div>
                            <div className={'legal-entity'}>{companyData.analyst.division_name || ''}</div>
                          </div>
                          <div className="analyst-contact-icons">
                            <CoverageOverlayAnalystConnection companyData={companyData} />
                          </div>
                        </div>
                        : null
                    }
                  </div>

                  <div className="coverage-overlay-analyst">
                    <div onClick={isActiveSecondaryAnalyst ? this.onAnalystClick(companyData.secondary_analyst) : null} onKeyPress={() => {}} role="button" tabIndex={0}>
                      {
                        companyData.secondary_analyst ?
                          <Container
                            as={isActiveSecondaryAnalyst ? NavLink : 'div'}
                            to={isActiveSecondaryAnalyst ? `${config.analystURLPrefix}/${companyData.secondary_analyst.client_code}` : ''}
                          >
                            <div className="analyst-image-holder">
                              <Image className="analyst-image" shape={'circular'} src={`${companyData.secondary_analyst.imageUrl}` || DEFAULT_PROFILE.img} />
                            </div>
                          </Container>
                          : null
                      }
                    </div>
                    {
                      companyData.secondary_analyst ?
                        <div className="analyst-details">
                          <div className="analyst-name">
                            <Container
                              as={isActiveSecondaryAnalyst ? NavLink : 'div'}
                              to={isActiveSecondaryAnalyst ? `${config.analystURLPrefix}/${companyData.secondary_analyst.client_code}` : ''}
                            >
                              {companyData.secondary_analyst.position ? `${companyData.secondary_analyst.name}, ${companyData.secondary_analyst.position}` : companyData.secondary_analyst.name}
                            </Container>
                          </div>
                          <div className="analyst-type">
                            <div className="displayTitle">{companyData.secondary_analyst.display_title || ''}</div>
                            <div className={'legal-entity'}>{companyData.secondary_analyst.division_name || ''}</div>
                          </div>
                          <div className="analyst-contact-icons">
                            <CoverageOverlayAnalystConnection companyData={secondaryAnalystCompanyData} />
                          </div>
                        </div>
                        : null
                    }
                  </div>
                </div>
                <div className={`tab-only collapased ${this.state.isExpanded.toString()}`}>

                  <div className="coverage-overlay-analysts">
                    <div className="coverage-overlay-analyst">
                      {
                        companyData.analyst ?
                          <div className="mid-section section">
                            <div className="analyst-image-holder">
                              <Container
                                as={isActive ? NavLink : 'div'}
                                to={isActive ? `${config.analystURLPrefix}/${companyData.analyst.client_code}` : ''}
                                className="analyst-name"
                              >
                                <Image shape={'circular'} className="analyst-image" src={`${companyData.analyst.imageUrl}` || DEFAULT_PROFILE.img} />
                              </Container>
                              <div className="analyst-details">
                                <Container
                                  as={isActive ? NavLink : 'div'}
                                  to={isActive ? `${config.analystURLPrefix}/${companyData.analyst.client_code}` : ''}
                                  className="analyst-name"
                                >
                                  {companyData.analyst.position ? `${companyData.analyst.name}, ${companyData.analyst.position}` : companyData.analyst.name}
                                </Container>
                                <div className="analyst-type">
                                  <div className="displayTitle">{companyData.analyst.display_title || ''}</div>
                                  <div>{companyData.analyst.division_name || ''}</div>
                                </div>
                                <div className="analyst-contact-icons">
                                  <CoverageOverlayAnalystConnection companyData={companyData} />
                                </div>
                              </div>
                            </div>
                          </div>
                          : null
                      }
                    </div>

                    {
                      companyData.secondary_analyst ?
                        <div className="coverage-overlay-analyst">
                          <div className="mid-section section">
                            <div className="analyst-image-holder">
                              <Container
                                as={isActiveSecondaryAnalyst ? NavLink : 'div'}
                                to={isActiveSecondaryAnalyst ? `${config.analystURLPrefix}/${companyData.secondary_analyst.client_code}` : ''}
                                className="analyst-name"
                              >
                                <Image shape={'circular'} className="analyst-image" src={`${companyData.secondary_analyst.imageUrl}` || DEFAULT_PROFILE.img} />
                              </Container>
                              <div className="analyst-details">
                                <Container
                                  as={isActiveSecondaryAnalyst ? NavLink : 'div'}
                                  to={isActiveSecondaryAnalyst ? `${config.analystURLPrefix}/${companyData.secondary_analyst.client_code}` : ''}
                                  className="analyst-name"
                                >
                                  {companyData.secondary_analyst.position ? `${companyData.secondary_analyst.name}, ${companyData.secondary_analyst.position}` : companyData.secondary_analyst.name}
                                </Container>
                                <div className="analyst-type">
                                  <div className="displayTitle">{companyData.secondary_analyst.display_title || ''}</div>
                                  <div className={'legal-entity'}>{companyData.analyst.division_name || ''}</div>
                                </div>
                                <div className="analyst-contact-icons">
                                  <CoverageOverlayAnalystConnection companyData={secondaryAnalystCompanyData} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        : null
                    }
                  </div>
                </div>
                <Button
                  className={
                    isExpanded ?
                      'mobile-only section-details-expand bmo_chevron top'
                      : 'mobile-only section-details-expand bmo_chevron bottom'}
                  onClick={this.expandSectionDetails}
                />
              </div>
              : null
          }
          <div className="graph-table">
            <div className="data-table">
              <div className="head not-in-mobile">
                <span className="f-year">Fiscal Year</span>
                <span>Rating</span>
                <span>{tableData.close ? tableData.close.name : 'Close'}</span>
                <span>Target Price</span>
                <span>Total Return</span>
                <span>{`Current ${tableHeader.EPSLable || ''}`}</span>
                <span>{`Current ${tableHeader.PELable || ''}`}</span>
                <span>{`Next ${tableHeader.EPSLable || ''}`}</span>
                <span>{`Next ${tableHeader.PELable || ''}`}</span>
                <span>Yield</span>
                <span>Mkt Cap</span>
              </div>
              <div className="table-summary-drop-down mobile-only">
                <div className="head-section graph-summary-head-mobile">
                  <div className="head">
                    <div className="left">Fiscal Year</div>
                    <div className="right fiscalYear">{tableData.fiscalYear}</div>
                  </div>
                  <ul className={`summary-rows ${isTableSummaryExpanded.toString()}`}>
                    <li className="graph-summary-rows">
                      <div className="left">Rating</div>
                      <div className="right">{tableData.Rating}</div>
                    </li>
                    <li className="graph-summary-rows">
                      <div className="left">{tableData.close ? tableData.close.name : 'Close'}</div>
                      <div className="right">{tableData.close ? tableData.close.value : ''}</div>
                    </li>
                    <li className="graph-summary-rows">
                      <div className="left">Target Price</div>
                      <div className="right">{tableData.targetPrice}</div>
                    </li>
                    <li className="graph-summary-rows">
                      <div className="left">Total Return</div>
                      <div className="right">{tableData.totalReturn}</div>
                    </li>
                  </ul>
                  <Button
                    className={
                      isTableSummaryExpanded ?
                        'mobile-only section-details-expand bmo_chevron top'
                        : 'section-details-expand bmo_chevron bottom'}
                    onClick={this.expandTableSummary}
                  />
                </div>
              </div>
              <div className="result-data not-in-mobile">
                <span className="f-year">{tableData.fiscalYear}</span>
                <span className={`rating ${tableData.Rating}`} title={tableData.Rating}>{tableData.Rating}</span>
                <span className="numberVal" title={tableData.close ? tableData.close.name : ''}>{tableData.close ? tableData.close.value : ''}</span>
                <span className="numberVal" title={tableData.targetPrice}>{tableData.targetPrice}</span>
                <span className="numberVal" title={tableData.totalReturn}>{tableData.totalReturn}</span>
                <span className="numberVal" title={tableData.currentEPS}>{tableData.currentEPS}</span>
                <span className="numberVal" title={tableData.currentPE}>{tableData.currentPE}</span>
                <span className="numberVal" title={tableData.nextEPS}>{tableData.nextEPS}</span>
                <span className="numberVal" title={tableData.nextPE}>{tableData.nextPE}</span>
                <span className="numberVal" title={tableData.yield}>{tableData.yield}</span>
                <span className="numberVal" title={tableData.mktCap}>{tableData.mktCap}</span>
              </div>
              <div className="graph-data-duration">
                <Button
                  className={
                    this.state.currentGraphData === '5_DAY_DATA' ?
                      'active graph-data-duration-btn'
                      : 'graph-data-duration-btn'} onClick={this.graphPeriodChange('5_DAY_DATA')}
                >
                  5 Days
                </Button>
                <Button
                  className={
                    this.state.currentGraphData === '1_MONTH_DATA' ?
                      'active graph-data-duration-btn'
                      : 'graph-data-duration-btn'} onClick={this.graphPeriodChange('1_MONTH_DATA')}
                >
                  1 Month
                </Button>
                <Button
                  className={
                    this.state.currentGraphData === '6_MONTH_DATA' ?
                      'active graph-data-duration-btn'
                      : 'graph-data-duration-btn'} onClick={this.graphPeriodChange('6_MONTH_DATA')}
                >
                  6 Months
                </Button>
                <Button
                  className={
                    this.state.currentGraphData === '1_YEAR_DATA' ?
                      'active graph-data-duration-btn'
                      : 'graph-data-duration-btn'} onClick={this.graphPeriodChange('1_YEAR_DATA')}
                >
                  1 Year
                </Button>
                <Button
                  className={
                    this.state.currentGraphData === '3_YEAR_DATA' ?
                      'active graph-data-duration-btn'
                      : 'graph-data-duration-btn'} onClick={this.graphPeriodChange('3_YEAR_DATA')}
                >
                  3 Year
                </Button>
              </div>
            </div>
            {
              graphData[currentGraphData] ?
                <BmoHighChart
                  markerUrlDark="/assets/images/publication_marker.png"
                  markerUrl="/assets/images/publication_marker_dark.png"
                  commentIconDark="/assets/images/Sector_Comment_Pin.png"
                  commentIcon="/assets/images/Sector_Comment_Pin_Dark.png"
                  minVal={(graphData[currentGraphData] ? graphData[currentGraphData][0].date : null)}
                  maxVal={(graphData[currentGraphData] ? graphData[currentGraphData][graphData[currentGraphData].length - 1].date : null)}
                  oneUnit={86400000}
                  dataDuration={currentGraphData}
                  publicationData={publicationData}
                  Ldata={publicationData}
                  graphData={graphData[currentGraphData]}
                  graphHeight={graphHeight}
                  publicationPopUp={this.publicationPopUp}
                  researchLayoutMetaDataLoading={researchLayoutMetaDataLoading}
                  container={this.props.container}
                />
                : <div className="no-data-found">No data found for the selected date range</div>
            }
            {
              companyData.reportingCurrency && companyData.priceCurrency &&
              <div className={'currency-information'}>
                {`Close, Target Price, and Market Cap. in ${companyData.priceCurrency}; Earnings in ${companyData.reportingCurrency}`}
              </div>
            }
            {
              companyData.type.toLowerCase() === 'cannabis' && companyData.show_cannabis_message &&
              <div className={'currency-information'}>{asteriskMessage}</div>
            }
            {!this.props.fromMobileLibrary &&
              (forThePage !== 'for-library' ?
                <div className="button-holder">
                  <NavLink
                    onClick={this.setCompanyTicker(companyData.ticker)}
                    className="show-in-lib-button secondary ui button"
                    to={`/library/?searchType=company&searchVal=${encodeURIComponent(companyData.ticker)}&searchTicker=${encodeURIComponent(companyData.ticker)}`}
                  >
                    See Company Research
                  </NavLink>
                </div>
                : null
              )
            }
            {this.props.fromMobileLibrary &&
              (<div className="button-holder">
                <Button
                  onClick={this.props.closeGraphModal}
                  className="show-in-lib-button secondary ui button"
                >
                  Back to Library
                </Button>
              </div>
              )
            }
          </div>
        </div>
      );
    } else if (companyData) {
      return <div className="no-coverage-graph"> No graph data found </div>;
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  coverageData: departmentSelector.getCoverageData(state),
  researchLayoutMetaDataLoading: researchSelector.getResearchLayoutMetaDataLoading(state),
});
const mapDispatchToProps = (dispatch) => ({
  setCompanyTicker: (data) => {
    dispatch({ type: SET_COMP_TICKER_FROM_DEPARTMENT, data });
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(CoverageOverlay);
