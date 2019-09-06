/* @flow weak */

/*
 * Component: MegaMenuLink
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './MegaMenuLink.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class MegaMenuLink extends Component {
  props: {
    to: '',
    text: '',
    parentName: '',
    closeMegaMenu: () => void
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleNavClick = (action, label) => {
    pushToDataLayer('common', 'megaMenuLinks', { action, label });
    this.props.closeMegaMenu();
  }

  render() {
    const { to, text, parentName } = this.props;
    if (to.url) {
      if (to.link_target !== 'newTab') {
        return (
          <li><NavLink onClick={() => this.handleNavClick(parentName, text)} to={to.url}>{text}</NavLink></li>
        );
      }
      return (
        <li><a target="_blank" onClick={() => this.handleNavClick(parentName, text)} href={to.url}>{text}</a></li>
      );
    }
    return null;
  }
}

export default MegaMenuLink;
