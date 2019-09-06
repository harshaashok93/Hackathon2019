/* @flow weak */

/*
 * Component: SearchResult
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BookmarkLibrarySearchResult } from 'components';

import {
  librarySelector,
  searchSelector,
  userSelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SearchResult.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SearchResult extends Component {
  props: {
    authorText: '',
    tickerText: '',
    subjectText: '',
    showMoreText: '',
    showLessText: '',
    dateText: '',
    searchResults: [],
    makeAPICall: () => void,
    isLoading: false,
    searchEvent: {},
    totalCount: '',
    isLoggedIn: Boolean,
    isFromSort: Boolean,
  };

  state = {
  }

  render() {
    return (
      <BookmarkLibrarySearchResult {...this.props} data={this.props.searchResults} />
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  searchResults: librarySelector.getResults(state),
  isLoading: librarySelector.getIsLoading(state),
  searchEvent: searchSelector.getSearchEvent(state),
  totalCount: librarySelector.getTotalResultsCount(state),
  isFromSort: librarySelector.getIsFromSort(state),
});

const mapDispatchToProps = () => ({
  //
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
