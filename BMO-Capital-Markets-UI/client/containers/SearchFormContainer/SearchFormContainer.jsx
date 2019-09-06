/* @flow weak */

/*
 * Component: SearchFormContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SearchInput } from 'components';
import { withRouter } from 'react-router-dom';

import {
  GET_SEARCH_RESULTS,
  RESET_AUTOSUGGEST_RESULTS,
  SET_SEARCH_TYPE
} from 'store/actions';

import {
  searchSelector
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SearchFormContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SearchFormContainer extends Component {
  props: {
    search: () => void,
    searchEnter: () => void,
    resetSearchResults: () => void,
    results: {},
    featuredPublication: {},
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  searchValue = '';

  componentWillUnmount() {
    this.searchValue = '';
  }

  handleSearchChange = (value) => {
    const { search, resetSearchResults } = this.props;
    this.searchValue = value;
    if (value && value.length >= 2) {
      search(value);
    } else if (!value) {
      resetSearchResults();
      search('');
    }
  }

  resetSearchResults = () => {
    const { resetSearchResults } = this.props;
    resetSearchResults();
  }

  handleEnterKey = () => {
    const data = {
      type: 'enter',
      value: this.searchValue,
      displayValue: this.searchValue
    };
    this.props.searchEnter(data);
  }

  render() {
    const { results, featuredPublication } = this.props;
    return (
      <div className="search-form-container">
        <SearchInput
          results={results}
          handleSearchChange={this.handleSearchChange}
          resetSearchResults={this.resetSearchResults}
          onEnter={this.handleEnterKey}
          featuredPublication={featuredPublication}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  results: searchSelector.getSearchResults(state),
});

const mapDispatchToProps = (dispatch) => ({
  search: async (term) => {
    await dispatch(GET_SEARCH_RESULTS(term));
  },
  resetSearchResults: () => dispatch({ type: RESET_AUTOSUGGEST_RESULTS }),
  searchEnter: (data) => dispatch({ type: SET_SEARCH_TYPE, data }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchFormContainer));
