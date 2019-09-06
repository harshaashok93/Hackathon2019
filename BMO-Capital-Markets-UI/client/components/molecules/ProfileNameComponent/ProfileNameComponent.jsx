/* @flow weak */

/*
 * Component: ProfileNameComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Heading } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  userSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileNameComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileNameComponent extends Component {
  props: {
    profile: {},
    to: {}
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
    const { profile, to } = this.props;
    if (!profile) return null;

    let headerText = <Heading as="h1" className={'name'}>{profile.first_name} {profile.last_name}</Heading>;

    if (to.url && to.url !== window.location.pathname) {
      if (to.link_target !== 'newTab') {
        headerText = <NavLink to={to.url}>{headerText}</NavLink>;
      } else {
        headerText = <a href={to.url} target="_blank">{headerText}</a>;
      }
    }

    return (
      <Grid.Column className="profile-name-component" computer={3} mobile={12} tablet={12}>
        {headerText}
        <Heading as="h3" className={'user-company-name'}>{profile.company}</Heading>
      </Grid.Column>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
});

export default connect(mapStateToProps)(ProfileNameComponent);
