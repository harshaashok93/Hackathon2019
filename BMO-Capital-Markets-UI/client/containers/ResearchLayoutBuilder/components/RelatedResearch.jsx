import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';
import config from 'config';
import { Container } from 'unchained-ui-react';
import { CustomNavLink } from 'components';
import { toShowAnalyst, formatAnalystName } from 'utils';

class RelatedResearch extends Component {
  props: {
    data: {},
    title: '',
  }
  handleGTM = (name) => {
    const action = this.props.title || 'Open - Related';
    pushToDataLayer('report', 'reportRelatedResearch', { action, label: name });
  }
  render() {
    const { data, title } = this.props;
    if (!data.length) return null;

    return (
      <div className="industry-research">
        <div className="list-container">
          <div className="ui heading headingTab header">{title || 'Related Research'}</div>
          <ul>
            {
              data.map((row) => {
                const date = moment(row.publisher_date).format('MM/DD/YYYY');
                const analystInfo = row.analysts ? row.analysts[0] : null;
                let isActive = false;
                if (analystInfo) {
                  isActive = (analystInfo.active === true && toShowAnalyst(analystInfo) && (!analystInfo.do_not_sync_to_rds));
                }
                const analystName = formatAnalystName(analystInfo.first_name, analystInfo.middle_name, analystInfo.last_name);

                const ticker = ((row.company && row.company.ticker) ? row.company.ticker : (row.sector && row.sector.symbol) || '');
                const displayTickerValue = ticker;
                const encodedTicker = encodeURIComponent(ticker);
                const encodedTickerName = encodeURIComponent(displayTickerValue);
                const redirectURL = ((row.company && row.company.ticker) ? `/library/?searchType=company&searchVal=${encodedTicker}&searchTicker=${encodedTicker}` : `/library/?searchType=industry&searchVal=${encodedTickerName}&sectorId=${encodeURIComponent(row.sector.bm_sector_id)}`);
                return (
                  <li key={Math.random()}>
                    <div className="left-side">
                      <div className="head-section">
                        <span className="date">{date}</span>
                        {(row.company && row.company.ticker) ?
                          <Container
                            className={'cat'}
                            as={row.company && row.company.active ? NavLink : 'div'}
                            to={row.company && row.company.active ? redirectURL : ''}
                          >
                            {ticker}
                          </Container>
                          :
                          <Container
                            className={'cat'}
                            as={NavLink}
                            to={redirectURL}
                          >
                            {ticker}
                          </Container>
                        }
                        {
                          analystInfo ?
                            <span className="analyst-name">
                              <Container
                                as={isActive ? NavLink : 'div'}
                                to={isActive && analystInfo.client_code ? `${config.analystURLPrefix}/${analystInfo.client_code}` : ''}
                              >
                                {analystInfo && analystName}{analystInfo.position ? `, ${analystInfo.position}` : ''}
                              </Container>
                            </span>
                            : null
                        }
                        <div className="details-section" onClick={() => this.handleGTM((row.title && row.title.trim()) || '')} onKeyPress={() => {}} role="button" tabIndex={0}>
                          <CustomNavLink
                            to={row.historical_publication ? row.radar_link : `/research/${row.product_id}/`}
                            isHistoricalPublication={row.historical_publication}
                            radarLink={row.historical_publication ? row.radar_link : ''}
                          >
                            {row.title && row.title.trim()}
                            <span className="type">
                              ({row.tags && (`${(row.tags.research_type.charAt(0).toUpperCase() + row.tags.research_type.slice(1))}`)})
                            </span>
                          </CustomNavLink>
                        </div>
                      </div>
                    </div>
                    {/* <div className="right-side">
                      <NavLink
                        target={row.historical_publication ? '_blank' : ''}
                        to={row.historical_publication ? row.radar_link : `/research/${row.productID}/`}
                      >
                        <span className="eye-icon eye-inactive" />
                      </NavLink>
                    </div> */}
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({
  //
});

const mapDispatchToProps = () => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(RelatedResearch);
