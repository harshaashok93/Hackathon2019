/* @flow weak */

/*
 * Component: ProfileBookmarkComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';
import { mapPropsToChildren } from 'utils/reactutils';
import { Button } from 'unchained-ui-react';

import {
  BookmarkLibrarySearchResult,
} from 'components';

import {
  datepickerSelector,
  librarySelector,
  userSelector,
  departmentSelector

} from 'store/selectors';

import {
  FILTER_BOOKMARKS_PAGE,
  SET_LIBRARY_DATE,
  RESET_LIBRARY_FILTERS,
  RESET_GICS_TYPE,
  SET_MOBILE_LAYOUT_STATUS,
  SET_LIBRARY_IS_FORM_SORTED
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileBookmarkComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


class ProfileBookmarkComponent extends Component {
  props: {
    // bookmarksData: [],
    filterBookmarksData: () => void,
    bookmarkPageData: [],
    locationFilters: [],
    rebrandingFilters: [],
    researchFilters: [],
    additionalFilters: [],
    fromDate: '',
    toDate: '',
    children: {},
    bookmarkIsLoading: bool,
    resetLibraryFilters: () => void,
    gicsType: '',
    resetGicsType: () => void,
    onShowFiltersBtnClick: () => void,
    showCoverageOverlay: bool,
  };

  static defaultProps = {
  };

  state = {
    prevBookmarksData: [],
    params: {},
  };

  previousQueryObj = null;
  pageCount = 1;
  isFromSort = false;
  updateScrollEl = false;

  getLocationFilterQueryObj = (selectedLocationOptions) => {
    if (!selectedLocationOptions) return null;
    const isAllSelected = selectedLocationOptions.indexOf('all') > -1;
    const isUSSelected = selectedLocationOptions.indexOf('us') > -1;
    const isCASelected = selectedLocationOptions.indexOf('canada') > -1;
    const isROWSelected = selectedLocationOptions.indexOf('other') > -1;

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
      } else {
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

  getGicsQueryObj = (name) => {
    return {
      nested: {
        path: 'sector',
        query: {
          multi_match: {
            query: name || '',
            type: 'phrase',
            fields: ['sector.name', 'sector.symbol']
          }
        }
      }
    };
  }

  makeAPICall(props = this.props, params = {}) {
    const { fromDate, toDate, locationFilters, rebrandingFilters, researchFilters, additionalFilters, gicsType } = props;
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
    const resFilters = this.getResearchFilterQueryObj(researchFilters);
    const addFilters = this.getAdditionalFilterQueryObj(additionalFilters);
    if (locFilters) {
      queryObj.locationFilters = locFilters;
    }
    if (resFilters) {
      queryObj.researchFilters = resFilters;
    }
    if (addFilters) {
      queryObj.additionalFilters = addFilters;
    }
    if (gicsType) {
      queryObj.query = this.getGicsQueryObj(gicsType.name);
    }
    queryObj.range = {
      range: {
        publisher_date: {
          gte: fromDate,
          lte: toDate
        }
      }
    };
    queryObj.bookmarkIds = {
      ids: {
        values: true
      }
    };
    if (queryObj) {
      if (this.previousQueryObj && (queryObj.sortOrder !== this.previousQueryObj.sortOrder)) this.pageCount = 1;
      this.previousQueryObj = JSON.parse(JSON.stringify(queryObj));
      this.isFromSort = params.isFromSort || false;
      let dateRange = null;
      if (queryObj.range && queryObj.range.range) {
        dateRange = Object.values(queryObj.range.range);
      }
      let lte = '';
      let gte = '';
      if (dateRange && dateRange.length) {
        lte = dateRange[0].lte;
        gte = dateRange[0].gte;
      }

      const libReqParameter = {
        size: null,
        from: 0,
        from_date: gte || '',
        to_date: lte || '',
        location: locationFilters || [],
        research_type: researchFilters || [],
        rebranding: rebrandingFilters || [],
        additional: additionalFilters || [],
        gics: (gicsType && gicsType.name) || '',
        search_type: '',
        search_val: '',
        sort_type: queryObj.sortType || 'publisher_date',
        sort_order: queryObj.sortOrder || 'desc',
        bookmarkIds: true,
      };
      this.props.filterBookmarksData(libReqParameter, queryObj, this.isFromSort);
      this.setState({ params });
    }
  }

  componentDidMount() {
    this.filterEl = document.getElementById('library-filter-section');
  }

  locationFilters = '';
  researchFilters = '';
  rebrandingFilters = '';
  additionalFilters = '';
  fromDateFilter = '';
  toDateFilter = '';
  gicsType = '';

  componentWillReceiveProps(nextProps) {
    const { locationFilters, researchFilters, rebrandingFilters, additionalFilters, fromDate, toDate, gicsType } = nextProps;
    const strLocFilters = locationFilters.join(',');
    const strRebrandFilters = rebrandingFilters.join(',');
    const strResearchFilters = researchFilters.join(',');
    const strAddFilters = additionalFilters.join(',');

    if ((strLocFilters !== this.locationFilters) ||
        (strRebrandFilters !== this.rebrandingFilters) ||
        (strResearchFilters !== this.researchFilters) ||
        (strAddFilters !== this.additionalFilters) ||
        (fromDate !== this.fromDateFilter) ||
        (gicsType !== this.gicsType) ||
        (toDate !== this.toDateFilter)) {
      this.makeAPICall(nextProps);
      this.locationFilters = strLocFilters;
      this.researchFilters = strResearchFilters;
      this.additionalFilters = strAddFilters;
      this.rebrandingFilters = strRebrandFilters;
      this.fromDateFilter = fromDate;
      this.toDateFilter = toDate;
      this.gicsType = gicsType;
      this.pageCount = 1;
      this.updateScrollEl = true;
    }
  }

  componentWillUnmount() {
    // const dt = moment();
    // const fromDate = dt.format('YYYY-MM-DD');
    // const toDate = dt.format('YYYY-MM-DD');
    this.props.resetLibraryFilters();
    this.locationFilters = '';
    this.researchFilters = '';
    this.rebrandingFilters = '';
    this.additionalFilters = '';
    this.fromDateFilter = '';
    this.toDateFilter = '';
    this.pageCount = 1;
    this.isFromSort = false;
    this.previousQueryObj = null;
    this.props.resetGicsType();
  }

  render() {
    const { bookmarkPageData, children, bookmarkIsLoading, showCoverageOverlay, onShowFiltersBtnClick } = this.props;
    const bookmarkPageDataUnsorted = Object.assign([], bookmarkPageData);
    const { params } = this.state;
    if ((params.sortType && params.sortType === 'publisher_date') || !Object.keys(params).length) {
      bookmarkPageDataUnsorted.sort((a, b) => {
        const c = new Date((a._source && a._source.publisher_date) || a.event_date);
        const d = new Date((b._source && b._source.publisher_date) || b.event_date);
        if (params.sortOrder && params.sortOrder === 'asc') {
          return c - d;
        }
        return d - c;
      });
    }
    return (
      <div className="profile-landing-page">
        <div className="profile-landing-body">
          <div className="profile-bookmark-component profile-bottom-container">
            <Button className={`linkBtn filter-btn bmo_chevron right ${showCoverageOverlay ? 'overlay' : ''}`} onClick={() => { onShowFiltersBtnClick(true); }}>{'Filters'}</Button>
            <div className="library-page bookmark-library-wrapper-class">
              { mapPropsToChildren(children, {
                updateScrollEl: this.updateScrollEl,
                updateOnScrollEl: this.filterEl,
              })
              }
              <BookmarkLibrarySearchResult
                makeAPICall={(p) => this.makeAPICall(this.props, p)}
                data={bookmarkPageDataUnsorted}
                isLoading={bookmarkIsLoading}
                isLoggedIn={true}
                isFromSort={this.isFromSort}
                totalCount={bookmarkPageDataUnsorted ? bookmarkPageDataUnsorted.length : 0}
                parentComponent="profile-bookmarks"
              />
              <div className="clearBoth" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fromDate: datepickerSelector.getFromDate(state),
  rebrandingFilters: librarySelector.getRebrandingFilters(state),
  toDate: datepickerSelector.getToDate(state),
  locationFilters: librarySelector.getLocationFilters(state),
  researchFilters: librarySelector.getResearchFilters(state),
  additionalFilters: librarySelector.getAdditionalFilters(state),
  bookmarkPageData: userSelector.getBookmarkPageData(state),
  bookmarksData: userSelector.getBookmarkIds(state),
  bookmarkIsLoading: userSelector.getBookMarkPageIsLoading(state),
  gicsType: librarySelector.getGicsFilter(state),
  showCoverageOverlay: departmentSelector.getCoverageOverlayCheck(state),
});

const mapDispatchToProps = (dispatch) => ({
  filterBookmarksData: (apiData, data, isFromSort = false) => {
    dispatch({ type: SET_LIBRARY_IS_FORM_SORTED, data: isFromSort });
    dispatch(FILTER_BOOKMARKS_PAGE(apiData, data));
  },
  onShowFiltersBtnClick: (data) => {
    dispatch({ type: SET_MOBILE_LAYOUT_STATUS, data });
  },
  setLibraryDate: (data) => {
    dispatch({ type: SET_LIBRARY_DATE, data });
  },
  resetLibraryFilters: () => {
    dispatch({ type: RESET_LIBRARY_FILTERS, data: false });
    // dispatch({ type: SET_LIBRARY_DATE, data: { fromDate, toDate } });
  },
  resetGicsType: () => {
    dispatch({ type: RESET_GICS_TYPE });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBookmarkComponent);
