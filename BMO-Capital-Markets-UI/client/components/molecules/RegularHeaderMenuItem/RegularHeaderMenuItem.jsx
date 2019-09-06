/* @flow weak */

/*
 * Component: RegularHeaderMenuItem
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
import './RegularHeaderMenuItem.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class RegularHeaderMenuItem extends Component {
  props: {
    to: string,
    text: string,
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleNavClick = (label) => {
    pushToDataLayer('common', 'bmoEquityHeaderResearchOptions', { label });
  }

  render() {
    const { to, text } = this.props;
    const pathName = window.location.pathname;

    const className = (pathName.split('/')[1] === to.url.split('/')[1] ? 'active' : '');
    if (to.url) {
      if (to.link_target !== 'newTab') {
        return (
          <NavLink onClick={() => this.handleNavClick(text)} id={text.replace(/\s/g, '-').toLowerCase()} className={`regular-header-menu-item ${className}`} to={to.url}>
            <div className="menu-text">
              {text}
            </div>
          </NavLink>
        );
      }
      return (
        <a target="_blank" onClick={() => this.handleNavClick(text)} className={`regular-header-menu-item ${className}`} href={to.url}>
          <div className="menu-text">
            {text}
          </div>
        </a>
      );
    }
    return null;
  }
}

export default RegularHeaderMenuItem;
