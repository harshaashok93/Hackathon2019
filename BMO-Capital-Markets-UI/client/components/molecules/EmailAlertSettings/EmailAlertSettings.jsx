/* @flow weak */

/*
 * Component: EmailAlertSettings
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid } from 'unchained-ui-react';
import { mapPropsToChildren } from 'utils/reactutils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './EmailAlertSettings.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class EmailAlertSettings extends Component {
  props: {
    title: '',
    children: {},
    itemCheck: () => void,
    checkboxConfig: {}
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
    const { title, children, itemCheck, checkboxConfig } = this.props;
    return (
      <div className="email-alert-settings">
        <div className="sub-title">{title}</div>
        <Grid>
          {
            mapPropsToChildren(children, { itemCheck, checkboxConfig })
          }</Grid>
      </div>
    );
  }
}

export default EmailAlertSettings;
