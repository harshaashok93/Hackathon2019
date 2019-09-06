/* @flow weak */

/*
 * Component: SearchInput
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Input, Image } from 'unchained-ui-react';
import { SearchResults } from 'components';
import { pushToDataLayer } from 'analytics';
import { withRouter } from 'react-router-dom';
import { LEFT_ARROW_CIRCLE_BLUE } from 'constants/assets';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SearchInput.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SearchInput extends Component {
  props: {
    handleSearchChange: () => void,
    results: {},
    resetSearchResults: () => void,
    onEnter: () => void,
    history: {
      push: () => void
    },
    featuredPublication: {}
  };

  state = {
    isFocused: '',
    isSelfClick: false,
    searchTextValue: '',
    value: '',
    source: []
  };

  SEARCH_CHAR_COUNT = 1
  searchTextValue = ''

  handleResultSelect = (e, result) => this.setState({ value: result.title });

  componentDidMount() {
    // ...
  }
  clickSearchInput = () => {
    this.searchTextValue = '';
    this.setState({ isFocused: 'focus', isSelfClick: true });
  }
  searchInputFocusOut = () => {
    this.props.resetSearchResults();
    this.setState({ isFocused: '', searchTextValue: '' });
  }
  autoSuggestClick = () => {
    this.setState({ isSelfClick: true });
  }
  handleMouseUp = (e) => {
    if (!(e.target.localName === 'a' || e.target.id === 'auto-sugg-close')) {
      if (!this.state.isSelfClick) {
        this.setState({ isFocused: '', isSelfClick: false, searchTextValue: '' });
      }
      this.setState({ isSelfClick: false });
    }
  }
  handleEscape = (e) => {
    if (e.which === 27) {
      this.searchInputFocusOut();
    }
  }
  componentWillMount() {
    document.body.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('keydown', this.handleEscape);
  }
  componentWillUnmount() {
    document.body.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('keydown', this.handleEscape);
  }
  handleSearchChange = (e) => {
    const value = e.target.value;
    this.searchTextValue = value;
    const { handleSearchChange } = this.props;
    if (this.state.isFocused === '') {
      this.setState({ isFocused: 'focus' });
    }
    this.setState({ searchTextValue: value }, () => {
      if (handleSearchChange) {
        this.counter = 0;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          if (this.counter >= 1) {
            handleSearchChange(value);
            this.counter = 0;
            clearInterval(this.timer);
          }
          this.counter += 1;
        }, 100);
      }
    });
  }

  handleSearchSubmitForm = (val) => {
    const value = val;
    pushToDataLayer('search', 'autosuggestSearchClick', { label: value });
    if (value && value.length > this.SEARCH_CHAR_COUNT) {
      this.props.history.push(`/library/?searchType=enter&searchVal=${encodeURIComponent(value)}`);
      this.props.onEnter(value);
      this.searchInputFocusOut();
    }
  }
  submitSearchForm = (val) => (e) => {
    if (e.key === 'Enter') {
      this.handleSearchSubmitForm(val);
    }
  }
  render() {
    const { isFocused, searchTextValue } = this.state;
    const { results } = this.props;
    const showSearchResults = results && Object.keys(results).length > 0;
    return (
      <div>
        <div className={`ui search search-input-text-box ${isFocused}`}>
          <div className="ui icon input">
            <Button className="bmo-search-icon search-icon" onClick={() => this.handleSearchSubmitForm(this.searchTextValue)} />
            <Input
              className={'search-input-text'}
              input={{
                value: searchTextValue,
                className: 'prompt',
                placeholder: 'Quick Search',
                onMouseDown: this.clickSearchInput,
                onKeyPress: this.submitSearchForm(searchTextValue),
                'aria-label': 'Search input box',
                onInput: this.handleSearchChange,
                id: 'search-input-text-box'
              }}
            />
            {
              <Button className="enter-btn" onClick={() => this.handleSearchSubmitForm(this.searchTextValue)}>
                <Image src={LEFT_ARROW_CIRCLE_BLUE} />
              </Button>
            }
            <Button id={'auto-sugg-close'} className="cloes-auto-suggest bmo-close-btn bg-icon-props" onClick={this.searchInputFocusOut} />
          </div>
        </div>
        { (showSearchResults && searchTextValue.length > this.SEARCH_CHAR_COUNT) ? <SearchResults {...results} searchTextValue={searchTextValue} isFocused={showSearchResults ? 'focus' : ''} featuredPublication={this.props.featuredPublication} searchInputFocusOut={this.searchInputFocusOut} autoSuggestClick={this.autoSuggestClick} /> : null }
      </div>
    );
  }
}

export default withRouter(SearchInput);
