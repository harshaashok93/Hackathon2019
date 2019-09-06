/* @flow weak */

/*
 * Component: QModelMenu

 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QModelMenu.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QModelMenu extends Component {
  props: {
    children: {}
  };

  static defaultProps = {
    children: {}
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }
  panelClick = (e) => {
    e.currentTarget.classList.toggle('active');
  }
  render() {
    const { children } = this.props;
    return (
      <div className="q-model-accordion">
        {children}
      </div>
    );
  }
}

export default QModelMenu;
