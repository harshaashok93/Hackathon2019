/* @flow weak */

/*
 * Component: StrategyLandingPageWrapper
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Heading } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StrategyLandingPageWrapper.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyLandingPageWrapper extends Component {
  props: {
    children: '',
    to: {},
    buttonText: '',
    title: '',
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
    const { children, to, buttonText, title } = this.props;
    return (
      <div className="strategy-landing-page-wrapper">
        <Heading content={title} className={'heading-text'} />
        {children}
        <NavLink className="page-link" to={to.url}><Button secondary size={'medium'}>{buttonText}</Button></NavLink>
      </div>
    );
  }
}

export default StrategyLandingPageWrapper;
