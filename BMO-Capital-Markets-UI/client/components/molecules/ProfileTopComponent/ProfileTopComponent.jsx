/* @flow weak */

/*
 * Component: ProfileTopComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  userSelector,
} from 'store/selectors';

import {
  USER_AUTH_VERIFY_LOGIN,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileTopComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileTopComponent extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    history: PropTypes.object.isRequired,
    verifyLogin: PropTypes.func,
    children: PropTypes.array,
  };

  componentWillMount() {
    const {
      isAuthenticated,
      history,
      verifyLogin
    } = this.props;

    if (isAuthenticated === null) {
      verifyLogin();
    }

    if (isAuthenticated === false) {
      history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated === false) {
      this.props.history.push('/');
    }
  }
  render() {
    const { children } = this.props;
    return (
      <div className="profile-landing-page">
        <div className="profile-landing-body">
          <div className="profile-top-component">
            <Grid>
              {children}
              <hr className="horizontalSep" />
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  verifyLogin: () => {
    dispatch(USER_AUTH_VERIFY_LOGIN());
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileTopComponent));
