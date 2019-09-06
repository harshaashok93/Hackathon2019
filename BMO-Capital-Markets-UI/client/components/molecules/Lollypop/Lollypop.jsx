/* @flow weak */

/*
 * Component: Lollypop
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
import './Lollypop.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Lollypop extends Component {
  props: {
    backgroundImage: '',
    // helpText: '',
    searchText: '',
  };

  static defaultProps = {
  };

  state = {
    winWidth: 1000
  };

  componentWillMount() {
    // ..
  }
  render() {
    const { searchText, backgroundImage } = this.props;
    const bg = { backgroundImage: `url(${backgroundImage})` };
    return (
      <div className="search-with-banner" style={bg} >
        <div className="search-component-wrapper">
          <div className="search-circle">
            <span className="outer-circle" />
            <Heading className={'search-circle-heading'} content={searchText} />
            <SearchInputTextBox resultBoxMaxWidth={`${this.state.winWidth - 550}px`} className={'HomePage'} />
          </div>
        </div>
      </div>
    );
  }
}

export default Lollypop;
