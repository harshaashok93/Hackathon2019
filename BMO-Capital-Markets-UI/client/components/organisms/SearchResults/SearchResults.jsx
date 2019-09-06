/* @flow weak */

/*
 * Component: SearchResults
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Heading, List, Button, Image } from 'unchained-ui-react';
import moment from 'moment';
import { pushToDataLayer } from 'analytics';
import { DEFAULT_PROFILE } from 'constants/assets';
import { SearchResultsMobile, RichText, CustomNavLink } from 'components';

import {
  SET_SEARCH_TYPE,
  SET_RECENT_SEARCH_DATA,
  GET_MOST_OFTEN_SEARCHES,
  SET_COMP_TICKER_FROM_DEPARTMENT,
  USER_AUTH_VERIFY_LOGIN
} from 'store/actions';

import {
  userSelector,
  searchSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SearchResults.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SearchResults extends Component {
  props: {
    analysts: [],
    publications: [],
    autoSuggestClick: () => void,
    searchInputFocusOut: () => void,
    setRecentSearchData: () => void,
    getMostOftenSearches: () => void,
    setCompanyTicker: () => void,
    isFocused: '',
    // searchType: () => void,
    coverage: [],
    sectors: [],
    recentSearchResult: [],
    oftenSearchResult: [],
    featuredPublication: {},
    isLoggedIn: Boolean,
    searchTextValue: '',
    verify: () => void,
  };

  static defaultProps = {
    other: [{ text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', to: '/' }],
  };

  componentWillMount() {
    pushToDataLayer('search', 'loadSearchOverlay');
    this.props.getMostOftenSearches();
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    this.props.verify();
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
    document.body.style.position = 'relative';
  }

  selfClick = (e) => {
    if (e.target.localName !== 'a') {
      this.props.autoSuggestClick();
    }
  }
  handleNavLinkClick = (type, src, a = '') => {
    let label = '';
    let data = null;
    const action = a;
    switch (type) {
      case 'analystLinkClick': {
        if (!src._source) break;
        const { sectors, role, display_name } = src._source; // eslint-disable-line
        label = display_name; // eslint-disable-line
        let sectorStr = '';
        if (sectors && sectors.length) {
          sectorStr = sectors.map(s => s.name).join(';');
        }
        data = {
          'BMO Analyst Name': display_name,
          'BMO Analyst Job Title': role,
          'Sector Name': sectorStr
        };
        break;
      }
      case 'companyTickerClick': {
        label = src.ticker;
        data = {
          'Company Name': src.name,
          'Sector Name': src.sector ? (src.sector.name || '') : ''
        };
        break;
      }
      case 'industrySuggestionClick': {
        const { name, coverages, analysts } = src;
        label = name;
        let companyStr = '';
        let analystStr = '';
        let analystRoleStr = '';
        if (coverages && coverages.length) {
          companyStr = coverages.map(c => c.name).join(';');
        }
        if (analysts && analysts.length) {
          analystStr = analysts.map(a => a.display_name).join(';');
          analystRoleStr = analysts.map(a => a.role).join(';');
        }
        data = {
          'Sector Name': name,
          'Company Name': companyStr,
          'BMO Analyst Name': analystStr,
          'BMO Analyst Job Title': analystRoleStr
        };
        break;
      }
      case 'researchSuggestionClick': {
        const { analysts, title } = src;
        label = title;
        let analystNameStr = '';
        let analystRoleStr = '';
        if (analysts && analysts.length) {
          analystNameStr = analysts.map(s => s.display_name).join(';');
          analystRoleStr = analysts.map(s => s.role).join(';');
        }
        data = {
          'Company Name': src.company ? (src.company.name || '') : '',
          'Sector Name': src.sector ? (src.sector.name || '') : '',
          'BMO Analyst Name': analystNameStr,
          'BMO Analyst Job Title': analystRoleStr,
        };
        break;
      }
      case 'otherlinkClick': {
        label = src.text;
        break;
      }
      case 'footerlinksClick': {
        label = src;
        break;
      }
      default:
        break;
    }
    const params = { label };
    if (data) {
      params.data = data;
    }
    if (action) {
      params.action = action;
    }
    pushToDataLayer('search', type, params);
    if (src && src.historical_publication) return;
    this.props.searchInputFocusOut();
  }

  // redirectingToLibrary = (data) => () => {
  //   if (data.type !== 'publication') {
  //     const dataObj = { type: data.type, value: (data.query_string || ''), displayValue: data.query_string };
  //     this.props.searchType(dataObj);
  //   }
  // }

  onClickShowAll = () => () => {
    this.props.searchInputFocusOut();
  }

  onClickLink = (type, src, displayValue) => () => {
    // if (type !== 'publication') {
    //   const data = { type, value: (src || ''), displayValue };
    //   this.props.searchType(data);
    // }
    if (type === 'company') {
      this.props.setCompanyTicker(src.ticker);
    } else {
      this.props.setCompanyTicker('');
    }
    const reqParameter = {};
    switch (type) {
      case 'analyst': {
        const position = src.position ? `, ${src.position}` : '';
        reqParameter.search_type = type;
        reqParameter.query_string = `${src.display_name}${position}`;
        reqParameter.id = displayValue;
        break;
      }
      case 'company':
        reqParameter.search_type = type;
        reqParameter.query_string = `${src.name} (${src.ticker})`;
        reqParameter.id = src.ticker;
        break;
      case 'industry':
        reqParameter.search_type = type;
        reqParameter.query_string = displayValue;
        reqParameter.id = src.bm_sector_id;
        break;
      case 'publication': {
        const researchType = src.tags && src.tags.research_type ? `(${src.tags.research_type})` : '';
        reqParameter.search_type = type;
        reqParameter.query_string = `${displayValue} ${researchType}`;
        reqParameter.id = src.product_id;
        break;
      }
      default:
        reqParameter.search_type = '';
        reqParameter.query_string = '';
        reqParameter.id = '';
        break;
    }
    this.props.setRecentSearchData(reqParameter);
  }

  noMatchFound = 'No match found';

  render() {
    const {
      recentSearchResult,
      oftenSearchResult,
      publications,
      analysts,
      coverage,
      sectors,
      isFocused,
      featuredPublication,
      isLoggedIn,
      searchInputFocusOut,
      searchTextValue
    } = this.props;
    const coverageLists = Object.assign([], coverage.slice(0, 3));
    const analystsLists = Object.assign([], analysts.slice(0, 3));
    const analystUrl = window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? '/our-department/our-analysts/' : '/our-analysts/';
    const recentSearchEmpty = isLoggedIn ? 'No Recent Searches' : 'You must be logged in to view this content';
    return (
      <div id="search-result-box" className={`search-results ${isFocused}`} role="link" onKeyPress={() => {}} tabIndex={0} onMouseDown={this.selfClick}>
        <div className="only-on-mobile">
          <SearchResultsMobile
            coverageLists={coverage ? coverageLists : null}
            sectors={sectors}
            coverage={coverage}
            publications={publications}
            onClickLink={this.onClickLink}
            analysts={analysts ? analystsLists : null}
            handleNavLinkClick={this.handleNavLinkClick}
            searchTextValue={searchTextValue}
            onClickShowAll={this.onClickShowAll}
          />
        </div>
        <div className="search-result-top-section not-on-mobile">
          <div className="company-ticker-and-analyst">
            <div className="company-ticker">
              <Heading className="search-result-section-title" content={'Company/ Ticker'} />
              <List>
                {
                  coverage && coverage.length
                    ?
                    coverageLists.map(coverageResults => {
                      const src = coverageResults._source;
                      const encodedTicker = encodeURIComponent(src.ticker);
                      const encodedSectorCode = encodeURIComponent(src.bm_sector_symbol);
                      return (
                        <List.Item className={'a-row'} key={Math.random()} onClick={this.onClickLink('company', src, src.name)}>
                          <NavLink onClick={() => { this.handleNavLinkClick('companyTickerClick', src); }} to={`/library/?searchType=company&searchVal=${encodedTicker}&searchTicker=${encodedTicker}&sectorCode=${encodedSectorCode}`}>
                            <a className="comp-name">{src.name} </a>
                            <a className="comp-ticker">({src.ticker})</a>
                          </NavLink>
                        </List.Item>
                      );
                    })
                    : <div>{this.noMatchFound}</div>
                }
                {window.unchainedSite && window.unchainedSite.sitename === 'Equity' ?
                  <List.Item className={'show-all-text coverage'}>
                    <NavLink to={'/our-department/our-coverage/'} className={'analyst-show-all'} onClick={this.onClickShowAll()}>
                      {'See All'}
                    </NavLink>

                  </List.Item>
                  :
                  null
                }
              </List>
            </div>
            <div className="industry">
              <Heading className="search-result-section-title" content={'Industry'} />
              <List>
                {
                  sectors && sectors.length
                    ?
                    sectors.slice(0, 3).map(sectorResult => (
                      <List.Item className={'a-row analyst-name'} key={Math.random()} onClick={this.onClickLink('industry', sectorResult._source, sectorResult._source.name)}>
                        <NavLink
                          onClick={() => { this.handleNavLinkClick('industrySuggestionClick', sectorResult._source); }}
                          to={`/library/?searchType=industry&searchVal=${encodeURIComponent(sectorResult._source.name)}&sectorId=${encodeURIComponent(sectorResult._source.bm_sector_id)}`}
                        >
                          {sectorResult._source.name}
                        </NavLink>
                      </List.Item>
                    )) : <div>{this.noMatchFound}</div>
                }
                {window.unchainedSite && window.unchainedSite.sitename === 'Equity' ?
                  <List.Item className={'show-all-text analysts'}>
                    <NavLink to={'/our-department/our-coverage/'} className={'analyst-show-all'} onClick={this.onClickShowAll()}>
                      {'See All'}
                    </NavLink>
                  </List.Item>
                  :
                  null
                }
              </List>
            </div>
            <div className="only-on-tab">
              <div className="other-and-analyst">
                <div className="analyst">
                  <Heading className="search-result-section-title" content={'Analyst'} />
                  <List>
                    {
                      analysts && analysts.length ? analystsLists.map(anAnalyst => {
                        const src = anAnalyst._source;
                        const encodedName = encodeURIComponent(src.display_name);
                        return (
                          <List.Item className={'a-row analyst-name'} key={Math.random()} onClick={this.onClickLink('analyst', src, src.display_name)}>
                            <NavLink onClick={() => { this.handleNavLinkClick('analystLinkClick', anAnalyst); }} to={`/library/?searchType=analyst&searchVal=${encodedName}`} className={'analyst-avatar'}>
                              <Image shape={'circular'} className={'analyst-image'} src={src.avatar_url || DEFAULT_PROFILE.img} />
                            </NavLink>
                            <NavLink onClick={() => { this.handleNavLinkClick('analystLinkClick', anAnalyst); }} to={`/library/?searchType=analyst&searchVal=${encodedName}`} className="analyst-name-role-position">
                              <a className="name">{`${src.first_name || ''} ${src.middle_name || ''} ${src.last_name || ''}${src.position ? ',' : ''} ${src.position || ''}`}</a><br />
                              <a className="desig" >{src.role}</a>
                            </NavLink>
                          </List.Item>
                        );
                      }) : <div>{this.noMatchFound}</div>
                    }
                    <List.Item className={'show-all-text analysts'}>
                      <NavLink to={analystUrl} className={'analyst-show-all'} onClick={this.onClickShowAll()}>
                        {'See All'}
                      </NavLink>
                    </List.Item>
                  </List>
                </div>
              </div>
            </div>
          </div>
          <div className="research">
            <Heading className="search-result-section-title" content={'Research'} />
            <List>
              {
                publications && publications.length ? publications.slice(0, 4).map(publicationsResult => {
                  const src = publicationsResult._source;
                  const link = src.historical_publication ? src.radar_link : `/research/${src.product_id}/`; // eslint-disable-line
                  return (
                    <List.Item className={'a-row'} key={Math.random()} onClick={this.onClickLink('publication', src, src.title)}>
                      <CustomNavLink
                        onClick={() => { this.handleNavLinkClick('researchSuggestionClick', src); }}
                        to={link}
                        isHistoricalPublication={src.historical_publication}
                        radarLink={src.historical_publication ? src.radar_link : ''}
                      >
                        <span className="research-comp-ticker">{moment(src.publisher_date).format('L')} {(src.company && src.company.ticker) ? `- (${src.company.ticker})` : ''}</span>
                        <span className="research-comp-details"><RichText richText={src.title} /></span>
                        <span className="research-comp-comment-type">{src.tags ? `(${src.tags.research_type})` : ''}</span>
                      </CustomNavLink>
                    </List.Item>
                  );
                }) : <div>{this.noMatchFound}</div>
              }
              <List.Item className={'show-all-text analysts'}>
                <NavLink to={`/library/?searchType=enter&searchVal=${encodeURIComponent(searchTextValue)}`} className={'analyst-show-all'} onClick={this.onClickShowAll()}>
                  {'See All'}
                </NavLink>
              </List.Item>
            </List>
            {/* <div className="other-and-analyst only-on-tab not-on-mobile">
              <div className="other">
                <Heading className="search-result-section-title" content={'Other'} />
                <List>
                  {
                    other && other.length
                      ?
                      other.map(otherSearchResult => <List.Item as={'span'} key={Math.random()} className={'a-row'}><NavLink onClick={() => { this.handleNavLinkClick('otherlinkClick', otherSearchResult); }} to="/library/">{otherSearchResult.text}</NavLink></List.Item>)
                      : null
                  }
                </List>
              </div>
            </div> */}
          </div>
          <div className="other-and-analyst show-on-desktop not-on-tab only-on-mobile">
            <div className="analyst">
              <Heading className="search-result-section-title" content={'Analyst'} />
              <List>
                {
                  analysts && analysts.length ? analystsLists.map(anAnalyst => {
                    const src = anAnalyst._source;
                    const encodedName = encodeURIComponent(src.display_name);
                    return (
                      <List.Item className={'a-row analyst-name'} key={Math.random()} onClick={this.onClickLink('analyst', src, src.display_name)}>
                        <NavLink onClick={() => { this.handleNavLinkClick('analystLinkClick', anAnalyst); }} to={`/library/?searchType=analyst&searchVal=${encodedName}`} className={'analyst-avatar'}>
                          <Image shape={'circular'} className={'analyst-image'} src={src.avatar_url || DEFAULT_PROFILE.img} />
                        </NavLink>
                        <NavLink onClick={() => { this.handleNavLinkClick('analystLinkClick', anAnalyst); }} to={`/library/?searchType=analyst&searchVal=${encodedName}`} className="analyst-name-role-position">
                          <a className="name">{`${src.first_name || ''} ${src.middle_name || ''} ${src.last_name || ''}${src.position ? ',' : ''} ${src.position || ''}`}</a><br />
                          <a className="desig" >{src.role}</a>
                        </NavLink>
                      </List.Item>
                    );
                  }) : <div>{this.noMatchFound}</div>
                }
                <List.Item className={'show-all-text analysts'}>
                  <NavLink to={analystUrl} className={'analyst-show-all show-all-analyst'} onClick={this.onClickShowAll()}>
                    {'See All'}
                  </NavLink>
                </List.Item>
              </List>
            </div>
            {/*
            <div className="other">
              <Heading className="search-result-section-title" content={'Other'} />
              <List>
                {
                  other
                    ?
                    other.map(otherSearchResult => <List.Item as={'span'} key={Math.random()} className={'a-row'}><NavLink onClick={() => { this.handleNavLinkClick('otherlinkClick', otherSearchResult); }} to="/library/">{otherSearchResult.text}</NavLink></List.Item>)
                    : null
                }
              </List>
            </div>
            */}
          </div>
        </div>
        <div className="search-result-bottom-section">
          {
            <div className={'recent-search'}>
              <Heading className="headingRegular" content={'Recent Searches'} />
              <List>
                {
                  recentSearchResult && recentSearchResult.length ?
                    recentSearchResult.map(recentSearch => {
                      let redirectUrl = '';

                      if (recentSearch.type === 'publication') {
                        redirectUrl = `/research/${recentSearch.id}/`;
                      } else {
                        redirectUrl = `/library/?searchType=${recentSearch.type}&searchVal=${encodeURIComponent(recentSearch.id)}`;

                        if (recentSearch.type === 'company') {
                          redirectUrl += `&searchTicker=${encodeURIComponent(recentSearch.id)}`;
                        }

                        if (recentSearch.type === 'industry') {
                          redirectUrl = `/library/?searchType=${recentSearch.type}&searchVal=${encodeURIComponent(recentSearch.industry_name)}&sectorId=${encodeURIComponent(recentSearch.industry_id)}`;
                        }
                      }
                      return (
                        <List.Item as={'span'} key={Math.random()} className={'a-row'}>
                          <NavLink
                            onClick={() => { this.handleNavLinkClick('footerlinksClick', recentSearch.query_string, 'Recent Searches'); }}
                            to={`${redirectUrl}`}
                          >
                            {recentSearch.query_string}
                          </NavLink>
                        </List.Item>);
                    })
                    : <div className="emptyRecentSearch">{recentSearchEmpty}</div>
                }
              </List>
            </div>
          }
          <div className={`often-search ${!isLoggedIn ? 'often-search-width-alter' : ''}`}>
            <Heading className="headingRegular" content={'Most Popular'} />
            <List>
              {
                oftenSearchResult && oftenSearchResult.length
                  ?
                  oftenSearchResult.map(oftenSearch => {
                    const redirectUrl = oftenSearch.type === 'publication' ?
                      `/research/${oftenSearch.id}/` :
                      `/library/?searchType=${oftenSearch.type}&searchVal=${encodeURIComponent(oftenSearch.type === 'company' ? oftenSearch.id : oftenSearch.query_string)}${(oftenSearch.type === 'company' ? `&searchTicker=${encodeURIComponent(oftenSearch.id)}` : '')}`;
                    return (
                      <List.Item as={'span'} key={Math.random()} className={'a-row'}>
                        <NavLink
                          onClick={() => { this.handleNavLinkClick('footerlinksClick', oftenSearch.query_string, 'Most Often Searches'); }}
                          to={`${redirectUrl}`}
                        >
                          {oftenSearch.query_string}
                          {
                            oftenSearch.type === 'publication' ?
                              <span className="type">({oftenSearch.type})</span>
                              : null
                          }
                        </NavLink>
                      </List.Item>);
                  })
                  : <div className="emptyRecentSearch">No Results</div>
              }
            </List>
          </div>
          <div className="news-section">
            <Heading content={'Featured'} className="featured-research-heading headingRegular" />
            {
              featuredPublication ?
                <List>
                  <NavLink onClick={() => { this.handleNavLinkClick('footerlinksClick', featuredPublication.title, `/research/${featuredPublication.productId}/`); }} className="news-section-text" to={`/research/${featuredPublication.productId}/`}>{featuredPublication.title}</NavLink>
                  <span className="type">{` (${featuredPublication.researchType.charAt(0).toUpperCase() + featuredPublication.researchType.slice(1)})`}</span>
                </List>
                : null
            }
            {
              featuredPublication ?
                <NavLink onClick={() => { this.handleNavLinkClick('footerlinksClick', 'Read Button', `/research/${featuredPublication.productId}/`); }} to={`/research/${featuredPublication.productId}/`}>
                  <Button className="address-section-button button" content={'See All'} />
                </NavLink>
                : null
            }
          </div>
        </div>
        <div className="dimmer" tabIndex={0} role="button" onKeyPress={() => {}} onClick={searchInputFocusOut} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  recentSearchResult: userSelector.getRecentSearch(state),
  oftenSearchResult: searchSelector.getOftenSearch(state),
});

const mapDispatchToProps = (dispatch) => ({
  searchType: (data) => dispatch({ type: SET_SEARCH_TYPE, data }),
  setRecentSearchData: (data) => {
    SET_RECENT_SEARCH_DATA(data);
  },
  getMostOftenSearches: () => {
    dispatch(GET_MOST_OFTEN_SEARCHES());
  },
  setCompanyTicker: (data) => {
    dispatch({ type: SET_COMP_TICKER_FROM_DEPARTMENT, data });
  },
  verify: () => {
    dispatch(USER_AUTH_VERIFY_LOGIN());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
