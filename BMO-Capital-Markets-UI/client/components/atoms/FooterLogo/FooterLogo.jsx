/* @flow weak */

/*
 * Component: FooterLogo
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Grid } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FooterLogo.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FooterLogo extends Component {
  props: {
    logo: '',
    altText: ''
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
    const { altText, logo } = this.props;
    return (
      <Grid.Column computer={3} mobile={12} className="footer-logo-section" tablet={6}>
        <NavLink to={'/'}>
          <Image alt={altText} src={logo} className={'BMO-footer-logo'} />
        </NavLink>
      </Grid.Column>
    );
  }
}

export default FooterLogo;
