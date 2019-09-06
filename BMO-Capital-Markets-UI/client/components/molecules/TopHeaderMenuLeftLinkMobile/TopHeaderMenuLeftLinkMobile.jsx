/* @flow weak */

/*
 * Component: TopHeaderMenuLeftLinkMobile
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './TopHeaderMenuLeftLinkMobile.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class TopHeaderMenuLeftLinkMobile extends Component {
  props: {
    children: {}
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { children } = this.props;
    return (
      <div className="top-header-menu-left-link-mobile">
        {children}
      </div>
    );
  }
}

export default TopHeaderMenuLeftLinkMobile;
