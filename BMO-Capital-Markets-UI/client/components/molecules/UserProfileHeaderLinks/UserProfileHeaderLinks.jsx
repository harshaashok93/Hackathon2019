/* @flow weak */

/*
 * Component: UserProfileHeaderLinks
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { BmoPopUp, CustomNavLink } from 'components';
import { connect } from 'react-redux';
import { childOf } from 'utils';
import { pushToDataLayer } from 'analytics';
import { Image, Modal, Button, Container, Heading } from 'unchained-ui-react';
import { mapPropsToChildren } from 'utils/reactutils';
import { appsettingsVariable } from 'constants/UnchainedVariable';
import st from 'constants/strings';
import {
  userSelector,
  notificationSelector
} from 'store/selectors';

import {
  CLEAR_ERROR_MESSAGE,
  USER_AUTH_SIGN_IN_CLICKED,
  USER_AUTH_VERIFY_LOGIN,
  USER_AUTH_LOGOUT,
  USER_AUTH_CLOSE_MODAL,
  SET_JUST_LOG_OUT,
  UPDATE_NOTIFICATION
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './UserProfileHeaderLinks.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class UserProfileHeaderLinks extends Component {
  props: {
    bookmarkAltText: '',
    bookmarkImage: '',
    bookmarkHoverImage: '',
    notificationImage: '',
    notificationHoverImage: '',
    notificationAltText:'',
    onAuthModalClose: () => void,
    onSignInClick: () => void,
    profile: {},
    verifyLogin: () => void,
    userLogout: () => void,
    isLoggedIn: Boolean,
    isSuperuser: bool,
    children: {},
    bookmarks: [],
    justLogOut: bool,
    justLogOutClear: () => void,
    isUserLoggingOut: bool,
    showLogoutButton: bool,
    notificationData: [],
    notificationCount: Number,
    updateNotification: () => void,
    notificationPageLink: {},
    notificationSeeAllText : '',
    bookmarkSeeAllText : '',
    notificationMessage: '',
    profileAltText: '',
    profileImage: '',
    profileHoverImage: '',
  };

  handleNameLabelClick = () => {
    const { onSignInClick, profile, userLogout, isLoggedIn } = this.props; // eslint-disable-line
    if (window.innerWidth < 701) {
      document.body.style.overflow = 'hidden';
    }
    const authNode = document.querySelector('#auth-modal');
    if (onSignInClick && !authNode && !isLoggedIn) {
      pushToDataLayer('authentication', 'loginHeaderBtnClick', { label: '' });
      onSignInClick();
    }
  }

  handleNavClick = () => {
    if (this.props.isUserLoggingOut || this.state.showlogoutSuccessMsg) return;
    const { isLoggedIn } = this.props;
    if (!isLoggedIn && window.innerWidth < 450) {
      document.body.style.overflow = 'hidden';
    }
  }

  handleClose = () => {
    this.props.onAuthModalClose();
  }

  toggleUserProfileMenu = () => {
    const { showUserProfileMenu } = this.state;
    if (window.innerWidth <= 1024 && !this.isWindows()) {
      if (!showUserProfileMenu) {
        this.setState({ showUserProfileMenu: !showUserProfileMenu, showNotificationMenu: false, showBookMarkMenu: false });
      }
    } else {
      this.setState({ showUserProfileMenu: !showUserProfileMenu, showBookMarkMenu: false, showNotificationMenu: false });
    }
  }
  toggleBookMarkMenu = () => {
    const { showBookMarkMenu } = this.state;
    if (window.innerWidth <= 1024 && !this.isWindows()) {
      if (!showBookMarkMenu) {
        this.setState({ showBookMarkMenu: !showBookMarkMenu, showNotificationMenu: false, showUserProfileMenu: false });
      }
    } else {
      this.setState({ showBookMarkMenu: !showBookMarkMenu, showUserProfileMenu: false, showNotificationMenu: false });
    }
  }
  hideMenuCards = () => {
    this.setState({ showBookMarkMenu: false, showUserProfileMenu: false, showNotificationMenu: false });
  }
  userLogout = (evt) => {
    if (this.props.isUserLoggingOut) return;
    evt.stopPropagation();
    const { profile, userLogout } = this.props;
    if (profile && profile.uuid) {
      pushToDataLayer('authentication', 'logoutClick', { label: profile.uuid });
    }
    if (userLogout) {
      userLogout(true);
      this.setState({ shouldShowLogoutMsgModal: false });
    }
  }

  toggleNotificationMenu = () => {
    const { showNotificationMenu } = this.state;
    const { notificationData } = this.props;
    if (notificationData && notificationData.length) {
      this.setState({ showNotificationCount: false }, () => {
        this.props.updateNotification(notificationData[0].created_date);
      });
    }
    if (window.innerWidth <= 1024 && !this.isWindows()) {
      if (!showNotificationMenu) {
        this.setState({ showNotificationMenu: !showNotificationMenu, showUserProfileMenu: false, showBookMarkMenu: false });
      }
    } else {
      this.setState({ showNotificationMenu: !showNotificationMenu, showUserProfileMenu: false, showBookMarkMenu: false });
    }
  }
  componentDidMount() {
    const { isLoggedIn, verifyLogin } = this.props;
    if (isLoggedIn === null) {
      verifyLogin();
    }
  }
  handleMouseUp = (e) => {
    if (e.target.className && e.target.className.baseVal && !(e.target.className.baseVal.indexOf('pop-up-element') > -1)) { // IE11 baseVal
      this.setState({ shouldShowLogoutMsgModal: false });
    }
    if (window.innerWidth <= 1024 && !this.isWindows()) {
      if (!(childOf(e.target, document.querySelector('#user-profile-header-mobile'))
        || childOf(e.target, document.querySelector('#user-book-mark-header-mobile'))
        || childOf(e.target, document.querySelector('#user-notification-header-mobile')))
        || (e.target.id === 'profileImageBtn')) {
        if (this.state.showUserProfileMenu === true) {
          document.body.style.overflow = '';
        }
        if (!(childOf(e.target, document.querySelector('#user-bookmark'))
        || childOf(e.target, document.querySelector('#user-profile-header-name-and-date'))
         || childOf(e.target, document.querySelector('#user-notification-icons')))) {
          this.setState({ showBookMarkMenu: false, showUserProfileMenu: false, showNotificationMenu: false });
        }
      }
    }
  }
  componentWillMount = () => {
    const { bookmarks } = this.props;
    if (bookmarks && bookmarks.length) {
      this.setState({ bookmarksData: bookmarks });
    }
    document.body.addEventListener('mousedown', this.handleMouseUp);
    document.body.addEventListener('touchstart', this.handleMouseUp);
  }
  componentWillUnmount = () => {
    document.body.removeEventListener('mousedown', this.handleMouseUp);
    document.body.removeEventListener('touchstart', this.handleMouseUp);
  }

  closeLogoutMsgPopup = () => () => {
    document.body.style.overflow = '';
    this.props.justLogOutClear(false);
    this.setState({ shouldShowLogoutMsgModal: false });
  }

  defaultLoggedOutMsg = 'This feature accessible to logged in or registered clients only.';

  componentWillReceiveProps(nextProps) {
    if (nextProps.bookmarks) {
      this.setState({ bookmarksData: Object.assign([], nextProps.bookmarks) });
    }
    if (nextProps.justLogOut && !this.props.justLogOut) {
      this.setState({ showlogoutSuccessMsg: true });
      setTimeout(() => {
        this.props.justLogOutClear(false);
        this.setState({ showUserProfileMenu: false, showBookMarkMenu: false });
        this.setState({ shouldShowLogoutMsgModal: false, isLoggedIn: false, showlogoutSuccessMsg: false, logMessage: this.defaultLoggedOutMsg });
      }, 2000);
    }
    if (nextProps.notificationCount > 0) {
      this.setState({ showNotificationCount: true });
    }
  }

  state = {
    showUserProfileMenu: false,
    showBookMarkMenu: false,
    bookmarksData: [],
    shouldShowLogoutMsgModal: false,
    logMessage: this.defaultLoggedOutMsg,
    showNotificationMenu: false,
    showNotificationCount: false
  }

  closeBookmarksMenu = () => {
    this.setState({ showBookMarkMenu: false });
  }

  closeNotificationMenu = () => {
    this.setState({ showNotificationMenu: false });
  }

  closeProfileMenu = (text) => () => {
    this.setState({ showUserProfileMenu: false });
    pushToDataLayer('authentication', 'profileNavItem', { action: 'Top Menu', label: text });
  }

  isWindows = () => {
    return navigator.platform.indexOf('Win') > -1;
  }

  getDisplayCompanyName = (bookmark) => {
    const src = bookmark._source;
    let displayName = bookmark._source.title;
    let titlePrefix = '';
    if (src.company && src.company.name) {
      titlePrefix = src.company.name;
    } else if (src.sector && src.sector.name) {
      titlePrefix = src.sector.name;
    } else if (src.sector_display_override && src.sector_display_override.name) {
      titlePrefix = src.sector_display_override.name;
    }
    if (titlePrefix) {
      displayName = `${titlePrefix}: ${bookmark._source.title}`;
    }
    return displayName;
  }

  renderBookmarkdiv() {
    const { isLoggedIn, bookmarkSeeAllText } = this.props;
    const { bookmarksData } = this.state;

    bookmarksData.sort((a, b) => {
      const c = new Date((a._source && a.created_at) || a.added_at);
      const d = new Date((b._source && b.created_at) || b.added_at);
      return d - c;
    });

    return (
      <div className={'popup-text-content'}>
        { isLoggedIn && (bookmarksData.length > 0 ?
          <div className="user-book-mark-menu">
            <ul>
              {
                Object.assign([], bookmarksData).splice(0, 3).map(bookmark => {
                  return (
                    <li className="profile-icon-sub-links" key={Math.random()}>
                      {bookmark._source ?
                        <CustomNavLink
                          className="pop-up-element"
                          to={bookmark._source.historical_publication ? bookmark._source.radar_link : `/research/${bookmark._source.product_id}/`}
                          role="button"
                          tabIndex={0}
                          onKeyPress={() => {}}
                          onClick={this.closeBookmarksMenu}
                          isHistoricalPublication={bookmark._source.historical_publication}
                          radarLink={bookmark._source.historical_publication ? bookmark._source.radar_link : ''}
                        >
                          { this.getDisplayCompanyName(bookmark) }
                        </CustomNavLink>
                        :
                        <NavLink
                          className="pop-up-element"
                          to={'/profile/bookmarks/'}
                          role="button"
                          tabIndex={0}
                          onKeyPress={() => {}}
                          onClick={this.closeBookmarksMenu}
                        >
                          {bookmark.event_title}
                        </NavLink>
                      }
                    </li>
                  );
                })
              }
              <li className="profile-icon-sub-links log-out-link">
                <NavLink
                  className={'pop-up-element'}
                  to={'/profile/bookmarks/'}
                  onClick={this.closeBookmarksMenu}
                >
                  { bookmarkSeeAllText || 'See All Bookmarks' }
                </NavLink>
              </li>
            </ul>
          </div>
          :
          <div div className="user-book-mark-menu length-zero">
            <Heading as={'h3'} className={'bookmark-first-para'} content={'Welcome to your bookmarks menu. You can archive any research you find interesting here for easy reference in the future.'} />
            <Heading as={'h3'} className={'bookmark-second-para'} content={'Just click on the bookmark icon located near the title of the publication and it will appear here.'} />
          </div>)
        }
        {!isLoggedIn &&
          <div className={'user-book-mark-menu no-bookmarks'}>
            <Heading as={'h3'} content={<span>You must be logged in to view<br />this content.</span>} />
          </div>
        }
      </div>
    );
  }

  renderNotificationContent() {
    const { isLoggedIn, notificationData, notificationMessage, notificationPageLink, notificationSeeAllText } = this.props;
    return (
      <div className={'popup-text-content'}>
        {isLoggedIn && ((notificationData && notificationData.length > 0) ?
          <div className="user-notification-menu">
            <ul>
              <li className="notitification-following">
                Following
              </li>
              {
                notificationData.map((notification, index) => {
                  return (
                    <li className={`profile-icon-sub-links ${notification.notification_read ? '' : 'read-notification-background'} ${index === 0 && !notification.notification_read ? 'first-unread-notification' : ''}`} key={notification.id}>
                      <NavLink
                        className="pop-up-element"
                        to={notification.links_to}
                        role="button"
                        tabIndex={0}
                        onKeyPress={() => { }}
                        onClick={this.closeNotificationMenu}
                      >
                        <div className="notification-detail">
                          {notification.display_title && notification.display_title.length > 65 ? `${notification.display_title.slice(0, 62)}...` : notification.display_title}
                        </div>
                        <div className="followed-by">
                          {notification.user_follows}
                        </div>
                      </NavLink>
                    </li>
                  );
                })
              }
            </ul>
            <div className="log-out-link">
              { notificationPageLink.link_target !== 'newTab' ?
                <NavLink to={notificationPageLink.url || '/featured-research/following/'} role="button" tabIndex={0} onKeyPress={() => { }} className={'pop-up-element'} onClick={this.closeNotificationMenu}>
                  {notificationSeeAllText || 'See All'}
                </NavLink> :
                <a href={notificationPageLink.url || '/featured-research/following/'} className={'pop-up-element'} target="_blank" onClick={this.closeNotificationMenu}>
                  {notificationSeeAllText || 'See All'}
                </a>
              }
            </div>
          </div>
          :
          <div div className="user-notification-menu length-zero">
            <Heading as={'h3'} className={'notification-message'} content={notificationMessage} />
          </div>)
        }
      </div>
    );
  }

  renderProfileDIv(logoutMsg) {
    const { isLoggedIn, justLogOut, isSuperuser, children, profile, showLogoutButton } = this.props;
    return (
      <div className={'popup-text-content'}>
        {isLoggedIn || justLogOut ?
          <div className="user-profile-menu">
            <ul>
              {mapPropsToChildren(children, { hideMenuCards: this.hideMenuCards, profile })}
              {isSuperuser &&
                <li className="profile-icon-sub-links">
                  <NavLink
                    className="pop-up-element"
                    to={'/admin/'}
                    onClick={this.closeProfileMenu('admin')}
                  >
                    Admin
                  </NavLink>
                </li>
              }
              {showLogoutButton &&
                <li className="profile-icon-sub-links log-out-link">
                  <a
                    className="pop-up-element"
                    onClick={this.userLogout}
                    role="button"
                    tabIndex={0}
                    onKeyPress={() => {}}
                  >
                    {logoutMsg}
                  </a>
                </li>
              }
            </ul>
          </div>
          :
          <div className="user-profile-menu not-loggedin-profile">
            <Heading as={'h3'} content={<span>You must be logged in to view<br />this content.</span>} />
          </div>
        }
      </div>
    );
  }

  renderBmoPopup = () => {
    const { profile, isUserLoggingOut } = this.props;
    const { showUserProfileMenu, showlogoutSuccessMsg } = this.state;

    let logoutMsg = 'Log Out';
    if (isUserLoggingOut) {
      logoutMsg = 'Logging Out...';
    }
    if (showlogoutSuccessMsg) {
      logoutMsg = 'Logout Successful';
    }

    if ((!(window.innerWidth <= 1024) || this.isWindows())) {
      return (
        <BmoPopUp
          alsoOnMobile={true}
          debug={false}
          showOnClickOrHover={false}
          className={`${!profile.can_bookmark_content ? 'can-not-bookmark' : ''}`}
          backgroundColor="#004a7c"
        >
          {this.renderProfileDIv(logoutMsg)}
        </BmoPopUp>
      );
    }
    return (
      <div className={'mobile-view'} id={'user-profile-header-mobile'}>
        {showUserProfileMenu ?
          <div className="triangle" /> : null
        }
        {showUserProfileMenu ? this.renderProfileDIv(logoutMsg) : null}
      </div>
    );
  }

  render() {
    const {
      bookmarkAltText,
      bookmarkImage,
      bookmarkHoverImage,
      profile,
      isLoggedIn,
      notificationCount,
      notificationImage,
      notificationHoverImage,
      notificationAltText,
      profileImage,
      profileHoverImage,
      profileAltText
      // isUserLoggingOut
    } = this.props;
    // const nameLabel = ((isLoggedIn && profile) ? <span>{profile.first_name} {profile.last_name}</span> : 'Login / Register');
    const { showBookMarkMenu, bookmarksData, shouldShowLogoutMsgModal, logMessage, showNotificationMenu, showNotificationCount, showUserProfileMenu } = this.state;
    const isNotificationEnabled = appsettingsVariable.NOTIFICATION_TURNED_ON.toLowerCase() || 'true';
    const showByModal = document.getElementById('user-profile-header-name-and-date');
    const isWindows = this.isWindows();

    return (
      <div className="user-profile-header-links" id="user-profile-header-links">
        {
          !isLoggedIn ?
            <div className={`name-and-date ${isNotificationEnabled === 'true' && 'login-register'}`} id="user-profile-header-name-and-date">
              <span onMouseOver={this.handleNameLabelClick} onClick={this.handleNameLabelClick} className={`name-label ${(isLoggedIn && profile) ? '' : 'not-logged'}`} role="button" tabIndex={0} onFocus={() => {}} onKeyPress={() => {}}>Login / Register</span>
            </div>
            :
            <div>
              { isNotificationEnabled === 'false' &&
              <div className="name-and-date login" id="user-profile-header-name-and-date">
                <div className={'login-user-name'}>
                  <span onClick={() => this.toggleUserProfileMenu()} className={`name-label ${(isLoggedIn && profile) ? '' : 'not-logged'}`} role="button" tabIndex={0} onFocus={() => {}} onKeyPress={() => {}}>{profile.first_name} {profile.last_name}</span>
                  <a className={`user-profile ${showUserProfileMenu.toString()}`} role="button" title={st.userprofile} tabIndex={0} onKeyPress={() => {}} onClick={() => this.handleNavClick('Profile')}>
                    {
                      this.state.showUserProfileMenu ?
                        <span className="active-back-side pop-up-element" />
                        : null
                    }
                    <span onClick={() => this.toggleUserProfileMenu()} onKeyPress={() => {}} role="button" tabIndex={0}>
                      <Image className="pop-up-element" onMouseOver={this.handleClose} onFocus={() => {}} alt={profileAltText} src={profileImage} />
                      <Image className="pop-up-element on-hover" onMouseOver={this.handleClose} onFocus={() => {}} alt={profileAltText} src={profileHoverImage} id="profileImageBtn" />
                    </span>
                  </a>
                </div>
                {this.renderBmoPopup()}
              </div>
              }
              {isNotificationEnabled === 'true' &&
              <div className="name-and-date login" id="user-profile-header-name-and-date">
                <div className={'login-user-name'}>
                  <span onClick={() => this.toggleUserProfileMenu()} onMouseOver={() => this.toggleUserProfileMenu()} className={`name-label ${(isLoggedIn && profile) ? '' : 'not-logged'}`} role="button" tabIndex={0} onFocus={() => {}} onKeyPress={() => {}} title={st.userprofile}>{profile.first_name} {profile.last_name}</span>
                </div>
                {this.renderBmoPopup()}
              </div>
              }
              {isNotificationEnabled === 'true' &&
              <div className="user-notification-icons" id="user-notification-icons">
                {profile.can_follow_content &&
                  <a className={`user-notification ${showNotificationMenu.toString()}`} role="button" tabIndex={0} onKeyPress={() => {}} onClick={() => this.handleNavClick()}>
                    {showNotificationMenu ?
                      <div className="triangle" />
                      : null
                    }
                    {
                      isLoggedIn && notificationCount > 0 && showNotificationCount ?
                        <span className="notification-circle text-ellipsis" onClick={() => this.toggleNotificationMenu()} tabIndex={0} onKeyPress={() => {}} role="button">
                          {notificationCount <= 9 ? notificationCount : '9+'}
                        </span>
                        : null
                    }
                    <span onClick={() => this.toggleNotificationMenu()} onMouseOver={() => this.toggleNotificationMenu()} onFocus={() => {}} onKeyPress={() => {}} role="button" tabIndex={0}>
                      <Image className="pop-up-element" onMouseOver={this.handleClose} onFocus={() => {}} alt={notificationAltText} src={notificationImage} title={st.userNotification} />
                      <Image className="pop-up-element on-hover" onMouseOver={this.handleClose} onFocus={() => {}} alt={notificationAltText} src={notificationHoverImage} title={st.userNotification} />
                    </span>
                    {((!(window.innerWidth <= 1024)) || isWindows) ?
                      <BmoPopUp
                        alsoOnMobile={false}
                        debug={false}
                        showOnClickOrHover={true}
                        actLeftBuff={-25}
                        actTopBuff={0}
                        backgroundColor="#004a7c"
                        className={isWindows ? 'windows-enable-bmo-pop-up' : ''}
                      >
                        {this.renderNotificationContent()}
                      </BmoPopUp>
                      :
                      <div className={'mobile-view'} id={'user-notification-header-mobile'}>
                        {showNotificationMenu ? this.renderNotificationContent() : null}
                      </div>
                    }
                  </a>
                }
              </div>
              }
              <div className="user-prof-short-cut-icons">
                {profile.can_bookmark_content &&
                  <a className={`user-bookmark ${showBookMarkMenu.toString()}`} id="user-bookmark" title={st.userbookmark} role="button" tabIndex={0} onKeyPress={() => {}} onClick={() => this.handleNavClick('Bookmarks')}>
                    {this.state.showBookMarkMenu ?
                      <div className="triangle" />
                      : null
                    }
                    {
                      isLoggedIn && bookmarksData.length > 0 ?
                        <span className="notification-circle text-ellipsis" onClick={() => this.toggleBookMarkMenu()} tabIndex={0} onKeyPress={() => {}} role="button">
                          {bookmarksData.length <= 9 ? bookmarksData.length : '9+'}
                        </span>
                        : null
                    }
                    <span onClick={() => this.toggleBookMarkMenu()} onMouseOver={() => this.toggleBookMarkMenu()} onFocus={() => {}} onKeyPress={() => {}} role="button" tabIndex={0}>
                      <Image className="pop-up-element" onMouseOver={this.handleClose} onFocus={() => {}} alt={bookmarkAltText} src={bookmarkImage} />
                      <Image className="pop-up-element on-hover" onMouseOver={this.handleClose} onFocus={() => {}} alt={bookmarkAltText} src={bookmarkHoverImage} />
                    </span>
                    {((!(window.innerWidth <= 1024)) || isWindows) ?
                      <BmoPopUp
                        alsoOnMobile={true}
                        debug={false}
                        showOnClickOrHover={true}
                        actLeftBuff={-25}
                        actTopBuff={0}
                        className={isWindows ? 'windows-enable-bmo-pop-up' : ''}
                        backgroundColor="#004a7c"
                      >
                        {this.renderBookmarkdiv()}
                      </BmoPopUp>
                      :
                      <div className={'mobile-view'} id={'user-book-mark-header-mobile'}>
                        {showBookMarkMenu ? this.renderBookmarkdiv() : null}
                      </div>
                    }
                  </a>
                }
              </div>
            </div>
        }
        <Modal
          open={shouldShowLogoutMsgModal}
          className="auth-modal-not-logged"
          id="auth-modal-not-logged"
          dimmer={false}
          role="dialog"
          mountNode={showByModal}
        >
          <Modal.Content>
            <Button tabIndex={0} className="not-logged-modal-close bmo-close-btn bg-icon-props" onClick={this.closeLogoutMsgPopup()} aria-label="Close Modal" />
            <Container className="form-container">
              <Container className="not-logged-div">
                <Heading as={'h1'}>
                  {logMessage}
                </Heading>
              </Container>
            </Container>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  profile: userSelector.getUserProfileInfo(state),
  bookmarks: userSelector.getAllBookmarkedData(state),
  justLogOut: userSelector.getJustLogOut(state),
  isSuperuser: userSelector.isSuperuser(state),
  isUserLoggingOut: userSelector.getUserLoggingOutFlag(state),
  showLogoutButton: userSelector.getShowLogoutButton(state),
  notificationData: notificationSelector.getNotificationData(state),
  notificationCount: notificationSelector.getNotificationCount(state),
  notificationMessage: notificationSelector.getNotificationMessage(state)
});

const mapDispatchToProps = (dispatch) => ({
  justLogOutClear: (data) => {
    dispatch({ type: SET_JUST_LOG_OUT, data });
  },
  onSignInClick: () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_SIGN_IN_CLICKED });
  },
  verifyLogin: () => {
    dispatch(USER_AUTH_VERIFY_LOGIN());
  },
  onAuthModalClose: () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    dispatch({ type: USER_AUTH_CLOSE_MODAL });
  },
  userLogout: (setJustLogout = false) => dispatch(USER_AUTH_LOGOUT(setJustLogout)),
  updateNotification: (lastestNotificationDate) => {
    dispatch(UPDATE_NOTIFICATION(lastestNotificationDate));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileHeaderLinks);
