/* @flow weak */

/*
 * Component: CompanyInfoLibOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Image, Button, Container, Loader } from 'unchained-ui-react';
import { CoverageOverlayAnalystConnection, CoverageOverlay } from 'components';
import { connect } from 'react-redux';
import { toShowAnalyst } from 'utils';
import { NavLink } from 'react-router-dom';
import { DEFAULT_PROFILE } from 'constants/assets';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  departmentSelector
} from 'store/selectors';
import './CompanyInfoLibOverlay.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CompanyInfoLibOverlay extends Component {
  props: {
    coverageData: {
      companyData: {},
    },
    mobile: bool,
  };

  static defaultProps = {
  };

  state = {
    showMoreLess: 'less',
    shortDescChar: 300,
    showCoverageOverlay: false,
    isOverlayReady: false,
  }

  componentDidMount() {
    // Component ready
  }

  onAnalystClick = (analystInfo) => () => {
    const gtmData = {
      'BMO Analyst Name': analystInfo.name,
      'BMO Analyst Job Title': analystInfo.position || '',
      'Sector Name': analystInfo.sectors ? Object.keys(analystInfo.sectors).map((key) => key).join(';') : '',
    };
    pushToDataLayer('ourdepartment', 'OurCoverageOverlayPage', { label: analystInfo.name, action: 'Analyst Click', data: gtmData });
  }

  getAnalystCoverageSection = (companyData, first) => {
    let roles = [];
    roles = companyData && companyData.analyst && companyData.analyst.roles.map((item) => {
      return (
        { name: item }
      );
    });

    const analystData = {
      roles,
      client_code: companyData && companyData.analyst && companyData.analyst.client_code
    };
    const isActive = (companyData && companyData.analyst.is_active === true && toShowAnalyst(analystData) && (!companyData.analyst.do_not_sync_to_rds));
    return (
      <div className="analyst-coverage">
        {first && <span className="title">Analyst Coverage</span>}
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
                    className={'analyst-detail-link'}
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
      </div>
    );
  }

  showMoreLess = (type) => () => {
    if (!this.props.mobile) {
      this.setState({ showMoreLess: type });
    } else {
      this.showCoverageModel();
    }
  }

  showCoverageModel = () => {
    this.setState({ showCoverageOverlay: true }, () => {
      const self = this;
      setTimeout(() => {
        self.setState({
          isOverlayReady: true,
        });
      }, 1000);
      document.body.classList.add('noscroll');
    });
  }
  closeGraphModal = () => {
    document.body.style.overflow = 'auto';
    document.body.classList.remove('noscroll');
    this.setState({ showCoverageOverlay: false, isOverlayReady: false, });
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
                this.state.isOverlayReady ?
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
    const { mobile } = this.props;
    const {
      companyData
    } = this.props.coverageData;
    if (!companyData) return null;
    const analystData = {
      analyst: companyData && companyData.analyst
    };

    const secondaryAnalystData = {
      analyst: companyData && companyData.secondary_analyst
    };


    const { showMoreLess, showCoverageOverlay } = this.state;

    let shortDescChar = 300;
    if (companyData && companyData.secondary_analyst) {
      shortDescChar = 100;
    }

    if (mobile) {
      shortDescChar = 85;
    }

    const shortDesc = (companyData && companyData.description ? companyData.description.substr(0, shortDescChar) : '');
    const longDesc = (companyData && companyData.description ? companyData.description : '');
    return (
      <div className="conpamy-info-lib-overlay">
        {this.getOverlay(showCoverageOverlay)}
        <div className="company-name">
          {companyData && companyData.name}
        </div>
        <div className="ticker-logo-holder">
          <div className="ticker-and-type">
            <span className="rw"> {(companyData && companyData.ticker) || 'ticker: N/A'} | {companyData.type}</span>
            <span className="v-ln" />
          </div>
        </div>
        {
          companyData.description ?
            <div className="description">
              {
                showMoreLess === 'less' ?
                  <div className="short">
                    <span className="desc-text">
                      {shortDesc}
                      {(shortDesc && companyData.description.length > shortDescChar) ? '...' : ''}
                    </span>
                    {(shortDesc && companyData.description.length > shortDescChar) ? <Button className="more" onClick={this.showMoreLess('more')}>(more)</Button> : null}
                  </div>
                  : null
              }
              {
                showMoreLess === 'more' ?
                  <div className="long">
                    <span className="desc-text">
                      {longDesc}
                    </span>
                    {longDesc ? <Button className="more" onClick={this.showMoreLess('less')}>(less)</Button> : null}
                  </div>
                  : null
              }
            </div>
            : null
        }
        {!mobile ?
          analystData.analyst && this.getAnalystCoverageSection(analystData, true)
          :
          null
        }
        {!mobile ?
          secondaryAnalystData.analyst && this.getAnalystCoverageSection(secondaryAnalystData, false)
          : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isOverLayLoading: departmentSelector.isOverLayLoading(state),
  coverageData: departmentSelector.getCoverageData(state)
});

export default connect(mapStateToProps)(CompanyInfoLibOverlay);
