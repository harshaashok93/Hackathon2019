/* @flow weak */

/*
 * Component: SearchCircle
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Heading } from 'unchained-ui-react';
import { SearchInputTextBox } from 'components';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SearchComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SearchComponent extends Component {
  props: {
    // Prop types go here
  };

  static defaultProps = {
  };

  state = {
    winWidth: 1000
  };

  componentWillMount() {
    // ...
  }
  render() {
    return (
      <div className="search-component-wrapper">
        <div className="search-circle">
          <span className="outer-circle" />
          <Heading className={'search-circle-heading'} content="Search" />
          <SearchInputTextBox resultBoxMaxWidth={`${this.state.winWidth - 550}px`} />
        </div>
      </div>
    );
  }
}

export default SearchComponent;
