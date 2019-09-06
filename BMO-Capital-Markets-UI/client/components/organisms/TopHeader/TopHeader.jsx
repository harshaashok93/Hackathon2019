/* @flow weak */

/*
 * Component: TopHeader
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
// import { HeaderMenuList, UserProfileHeaderLinks } from 'components';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './TopHeader.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class TopHeader extends Component {
  props: {
    // menuList: [],
    // user: {},
    // onSignInClick: () => void,
    children: {}
  };

  static defaultProps = {
  };

  state = {
    // ...
  };

  componentDidMount() {
    // Component ready
  }
  render() {
    // const { menuList, user, onSignInClick } = this.props;
    const { children } = this.props;
    return (
      <div className="top-header" id="top-header">
        <div className="header-wrapper">
          {children}
          {/*
          <HeaderMenuList menuList={menuList} />
          <UserProfileHeaderLinks user={user} onSignInClick={onSignInClick} />
          */}
        </div>
      </div>
    );
  }
}

export default TopHeader;
