/* @flow weak */

/*
 * Component: FooterLinkSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FooterLinkSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FooterLinkSection extends Component {
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
      <Grid.Column computer={8} mobile={12} className="footer-links">
        <Grid className="footer-link-section">
          <Grid.Row>
            {children}
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }
}

export default FooterLinkSection;
