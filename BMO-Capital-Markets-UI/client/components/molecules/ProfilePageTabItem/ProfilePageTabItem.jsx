/* @flow weak */

/*
 * Component: ProfilePageTabItem
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import { Image } from 'unchained-ui-react';
import {
  userSelector,
} from 'store/selectors';
import { connect } from 'react-redux';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfilePageTabItem.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfilePageTabItem extends Component {
  props: {
    to: '',
    titleText: '',
    tabImage: '',
    tabHoverImage: '',
    showOnlyForApprovedUser: '',
    profile: {}
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleGTM = (label) => {
    pushToDataLayer('profile', 'profileNavBtnClick', { label });
  }

  render() {
    const { to, titleText, tabImage, tabHoverImage, showOnlyForApprovedUser, profile } = this.props;
    if (to.url) {
      if (showOnlyForApprovedUser === true && profile && profile.rds_id === '') return null;

      if (to.link_target !== 'newTab') {
        return (
          <NavLink to={to.url} onClick={() => this.handleGTM(titleText)} className="menuItem user-profile">
            <div className="tab-icon-holder">
              <Image src={tabImage} className="inactive-img" />
              <Image src={tabHoverImage} className="active-img" />
              <div className="menuText">{ titleText }</div>
            </div>
          </NavLink>
        );
      }
      return (
        <a target="_blank" className="menuItem user-profile" href={to.url}>
          <div className="tab-icon-holder">
            <Image src={tabImage} className="inactive-img" />
            <Image src={tabHoverImage} className="active-img" />
            <div className="menuText">{ titleText }</div>
          </div>
        </a>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
});

export default connect(mapStateToProps)(ProfilePageTabItem);
