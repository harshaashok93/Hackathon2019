/* @flow weak */

/*
 * Component: ProfileIconSubLinks
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileIconSubLinks.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileIconSubLinks extends Component {
  props: {
    text: '',
    to: {},
    hideMenuCards: () => void,
    profile: {},
    isProfileRelated: bool,
  };

  state = {
    notificationText: 0
  };

  componentDidMount() {
    // Component ready
  }

  hideMenuCards = (text) => {
    const { hideMenuCards } = this.props;
    if (hideMenuCards) {
      pushToDataLayer('authentication', 'profileNavItem', { action: 'Top Menu', label: text });
      hideMenuCards();
    }
  }

  render() {
    const { text, to, profile, isProfileRelated } = this.props;
    const { notificationText } = this.state;
    const hasNotification = parseInt(notificationText, 10) > 0;
    let showLink = true;
    if (isProfileRelated) {
      showLink = profile.can_bookmark_content;
    }

    return (
      <div className="profile-icon-sub-links">
        {showLink && to.url &&
          (
            to.link_target !== 'newTab' ?
              <div>
                <NavLink className={'pop-up-element'} to={to.url} onClick={() => this.hideMenuCards(text)} tabIndex={0} onKeyPress={() => {}} role="button">
                  {text}
                </NavLink>
                {
                  hasNotification ?
                    <span className="notification-circle pop-up-element">
                      {notificationText}
                    </span>
                    : null
                }
              </div>
              :
              <div>
                <a className={'pop-up-element'} target={'_blank'} href={to.url} onClick={() => this.hideMenuCards(text)} tabIndex={0} onKeyPress={() => {}} role="button">
                  {text}
                </a>
                {
                  hasNotification ?
                    <span className="notification-circle pop-up-element">
                      {notificationText}
                    </span>
                    : null
                }
              </div>
          )
        }
      </div>
    );
  }
}

export default ProfileIconSubLinks;
