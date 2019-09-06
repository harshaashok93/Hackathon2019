/* @flow weak */

/*
 * Component: LibraryPage
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'unchained-ui-react';
// import moment from 'moment';
import { mapPropsToChildren } from 'utils/reactutils';
import { getParameterByName, libraryURLPush } from 'utils';
import { withRouter } from 'react-router';
import { setLocalToken } from 'api/auth';

import {
  GET_LIBRARY_SEARCH_RESULTS,
  RESET_SEARCH_TYPE,
  RESET_LIBRARY_FILTERS,
  SET_LIBRARY_DATE,
  SET_LIBRARY_SEARCH_API_RESULTS,
  SET_LIBRARY_SEARCH_API_RESULTS_COUNT,
  SET_SEARCH_TYPE,
  SET_COMP_TICKER_FROM_DEPARTMENT,
  RESET_GICS_TYPE,
  SET_UUID_DATA,
  SET_USER_TYPE_DATA,
  SET_MOBILE_LAYOUT_STATUS,
  UPDATE_REBRANDING_INTRO_VISIBILITY
} from 'store/actions';

import {
  datepickerSelector,
  librarySelector,
  searchSelector,
  departmentSelector,
  userSelector
} from 'store/selectors';

import { searchCoverage } from 'api/search';

import { pushToPageDataLayer } from 'analytics';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LibraryPage.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LibraryPage extends Component {
  props: {
    children: {},
    getSearchResult: () => void,
    onShowFiltersBtnClick: () => void,
    searchEvent: {
      type: '',
      value: '',
      displayValue: '',
      symbol: bool,
    },
    results: [],
    resetSearchType: () => void,
    resetLibrarySearchResult: () => void,
    // setLibraryDate: () => void,
    resetLibraryFilters: () => void,
    locationFilters: [],
    rebrandingFilters: [],
    researchFilters: [],
    additionalFilters: [],
    fromDate: '',
    toDate: '',
    isLibraryLazyLoading: bool,
    setSearchType: () => void,
    resetCompanyTickerList: () => void,
    setCompanyTicker: () => void,
    history: {},
    gicsType: '',
    resetGicsType: () => void,
    setUuid: () => void,
    setUserType: () => void,
    showCoverageOverlay: bool,
    isLoggedIn: bool,
    showRebrandingIntro: bool,
    updateRebrandingIntroVisibility: () => void,
    pageType: '',
    authorFilter: ''
  };

  libSearchEvent = {};
  previousQueryObj = null;
  previousApiParameter = null;
  pageCount = 1;
  isFromSort = false;
  gicsType = '';
  includeEquity = false;

  getAnalystQueryObj = (props = this.props) => {
    const { displayValue } = props.searchEvent;
    return {
      nested: {
        path: 'analysts',
        query: {
          query_string: {
            default_field: 'analysts.display_name',
            type: 'phrase',
            query: displayValue || ''
          }
        }
      }
    };
  }

  getCompanyQueryObj = (props = this.props) => {
    const { displayValue } = props.searchEvent;
    return {
      nested: {
        path: 'company',
        query: {
          query_string: {
            default_field: 'company.ticker',
            query: displayValue || ''
          }
        }
      }
    };
  }

  getIndustryQueryObj = (props = this.props) => {
    const { displayValue, symbol } = props.searchEvent;
    let keyName = 'sector.name';
    if (symbol) {
      keyName = 'sector.symbol';
    }

    return {
      nested: {
        path: 'sector',
        query: {
          match: {
            [keyName]: displayValue || ''
          }
        }
      }
    };
  }

  getGicsQueryObj = (name) => {
    return {
      match: {
        'gic.name': name || ''
      }
    };
  }

  getPublicationQueryObj = (props = this.props) => {
    const { displayValue } = props.searchEvent;
    return [
      {
        nested: {
          path: 'company',
          query: {
            query_string: {
              default_field: 'company.ticker',
              query: displayValue || '',
              boost: 10
            }
          }
        }
      },
      {
        nested: {
          path: 'company',
          query: {
            query_string: {
              default_field: 'company.name_first_word',
              query: displayValue || '',
              boost: 7
            }
          }
        }
      },
      {
        nested: {
          path: 'sector',
          query: {
            query_string: {
              default_field: 'sector.name_first_word',
              query: displayValue || '',
              boost: 7
            }
          }
        }
      },
      {
        nested: {
          path: 'company',
          query: {
            query_string: {
              default_field: 'company.name',
              query: displayValue || '',
              boost: 5
            }
          }
        }
      },
      {
        nested: {
          path: 'sector',
          query: {
            query_string: {
              default_field: 'sector.name',
              query: displayValue || '',
              boost: 5
            }
          }
        }
      },
      {
        query_string: {
          default_field: 'title',
          query: displayValue || '',
          boost: 3
        }
      },
      {
        query_string: {
          default_field: 'body',
          query: displayValue || ''
        }
      }
    ];
  }

  getLocationFilterQueryObj = (locationfilter) => {
    if (!locationfilter.length) return null;
    const isAllSelected = locationfilter.indexOf('all') > -1;
    const isUSSelected = locationfilter.indexOf('us') > -1;
    const isCASelected = locationfilter.indexOf('canada') > -1;
    const isROWSelected = locationfilter.indexOf('other') > -1;

    if (isAllSelected || (isUSSelected && isCASelected && isROWSelected)) return null;

    if (isROWSelected) {
      return {
        bool: {
          must_not: {
            nested: {
              path: 'tags',
              query: {
                multi_match: {
                  query: isUSSelected ? 'CA' : (isCASelected ? 'US' : 'US AND CA'), // eslint-disable-line
                  fields: ['tags.countries']
                }
              }
            }
          }
        }
      };
    }
    return {
      nested: {
        path: 'tags',
        query: {
          match: {
            'tags.countries': (isCASelected && isUSSelected) ? 'US AND CA' : (isCASelected ? 'CA' : 'US') // eslint-disable-line
          }
        }
      }
    };
  }

  getAdditionalFilterQueryObj = (additionalFilters) => {
    if (!additionalFilters.length) return null;
    const returnArr = [];
    const ratingTypeArr = [];

    additionalFilters.map(filter => {
      const filterType = filter.toLowerCase();
      if (filterType === 'outperform' || filterType === 'underperform') {
        ratingTypeArr.push(filterType);
      } else if (filterType === 'top15') {
        returnArr.push(
          {
            nested: {
              path: 'company',
              query: {
                match: {
                  [`company.${filterType}`]: true
                }
              }
            }
          }
        );
      } else if (filterType !== 'include_equity') {
        returnArr.push(
          {
            nested: {
              path: 'tags',
              query: {
                match: {
                  [`tags.${filterType}`]: true
                }
              }
            }
          }
        );
      }
    });

    if (ratingTypeArr.length) {
      returnArr.push(
        {
          nested: {
            path: 'tags',
            query: {
              match: {
                'tags.rating': ratingTypeArr.join(' AND ')
              }
            }
          }
        }
      );
    }
    return returnArr;
  }

  getResearchFilterQueryObj = (researchFilters) => {
    if (!researchFilters.length) return null;
    return {
      nested: {
        path: 'tags',
        query: {
          match: {
            'tags.research_type': researchFilters.join(' AND ')
          }
        }
      }
    };
  }

  makeAPICall(props = this.props, params = {}) {
    const { locationFilters, rebrandingFilters, researchFilters, additionalFilters, gicsType, authorFilter } = props;
    const { type, displayValue } = props.searchEvent;
    const { fromDate, toDate, pageType } = props;
    // if ((!fromDate && !toDate) || shouldResetDate) {
    //   if (!type || type === 'enter') {
    //     fromDate = moment().subtract(180, 'days').format('YYYY-MM-DD'); // 84
    //   } else {
    //     fromDate = moment().subtract(180, 'day').format('YYYY-MM-DD'); // 1
    //   }
    //   toDate = moment().format('YYYY-MM-DD');
    //   this.props.setLibraryDate({ fromDate, toDate });
    // }

    // if (fromDate && toDate) {
    //   this.props.setLibraryDate({ fromDate, toDate });
    // }

    const queryObj = {
      sortType: params.sortType || 'publisher_date',
      sortOrder: params.sortOrder || 'desc',
      range: {
        range: {
          publisher_date: {
            gte: fromDate,
            lte: toDate
          }
        },
      }
    };
    const locFilters = this.getLocationFilterQueryObj(locationFilters);
    if (locFilters) {
      queryObj.locationFilters = locFilters;
    }

    const resFilters = this.getResearchFilterQueryObj(researchFilters);
    if (resFilters) {
      queryObj.researchFilters = resFilters;
    }
    const addFilters = this.getAdditionalFilterQueryObj(additionalFilters);
    if (addFilters) {
      queryObj.additionalFilters = addFilters;
    }
    if ((additionalFilters.filter((item) => item.toLowerCase() === 'include_equity')).length > 0) {
      this.includeEquity = true;
    } else {
      this.includeEquity = false;
    }
    if (gicsType) {
      if (gicsType.name === 'Macro') {
        queryObj.query = null;
        queryObj.macro = {
          query_string: {
            fields: ['template_abbr'],
            query: 'BMORT ME WEEK TIPS BMOWR'
          }
        };
      } else {
        queryObj.query = this.getGicsQueryObj(gicsType.name);
      }
    }
    switch (type) {
      case 'analyst':
        queryObj.query = this.getAnalystQueryObj(props);
        break;
      case 'company':
        queryObj.query = this.getCompanyQueryObj(props);
        break;
      case 'industry':
        if (props.searchEvent.displayValue === 'macro') {
          queryObj.query = null;
          queryObj.macro = {
            query_string: {
              fields: ['template_abbr'],
              query: 'BMORT ME WEEK TIPS BMOWR'
            }
          };
        } else if (props.searchEvent.displayValue === 'strategy') {
          queryObj.query = {
            nested: {
              path: 'sector',
              query: {
                query_string: {
                  query: 'STRINV STRCAN STRPOR STRUSA',
                  default_field: 'sector.symbol'
                }
              }
            }
          };
        } else {
          queryObj.query = this.getIndustryQueryObj(props);
        }
        break;
      case 'enter':
        queryObj.term = {
          bool: {
            should: (this.getPublicationQueryObj(props))
          }
        };
        break;
      default:
        queryObj.range = {
          range: {
            publisher_date: {
              gte: fromDate,
              lte: toDate
            }
          }
        };
        break;
    }
    if (queryObj) {
      if (this.previousQueryObj && (queryObj.sortOrder !== this.previousQueryObj.sortOrder)) this.pageCount = 1;
      this.previousQueryObj = JSON.parse(JSON.stringify(queryObj));
      this.isFromSort = params.isFromSort || false;
      queryObj.includeEquity = this.includeEquity;
      const sectorId = getParameterByName('sectorId') || '';
      const libReqParameter = {
        size: 20,
        from: queryObj.from || 0,
        from_date: fromDate,
        to_date: toDate,
        location: locationFilters,
        rebranding: rebrandingFilters,
        research_type: researchFilters,
        additional: additionalFilters,
        person_id: authorFilter ? parseInt(authorFilter, 10) : 0,
        gics: (gicsType && gicsType.name) || '',
        search_type: type || '',
        search_val: displayValue || '',
        sort_type: params.sortType || 'publisher_date',
        sort_order: params.sortOrder || 'desc',
        bookmarkIds: false,
        podcast_videocast_homepage: (pageType.toLowerCase() === 'podcast')
      };
      if (sectorId && type === 'industry') {
        libReqParameter.search_val = sectorId;
      }
      this.previousApiParameter = JSON.parse(JSON.stringify(libReqParameter));
      this.props.getSearchResult(this.previousApiParameter, queryObj, false, this.isFromSort);
    }
  }


  locationFilters = '';
  rebrandingFilters = '';
  researchFilters = '';
  additionalFilters = '';
  authorFilter = '';
  fromDateFilter = '';
  toDateFilter = '';
  updateScrollEl = false;

  componentWillReceiveProps(nextProps) {
    const { results, searchEvent, isLoggedIn, pageType } = nextProps;
    this.updateScrollEl = false;
    let apiAlreadyCalled = false;
    const searchEventHasChanged = (Object.keys(searchEvent).length > 0 || Object.keys(this.libSearchEvent).length > 0) && (searchEvent !== this.libSearchEvent);
    if (searchEventHasChanged) {
      this.makeAPICall(nextProps, {});
      this.pageCount = 1;
    }
    window.setTimeout(() => {
      if (!searchEventHasChanged) {
        const { locationFilters, rebrandingFilters, researchFilters, additionalFilters, fromDate, toDate, gicsType, authorFilter } = nextProps;
        const strLocFilters = locationFilters.join(',');
        const strRebrandFilters = rebrandingFilters.join(',');
        const strResearchFilters = researchFilters.join(',');
        const strAddFilters = additionalFilters.join(',');
        const strAuthFilters = authorFilter;

        if ((strLocFilters !== this.locationFilters) ||
            (strRebrandFilters !== this.rebrandingFilters) ||
            (strResearchFilters !== this.researchFilters) ||
            (strAddFilters !== this.additionalFilters) ||
            (strAuthFilters !== this.authorFilter) ||
            (fromDate !== this.fromDateFilter) ||
            (gicsType !== this.gicsType) ||
            (toDate !== this.toDateFilter)) {
          this.makeAPICall(nextProps);
          apiAlreadyCalled = true;
          this.locationFilters = strLocFilters;
          this.rebrandingFilters = strRebrandFilters;
          this.researchFilters = strResearchFilters;
          this.additionalFilters = strAddFilters;
          this.authorFilter = strAuthFilters;
          this.fromDateFilter = fromDate;
          this.toDateFilter = toDate;
          this.gicsType = gicsType;
          this.pageCount = 1;
        }
      }
      this.libSearchEvent = nextProps.searchEvent;
    }, 1000);
    const searchType = searchEvent.type;
    const searchVal = searchEvent.value;

    const obj = {
      search: {
        term: searchType === 'enter' ? searchVal : '',
        results: results ? results.length : 0,
      }
    };
    if (obj) {
      pushToPageDataLayer(obj);
    }
    if (results && this.props.results && (results.length !== this.props.results.length)) {
      this.updateScrollEl = true;
    }

    if (searchType === 'company') {
      if (searchVal) {
        this.props.setCompanyTicker(searchVal.ticker);
      }
    } else {
      this.props.resetCompanyTickerList();
    }

    if ((isLoggedIn && (isLoggedIn !== this.props.isLoggedIn)) || (!apiAlreadyCalled && this.props.pageType !== pageType)) {
      this.makeAPICall(nextProps, {});
      this.pageCount = 1;
    }
  }

  lazyLoadResults = () => {
    if (this.previousQueryObj && !this.props.isLibraryLazyLoading) {
      this.previousQueryObj.from = ((this.pageCount) * 20);
      if (this.previousApiParameter) {
        this.previousApiParameter.from = ((this.pageCount) * 20);
      }
      this.props.getSearchResult(this.previousApiParameter, this.previousQueryObj, true, this.isFromSort);
      this.pageCount += 1;
    }
  }

  setSearchTypeObject() {
    const urlSearchType = getParameterByName('searchType');
    const urlSearchValue = getParameterByName('searchVal');

    if (urlSearchType && urlSearchValue) {
      const data = {
        type: urlSearchType,
        displayValue: decodeURIComponent(urlSearchValue)
      };
      const urlSearchTicker = getParameterByName('searchTicker');
      if (urlSearchTicker) {
        data.value = {
          ticker: decodeURIComponent(urlSearchTicker)
        };
      }
      const urlsectorSymbol = getParameterByName('symbol');
      if (urlsectorSymbol === 'true') {
        data.symbol = true;
      } else {
        data.symbol = false;
      }
      this.props.setSearchType(data);
      this.libSearchEvent = this.props.searchEvent;
    } else {
      this.props.resetSearchType();
      this.libSearchEvent = {};
    }
  }

  checkForCusipOrLocalTicker = async () => {
    const cusip = getParameterByName('cusip');
    const localTicker = getParameterByName('LocalTicker');
    const { history } = this.props;

    if (cusip || localTicker) {
      const resp = await searchCoverage(cusip, localTicker);

      if (resp && resp.data.responses[0].hits.hits.length) {
        const compData = resp.data.responses[0].hits.hits[0]._source;
        const url = `/library/?searchType=company&searchVal=${compData.ticker}&searchTicker=${compData.ticker}&sectorCode=${compData.bm_sector_symbol}`;
        history.push(url);
      }
    }
  }

  componentWillMount() {
    // Fix for the ticket BCMBT-1431 so that the cusip overrides the normal search.
    this.checkForCusipOrLocalTicker();

    this.setSearchTypeObject();
    // const fromDate = getParameterByName('fromDate');
    // const toDate = getParameterByName('toDate');
    // this.makeAPICall(this.props, {}, !(fromDate || toDate));
    // this.debouneCB = debounce(this.lazyLoadResults, 400);
    window.addEventListener('scroll', this.debouneCB);
    const urlToken = getParameterByName('token');
    if (urlToken) {
      setLocalToken(urlToken, 365);
    }
    const urluuid = getParameterByName('uuid');
    if (urluuid) {
      this.props.setUuid(urluuid);
    }
    const urlUserType = getParameterByName('userType');
    if (urlUserType) {
      this.props.setUserType(urlUserType);
    }
    if (urluuid || urlToken || urlUserType) {
      libraryURLPush(window.location.search.replace('?', ''), 'uuid,token,userType');
    }
  }

  componentDidMount() {
    this.filterEl = document.getElementById('library-filter-section');
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      window.setTimeout(() => {
        this.setSearchTypeObject();
      }, 400);
    });
  }

  componentWillUnmount() {
    this.props.resetSearchType();
    this.props.resetGicsType();
    // const dt = moment();
    // const fromDate = dt.format('YYYY-MM-DD');
    // const toDate = dt.format('YYYY-MM-DD');
    this.props.resetLibraryFilters();
    this.props.resetLibrarySearchResult();
    this.locationFilters = '';
    this.rebrandingFilters = '';
    this.researchFilters = '';
    this.additionalFilters = '';
    this.authorFilter = '';
    this.fromDateFilter = '';
    this.toDateFilter = '';
    this.pageCount = 1;
    this.isFromSort = false;
    this.previousQueryObj = null;
    this.previousApiParameter = null;
    this.props.resetCompanyTickerList();
    this.libSearchEvent = {};
    this.unlisten();
    // window.removeEventListener('scroll', this.debouneCB);
  }

  updateRebrandingIntroVisibility = () => {
    this.props.updateRebrandingIntroVisibility(this.props.isLoggedIn);
  }

  render() {
    const { children, showCoverageOverlay, onShowFiltersBtnClick, showRebrandingIntro } = this.props;
    return (
      <div>
        <div className="library-page bookmark-library-wrapper-class">
          <Button className={`linkBtn filter-btn bmo_chevron right ${showCoverageOverlay ? 'overlay' : ''}`} onClick={() => { onShowFiltersBtnClick(); }}>{'Filters'}</Button>
          { mapPropsToChildren(children, {
            makeAPICall: (p) => this.makeAPICall(this.props, p),
            handleLazyLoadBtnClick: () => this.lazyLoadResults(),
            updateScrollEl: this.updateScrollEl,
            updateOnScrollEl: this.filterEl,
            isLibraryLazyLoading: this.props.isLibraryLazyLoading,
            libSearchEvent: this.libSearchEvent,
            updateRebrandingIntroVisibility: this.updateRebrandingIntroVisibility,
            showRebrandingIntro
          })
          }
          <div className="clearBoth" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  results: librarySelector.getResults(state),
  fromDate: datepickerSelector.getFromDate(state),
  toDate: datepickerSelector.getToDate(state),
  locationFilters: librarySelector.getLocationFilters(state),
  rebrandingFilters: librarySelector.getRebrandingFilters(state),
  researchFilters: librarySelector.getResearchFilters(state),
  additionalFilters: librarySelector.getAdditionalFilters(state),
  authorFilter: librarySelector.getAuthorFilter(state),
  isLibraryLazyLoading: librarySelector.getIsLibraryLazyLoading(state),
  searchEvent: searchSelector.getSearchEvent(state),
  gicsType: librarySelector.getGicsFilter(state),
  showCoverageOverlay: departmentSelector.getCoverageOverlayCheck(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
  showRebrandingIntro: userSelector.getShowRebrandingIntroStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  getSearchResult: (apiData, data, append = false, isFromSort = false) => {
    dispatch(GET_LIBRARY_SEARCH_RESULTS(apiData, data, { append, isFromSort }));
  },
  resetLibrarySearchResult: () => {
    dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS, data: null });
    dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS_COUNT, data: 0 });
  },
  resetSearchType: () => {
    dispatch({ type: RESET_SEARCH_TYPE });
  },
  setLibraryDate: (data) => {
    dispatch({ type: SET_LIBRARY_DATE, data });
  },
  resetLibraryFilters: () => {
    dispatch({ type: RESET_LIBRARY_FILTERS, data: false });
    // dispatch({ type: SET_LIBRARY_DATE, data: { fromDate, toDate } });
  },
  resetCompanyTickerList: () => {
    dispatch({ type: SET_COMP_TICKER_FROM_DEPARTMENT, data: null });
  },
  setSearchType: (data) => dispatch({ type: SET_SEARCH_TYPE, data }),
  setCompanyTicker: (data) => {
    dispatch({ type: SET_COMP_TICKER_FROM_DEPARTMENT, data });
  },
  resetGicsType: () => {
    dispatch({ type: RESET_GICS_TYPE });
  },
  setUuid: (data) => {
    dispatch({ type: SET_UUID_DATA, data });
  },
  setUserType: (data) => {
    dispatch({ type: SET_USER_TYPE_DATA, data });
  },
  onShowFiltersBtnClick: () => {
    dispatch({ type: SET_MOBILE_LAYOUT_STATUS, data: true });
  },
  updateRebrandingIntroVisibility: (isLoggedIn) => {
    dispatch(UPDATE_REBRANDING_INTRO_VISIBILITY(isLoggedIn));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LibraryPage));
