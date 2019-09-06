/* @flow weak */

/*
 * Component: Email
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import {
  userSelector,
} from 'store/selectors';
import { connect } from 'react-redux';
import { Grid } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './Email.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Email extends Component {
  props: {
    profile: {},
    title: ''
  };

  static defaultProps = {
    title: 'Email Alerts'
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { profile, title } = this.props;
    return (
      <Grid.Column computer={3} tablet={6} mobile={12} className="email">
        <div className="heading header-title">{title}</div>
        <div className="emailField">{profile.email || ''}</div>
      </Grid.Column>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
});

export default connect(mapStateToProps)(Email);
