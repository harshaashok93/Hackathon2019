/* @flow weak */

/*
 * Component: LeftBarMenuWrapper
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { StickyComponent } from 'components';
import { mapPropsToChildren } from 'utils/reactutils';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LeftBarMenuWrapper.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LeftBarMenuWrapper extends Component {
  props: {
    children: {},
    isTips: bool,
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
    const { children, isTips } = this.props;
    return (
      <div className="left-bar-menu-wrapper">
        <StickyComponent>
          <div className="left-drawer-layout">
            {mapPropsToChildren(children, { isTips, childComps: children }) }
          </div>
        </StickyComponent>
      </div>
    );
  }
}

export default LeftBarMenuWrapper;
