import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  userSelector,
} from 'store/selectors';

import {
  USER_AUTH_VERIFY_LOGIN,
} from 'store/actions';

class RoutePrivateContainer extends Component {
  static propTypes = {
    component: PropTypes.any,
    isAuthenticated: PropTypes.bool,
    history: PropTypes.object.isRequired,
    verifyLogin: PropTypes.func,
    superUserOnly: PropTypes.bool,
    profile: PropTypes.object,
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
    if (!this.canAccessPage(nextProps)) {
      this.props.history.push('/');
    }
  }

  canAccessPage = (props = this.props) => {
    const { isAuthenticated, superUserOnly, profile } = props;
    if (profile) {
      if (superUserOnly && profile.is_super_user !== undefined) {
        return (isAuthenticated && profile.is_super_user);
      }
    }
    return isAuthenticated;
  }

  render() {
    const {
      component: Component,
    } = this.props;

    if (this.canAccessPage()) {
      return <Component {...this.props} />;
    }

    return null;
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: userSelector.getIsLoggedIn(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  verifyLogin: () => {
    dispatch(USER_AUTH_VERIFY_LOGIN());
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutePrivateContainer));
