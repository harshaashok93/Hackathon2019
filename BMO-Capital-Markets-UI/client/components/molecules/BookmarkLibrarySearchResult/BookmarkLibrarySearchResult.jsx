/* @flow weak */

/*
 * Component: BookmarkLibrarySearchResult
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { List, Button, Icon, Loader } from 'unchained-ui-react';
import { PublicationCardSmall, EventCard } from 'components';
import { connect } from 'react-redux';
import moment from 'moment';
import st from 'constants/strings';
import { numberWithCommas } from 'utils';

import {
  userSelector,
  librarySelector,
  datepickerSelector,
} from 'store/selectors';
import {
  GET_USER_PROFILE_PREFERENCES,
  UPDATE_PROFILE_BOOKMARKS_DATA,
  REMOVE_PROFILE_BOOKMARKS_DATA,
  UPDATE_SHOW_MORE_OR_LESS_FILTER,
  SET_LIBRARY_SEARCH_API_RESULTS
} from 'store/actions';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BookmarkLibrarySearchResult.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BookmarkLibrarySearchResult extends Component {
  props: {
    authorText: '',
    eventBookmarkId: [],
    tickerText: '',
    subjectText: '',
    showMoreText: '',
    showLessText: '',
    dateText: '',
    data: [],
    makeAPICall: () => void,
    isLoading: false,
    // searchEvent: {},
    totalCount: '',
    isLoggedIn: Boolean,
    getUserProfilePreferences: () => void,
    bookmarks: [],
    handleLazyLoadBtnClick: () => void,
    updateEventBookmarksData: () => void,
    removeEventBookmarksData: () => void,
    parentComponent: '',
    resultCount: '',
    isLibraryLazyLoading: '',
    fromDate: '',
    toDate: '',
    libSearchEvent: {},
    isFromSort: bool,
    updateShowMoreOrLessFilter: () => void,
    isExpand: bool,
    details: bool,
    // resetLibraryResult: () => void
  };

  static defaultProps = {
    authorText: 'Author',
    tickerText: 'Ticker',
    subjectText: 'Subject',
    showMoreText: 'Show More Detail',
    showLessText: 'Show Less Detail',
    dateText: 'Date',
    searchEvent: null,
    parentComponent: 'library'
  }

  state = {
    toggleState: 'publisher_date',
    sortOrder: 'desc',
    isOpen: false,
    currentOption: '',
    currentValue: '',
    ascendingSort: false,
    noOfResultRow: 20,
    scrollTop: 0,
  }

  pageScrollPosition = '';
  pageSortScrollPosition = '';
  resetScrollPosition = false;

  makeSortApiCall = (name, sortOrder) => {
    const data = { sortType: name, sortOrder, isFromSort: true };
    if (name === 'ticker.raw') {
      data.sortType = 'ticker.raw';
      data.sortOrder = sortOrder;
    } else if (name === 'title') {
      data.sortType = 'title.raw';
      data.sortOrder = sortOrder;
    } else if (name === 'primary_analyst_last_name.raw') {
      data.sortType = 'primary_analyst_last_name.raw';
      data.sortOrder = sortOrder;
    }
    this.props.makeAPICall(data);
  }

  componentWillMount() {
    console.log('will mount'); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    console.log('receive props.'); // eslint-disable-line
    this.resetScrollPosition = false;
    this.sortScrollPosition = false;
    this.nodataScrollPosition = false;
    if (!nextProps.isFromSort && (nextProps.data !== this.props.data)) {
      this.setState({
        toggleState: 'publisher_date',
        currentOption: '',
        currentValue: '',
        ascendingSort: false,
        sortOrder: 'desc',
      });
    }
    if (nextProps.isLoggedIn === true && (nextProps.isLoggedIn !== this.props.isLoggedIn)) {
      this.props.getUserProfilePreferences();
    }
    if (((nextProps.data && nextProps.isLoading) || (nextProps.data && nextProps.data.length < 20))) {
      this.nodataScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.data ? nextProps.data.length : 0 });
    } else if (nextProps.data && this.state.noOfResultRow < nextProps.data.length && this.pageScrollPosition) {
      this.resetScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.data.length });
    } else if (nextProps.data && this.state.noOfResultRow >= nextProps.data.length) {
      this.sortScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.data.length });
    }
  }

  componentDidMount() {
    console.log('did mount'); // eslint-disable-line
    if (this.props.isLoggedIn) {
      this.props.getUserProfilePreferences();
    }
  }

  componentDidUpdate() {
    if (this.resetScrollPosition && this.pageScrollPosition && this.props.parentComponent !== 'profile-bookmarks') {
      window.scrollTo(0, this.pageScrollPosition);
      document.getElementById('sticky-component-ii').style.position = 'fixed';
    }
    if (this.sortScrollPosition && this.pageSortScrollPosition && this.props.parentComponent !== 'profile-bookmarks') {
      window.scrollTo(0, this.pageSortScrollPosition);
    }

    if (this.nodataScrollPosition && this.props.parentComponent !== 'profile-bookmarks') {
      this.pageSortScrollPosition = '';
      this.pageScrollPosition = '';
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    // this.props.resetLibraryResult();
  }

  toggleState = (name) => {
    this.pageSortScrollPosition = document.getElementById('library-title-bar-id').offset;
    this.pageScrollPosition = '';
    const { toggleState } = this.state;
    let { sortOrder } = this.state;
    if (toggleState === name) {
      if (sortOrder === 'asc') {
        sortOrder = 'desc';
      } else {
        sortOrder = 'asc';
      }
    } else {
      sortOrder = 'asc';
    }
    this.makeSortApiCall(name, sortOrder);
    this.setState({ toggleState: name, sortOrder });
  }

  showDetails = () => {
    this.pageSortScrollPosition = document.getElementById('library-title-bar-id').offset;
    this.pageScrollPosition = '';
    this.props.updateShowMoreOrLessFilter();
  }

  optionSelected = (data) => () => {
    const { ascendingSort } = this.state;
    let sortOrder = 'desc';
    if (ascendingSort) {
      sortOrder = 'asc';
    }
    this.makeSortApiCall(data.value, sortOrder);
    this.setState({ isOpen: false, currentOption: data.text, currentValue: data.value });
  }

  openOptionDiv = () => () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  onSortClick = () => (event) => {
    event.stopPropagation();
    const { ascendingSort, currentValue } = this.state;
    let sortOrder = 'asc';
    if (ascendingSort) {
      sortOrder = 'desc';
    }
    this.makeSortApiCall(currentValue, sortOrder);
    this.setState({ ascendingSort: !ascendingSort, isOpen: false });
  }

  updateEventBookmarkData = () => (data) => {
    const { fromDate, toDate, eventBookmarkId } = this.props;
    const dataVal = Object.assign({}, data);
    dataVal.event_date__gte = fromDate;
    dataVal.event_date__lte = toDate;
    this.props.updateEventBookmarksData(dataVal, eventBookmarkId);
  }

  removeEventBookmarkData = () => (data) => {
    const { fromDate, toDate, eventBookmarkId } = this.props;
    const dataVal = Object.assign({}, data);
    dataVal.event_date__gte = fromDate;
    dataVal.event_date__lte = toDate;
    this.props.removeEventBookmarksData(dataVal, eventBookmarkId);
  }
  lazyLoadBtnClick = () => {
    this.pageScrollPosition = document.getElementById('srp-view-more').offsetTop;
    this.pageSortScrollPosition = '';
    this.props.handleLazyLoadBtnClick();
  }
  getResultsMarkup() {
    if (this.props.isLoading) {
      return <div className={'right-layout loader-container'}><Loader active={true} content="Loading..." /></div>;
    }
    const { data, isExpand, isLoggedIn, totalCount, parentComponent, eventBookmarkId, isLibraryLazyLoading } = this.props;
    if (!data) return null;
    if (Object.keys(data).length === 0) {
      return <div className={'no-results-found'}>No Results Found</div>;
    }
    return (
      <List className={`result-cards expand-${isExpand.toString()}`}>
        {
          data.map((publicationCard, i) => {
            let eventInformation = [];
            if (!publicationCard._source) {
              eventInformation = {//eslint-disable-line
                date: moment(publicationCard.event_date).format('MM/DD/YYYY'),
                title: publicationCard.event_title,
                type: publicationCard.event_type,
                place: publicationCard.location,
                presenter: publicationCard.presenter,
                eventId: publicationCard.id,
                eventCardImage: publicationCard.event_logo || '',
                status: publicationCard.user_status || '',
              };
            }
            return (
              <List.Item key={`${i + 1}`}>
                {publicationCard._source && (!publicationCard._index || publicationCard._index.indexOf('publications') >= 0) ?
                  <PublicationCardSmall
                    bookmarks={this.props.bookmarks}
                    data={publicationCard}
                    isLoggedIn={isLoggedIn}
                    parentComponent={parentComponent}
                    index={i}
                  />
                  :
                  <EventCard
                    eventBookmarkId={eventBookmarkId}
                    eventInformation={eventInformation}
                    sfId={publicationCard.salesforce_id}
                    isLoggedIn={isLoggedIn}
                    index={i}
                    status={eventInformation.status}
                    updateBookmarksData={this.updateEventBookmarkData()}
                    removeBookmarksData={this.removeEventBookmarkData()}
                  />
                }
              </List.Item>
            );
          })
        }
        { (data.length < totalCount) && !isLibraryLazyLoading ?
          <List.Item id="srp-view-more">
            <Button className="linkBtn" onClick={this.lazyLoadBtnClick}>Load More Results</Button>
          </List.Item>
          : null
        }
        { (data.length < totalCount) && isLibraryLazyLoading ?
          <List.Item id="srp-view-more">
            <Button className="linkBtn">Loading...</Button>
          </List.Item>
          : null
        }
      </List>
    );
  }

  render() {
    const { authorText, tickerText, details, subjectText, showMoreText, showLessText, dateText, data, resultCount, parentComponent, totalCount, libSearchEvent, isLoading } = this.props;
    const { toggleState, isOpen, currentOption, ascendingSort, sortOrder } = this.state;
    const publisherDate = 'publisher_date';
    const tickerData = 'ticker.raw';
    const dispNameData = 'primary_analyst_last_name.raw';
    const titleData = 'title';

    const mobTitleOption = [
      { key: '1', text: dateText, value: publisherDate },
      { key: '3', text: tickerText, value: tickerData },
      { key: '2', text: authorText, value: dispNameData },
      { key: '4', text: subjectText, value: titleData },
    ];

    const selectedText = currentOption ? `Sort by ${currentOption}` : `Sort by ${mobTitleOption[0].text}`;
    const selectedOption = currentOption || mobTitleOption[0].text;
    const sortingIcon = ascendingSort ? 'solid-triangle-up' : 'solid-triangle-down';

    return (
      <div className={'right-layout bookmark-library-wrap'} id={'right-layout-library'}>
        <div className="publication-search-result">
          {
            (data && (!isLoading)) ?
              <div className="search-result-count">
                <span className="search-summary">
                  <span>{(libSearchEvent && libSearchEvent.displayValue) ? `${libSearchEvent.displayValue}: ` : null}</span>
                  <span className="result-count">{parentComponent === 'profile-bookmarks' ? `${(totalCount || 0)} Bookmarks` : `${numberWithCommas(resultCount)} Results`}</span>
                </span>
              </div>
              :
              null
          }
          <div className="title-bar desktop-view" id={'library-title-bar-id'}>
            <div className="result-column icon date">
              <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState(publisherDate)}>
                <span className={`${toggleState === publisherDate ? 'underline' : ''}`}>{dateText}</span>
                <Icon name={(toggleState === publisherDate && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={`Sort by ${dateText}`} />
              </Button>
            </div>
            <div className="result-column icon author">
              <Button className="linkBtn btn-text-color" onClick={() => this.toggleState(dispNameData)}>
                <span className={`${toggleState === dispNameData ? 'underline' : ''}`}>{authorText}</span>
                <Icon name={(toggleState === dispNameData && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={`Sort by ${authorText}`} />
              </Button>
            </div>
            <div className="result-column icon ticker">
              <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState(tickerData)}>
                <span className={`${toggleState === tickerData ? 'underline' : ''}`}>{tickerText}</span>
                <Icon name={(toggleState === tickerData && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={`Sort by ${tickerText}`} />
              </Button>
            </div>
            <div className="result-column icon subject">
              <Button className="linkBtn btn-text-color" onClick={() => this.toggleState(titleData)}>
                <span className={`${toggleState === titleData ? 'underline' : ''}`}>{subjectText}</span>
                <Icon name={(toggleState === titleData && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={`Sort by ${subjectText}`} />
              </Button>
            </div>
            <div className="result-column icon user-pref intro-show-more-section">
              <Button className="linkBtn btn-text-color" onClick={() => this.showDetails()}>
                <span >{!details ? showMoreText : showLessText }</span>
                <Icon className="showMoreLessIcon" name={!details ? 'angle down' : 'angle up'} title={st.showMoreLess} />
              </Button>
            </div>
          </div>
          <div className="mobile-view">
            <div className={'title-bar'}>
              <span>{selectedText}</span>
              <Button className={'sorting-icon-btn'} onClick={this.onSortClick()}><div className={`${sortingIcon}`} /></Button>
              <Button className={`linkBtn ${isOpen ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={this.openOptionDiv()} />
            </div>
            {isOpen &&
              <div className={'options-div'}>
                <List>
                  {
                    mobTitleOption.map((data) => {
                      return (
                        <List.Item onClick={this.optionSelected(data)}>
                          <div className={'single-option'}>
                            <span className={`${selectedOption === data.text ? 'selected-value' : ''}`}>{data.text}</span>
                            <div className={`${selectedOption === data.text ? 'bmo_chevron tick' : ''}`} />
                          </div>
                        </List.Item>
                      );
                    })
                  }
                </List>
              </div>
            }
          </div>
          { this.getResultsMarkup() }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  bookmarks: userSelector.getBookmarkIds(state),
  resultCount: librarySelector.getTotalResultsCount(state),
  fromDate: datepickerSelector.getFromDate(state),
  toDate: datepickerSelector.getToDate(state),
  eventBookmarkId: userSelector.getEventsIds(state),
  isFromSort: librarySelector.getIsFromSort(state),
  isExpand: librarySelector.getShowMoreOrLess(state),
  details: librarySelector.getShowMoreOrLess(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateShowMoreOrLessFilter: () => {
    dispatch(UPDATE_SHOW_MORE_OR_LESS_FILTER());
  },
  getUserProfilePreferences: () => {
    dispatch(GET_USER_PROFILE_PREFERENCES());
  },
  updateEventBookmarksData: (data, allBookmark) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('events', data, allBookmark));
  },
  removeEventBookmarksData: (data, allBookmark) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('events', data, allBookmark));
  },
  resetLibraryResult: () => {
    dispatch({ type: SET_LIBRARY_SEARCH_API_RESULTS, data: null });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkLibrarySearchResult);
