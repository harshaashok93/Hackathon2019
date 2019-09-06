/* @flow weak */

/*
 * Component: ResearchLayoutFilters
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Button, Checkbox, Modal, Input } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { BmoPopUp, StickyComponent } from 'components';
import st from 'constants/strings';
import { toShowAnalyst, formatAnalystName } from 'utils';
import { pushToDataLayer } from 'analytics';
import { sitenameVariable } from 'constants/UnchainedVariable';

import {
  researchSelector,
  userSelector,
} from 'store/selectors';

import {
  UPDATE_PROFILE_BOOKMARKS_DATA,
  REMOVE_PROFILE_BOOKMARKS_DATA,
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
  GET_USER_PROFILE_PREFERENCES,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import './ResearchLayoutFilters.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ResearchLayoutFilters extends Component {
  props: {
    researchLayoutData: {},
    bookmarks: [],
    updateProfileBookmarksData: () => void,
    removeProfileBookmarksData: () => void,
    setProfileCompanyList: () => void,
    removeUserPreference: () => void,
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
    getUserProfilePreferences: () => void,
    updateFontSize: () => void,
    currentFontSize: '',
    handleSearchChange: () => void,
    pid: '',
    profile: {},
    isAuthenticated: bool,
  };

  static defaultProps = {
  };

  state = {
    followingAnalystSelect: false,
    followingCompanySelect: false,
    followingIndustrySelect: false,
    showFollowingSelectPopup: false,
    showFontSelectPopup: false,
    showOptionsPopup: false,
    showSearchPopup: false,
    searchVal: ''
  };

  followAction = (selected, data) => {
    const { setProfileCompanyList, removeUserPreference } = this.props;
    const follow = this.isFollowed(selected, data);
    if (!data) return;
    if (follow) {
      removeUserPreference({ [selected]: [parseInt(data, 10)] });
    } else {
      setProfileCompanyList({ [selected]: [parseInt(data, 10)] });
    }
  }

  followedMap = {
    analysts: false,
    coverages: false,
    sub_sectors: false,
  };

  isFollowed = (selected, data) => {
    const { userProfilePreferences } = this.props;
    let arr = [];
    try {
      arr = userProfilePreferences.user_pref[selected];
    } catch(e) { // eslint-disable-line
      arr = [];
    }
    const isFollowed = arr.filter(item => item.id === parseInt(data, 10)).length > 0;
    this.followedMap[selected] = isFollowed;
    return isFollowed;
  }

  setFollowingSelection = (selected) => {
    const { researchLayoutData } = this.props;
    const { Analysts, FollowsData, CompanyPerformance, SectorName } = researchLayoutData._source;
    const { followingAnalystSelect, followingCompanySelect, followingIndustrySelect } = this.state;
    if (selected === 'analysts') {
      this.setState({ followingAnalystSelect: !followingAnalystSelect });
      this.followAction(selected, Analysts.data[0].personId);
      pushToDataLayer('report', 'reportFollow', { label: `analyst:${displayName}` });
    } else if (selected === 'coverages') {
      this.setState({ followingCompanySelect: !followingCompanySelect });
      this.followAction(selected, FollowsData ? FollowsData.company_id : '');
      pushToDataLayer('report', 'reportFollow', { label: `coverage:${CompanyPerformance.ticker}` });
    } else {
      this.setState({ followingIndustrySelect: !followingIndustrySelect });
      this.followAction('sub_sectors', FollowsData ? FollowsData.sector_id : '');
      pushToDataLayer('report', 'reportFollow', { label: `sector:${SectorName.Title}` });
    }
  }

  setFollowingSelectPopup = (val) => () => {
    const followedLength = Object.keys(this.followedMap).filter(item => this.followedMap[item] === true).length;
    if (followedLength) {
      this.setState({ showFollowingSelectPopup: true });
    } else {
      this.setState({ showFollowingSelectPopup: val });
    }
  }

  stopEvtPropagation = (e) => {
    e.stopImmediatePropagation();
  }

  closeOnDocumentClick = () => {
    /*
    const followingPopupElement = document.getElementById('following-popup');
    if (followingPopupElement && !followingPopupElement.contains(document.getElementById(e.target.id))) {
      this.setState({ showFollowingSelectPopup: false });
    }
    */
    /*
    const fontPopupElement = document.getElementById('font-popup');
    if (fontPopupElement && !fontPopupElement.contains(document.getElementById(e.target.id))) {
      this.setState({ showFontSelectPopup: false });
    }
    */

    /*
    const searchPopupElement = document.getElementById('search-popup');
    if (searchPopupElement && !searchPopupElement.contains(e.target)) {
      this.setState({ showSearchPopup: false, searchVal: '' });
      this.props.handleSearchChange('');
    }
    */
  }

  componentWillMount() {
    const { isAuthenticated } = this.props;
    document.addEventListener('click', this.closeOnDocumentClick, true);
    if (isAuthenticated) {
      this.props.getUserProfilePreferences();
    }
  }

  componentWillUnmount() {
    window.targetStr = '';
    document.removeEventListener('click', this.closeOnDocumentClick, true);
    if (this.props.handleSearchChange) {
      this.props.handleSearchChange('');
    }
  }

  componentDidMount() {
    this.mountNode = document.getElementById('research-layout-builder-grid') || document.getElementById('videocast-details-listing');
  }

  getFontPopupContent() {
    // const { showFontSelectPopup } = this.state;
    const { updateFontSize, currentFontSize } = this.props;

    // if (!showFontSelectPopup) return null;

    return (
      <div className="popup" id="font-popup">
        <div className="header">
          <Button
            id={'__font_a'}
            className={`fontChangeBtn size1 ${currentFontSize === 'a' ? 'active' : ''}`}
            content={'A'} onClick={() => updateFontSize('a')}
          />
          <Button
            id={'__font_aa'}
            className={`fontChangeBtn size2 ${currentFontSize === 'aa' ? 'active' : ''}`}
            content={'A'} onClick={() => updateFontSize('aa')}
          />
          <Button
            id={'__font_aaa'}
            className={`fontChangeBtn size3 ${currentFontSize === 'aaa' ? 'active' : ''}`}
            content={'A'} onClick={() => updateFontSize('aaa')}
          />
        </div>
      </div>
    );
  }

  handleSearchChange = (e) => {
    const val = e.target.value;
    this.setState({ searchVal: val });
  }

  handleSearchSubmit = (event) => {
    if (event.which === 13 || event.keyCode === 13) {
      this.props.handleSearchChange(this.state.searchVal);
      window.targetStr = this.state.searchVal;
      this.handleGtmClick('Text Search', this.state.searchVal);
      this.setState({ showSearchPopup: false });

      if (this.state.showOptionsPopup === true) {
        this.setState({ showOptionsPopup: false });
      }
    }
  }

  getSearchPopupContent() {
    // const { showSearchPopup } = this.state;

    // if (!showSearchPopup) return null;

    return (
      <div className="popup" id="search-popup">
        <Input
          input={
            {
              type: 'text',
              placeholder: 'Search the document',
              onChange: this.handleSearchChange,
              value: this.state.searchVal,
              onKeyPress: this.handleSearchSubmit
            }
          }
        />
      </div>
    );
  }

  getFollowingPopupContent() {
    const { researchLayoutData } = this.props;
    // const { showFollowingSelectPopup } = this.state;
    const { Analysts, CompanyPerformance, SectorName, FollowsData } = researchLayoutData._source;

    let isAnalystFollowed = false;
    let isCompanyFollowed = false;
    let isSectorFollowed = false;

    if (Analysts && Analysts.data && Analysts.data.length) {
      isAnalystFollowed = this.isFollowed('analysts', Analysts.data[0].personId);
    }
    if (FollowsData && FollowsData.company_id) {
      isCompanyFollowed = this.isFollowed('coverages', FollowsData.company_id);
    }
    if (FollowsData && FollowsData.sector_id) {
      isSectorFollowed = this.isFollowed('sub_sectors', FollowsData.sector_id);
    }

    if (!researchLayoutData || !researchLayoutData._source) return null;

    let analystData = {};
    if (Analysts && Analysts.data.length) {
      analystData = {
        ...Analysts.data[0],
        client_code: Analysts.data[0].clientCode
      };
    }

    const displayName = formatAnalystName(Analysts.data[0].firstName, Analysts.data[0].middleName, Analysts.data[0].lastName);

    const showAnalystFollowOption = (Analysts && Analysts.data && Analysts.data.length && Analysts.data[0].active === true && toShowAnalyst(analystData) && (!Analysts.data[0].doNotSyncToRds));

    return (
      <div className="popup-follow" id="following-popup">
        <div className="header">
          Selecting below options will prioritize content in your online experience.
          <span />Change your settings any time on your <NavLink to="/profile/following/">profile page.</NavLink>
        </div>
        {
          showAnalystFollowOption ?
            <Button className="options" onClick={() => this.setFollowingSelection('analysts')}>
              <div className="radioSection">
                <Checkbox
                  id={Math.random()}
                  radio
                  name="following"
                  checked={isAnalystFollowed}
                />
              </div>
              <div className="textSection">
                <div>{Analysts.data[0].role}</div>
                <div>{displayName}</div>
              </div>
            </Button>
            : null
        }
        {
          CompanyPerformance && CompanyPerformance.ticker ?
            <Button className="options" onClick={() => this.setFollowingSelection('coverages')}>
              <div className="radioSection">
                <Checkbox
                  id={Math.random()}
                  radio
                  name="following"
                  checked={isCompanyFollowed}
                />
              </div>
              <div className="textSection">
                <div>Ticker</div>
                <div>{CompanyPerformance.ticker}</div>
              </div>
            </Button>
            : null
        }
        {
          SectorName ?
            <Button className="options" onClick={() => this.setFollowingSelection('sub_sectors')}>
              <div className="radioSection" id={Math.random()}>
                <Checkbox
                  id={Math.random()}
                  radio
                  name="following"
                  checked={isSectorFollowed}
                />
              </div>
              <div className="textSection">
                <div>Industry</div>
                <div>{SectorName.Title}</div>
              </div>
            </Button>
            : null
        }
      </div>
    );
  }

  handleBookmarkClick = () => {
    const { bookmarks, updateProfileBookmarksData, removeProfileBookmarksData, researchLayoutData } = this.props;
    if (!researchLayoutData || !researchLayoutData._source) return;

    const src = researchLayoutData._source;
    const publicationID = src.PublicationID;
    const title = src.MainContent ? src.MainContent.title : '';

    if (bookmarks.indexOf(publicationID) > -1) {
      removeProfileBookmarksData({ id: publicationID }, bookmarks);
    } else {
      updateProfileBookmarksData({ id: publicationID }, bookmarks);
    }
    pushToDataLayer('report', 'reportEvents', { action: 'Bookmark', label: title });
  }

  setFontSelectPopup = (val) => () => {
    this.setState({ showFontSelectPopup: val });
  }

  setSearchPopup = (val) => () => {
    this.setState({ showSearchPopup: val });
  }

  closeOptionsPopup = () => {
    this.setState({ showOptionsPopup: false });
  }

  showOptionsPopup = () => {
    this.setState({ showOptionsPopup: true });
  }

  handleGtmClick = (action, name) => {
    pushToDataLayer('report', 'reportEvents', { action, label: name });
  }

  handlePrintClick = (action, name) => {
    this.handleGtmClick(action, name);
    if (action.indexOf(this.printLabel) !== -1) {
      const pid = action.split('|')[1];
      window.open(`/api/v1/publication/getPublicationPdfLive/?id=${pid}&read=true&stamp=${new Date().getTime() * 1000}&sitename=${sitenameVariable.sitename}`, '_blank');
    }
  }

  getFormattedElement = (el) => {
    const MAX_LENGTH = 2;
    if (el.length >= MAX_LENGTH) {
      return (
        <span className="research-layout-filter-part">
          <span id="intro-research-layout-filter-part">
            {el.slice(0, MAX_LENGTH)}
          </span>
          {el.slice(MAX_LENGTH)}
        </span>
      );
    }
    return el;
  }

  pageTitle = 'BMO Capital Markets';
  printLabel = 'Print';

  render() {
    const { bookmarks, researchLayoutData, pid, profile } = this.props;
    if (!researchLayoutData._source) return null;

    const { showFollowingSelectPopup, showFontSelectPopup, showOptionsPopup, showSearchPopup } = this.state;
    const { Analysts } = researchLayoutData._source;
    const title = researchLayoutData._source.publicationDisplayName || this.pageTitle;

    const followPopupMarkup = this.getFollowingPopupContent();
    const followedLength = Object.keys(this.followedMap).filter(item => this.followedMap[item] === true).length;
    const publicationID = (researchLayoutData && researchLayoutData._source) ? researchLayoutData._source.PublicationID : '';
    const canBookmark = profile && profile.can_access_content && profile.can_bookmark_content;
    const canFollow = profile && profile.can_access_content && profile.can_follow_content;
    const Sector = (researchLayoutData && researchLayoutData._source) ? researchLayoutData._source.Sector : { active: true, doNotSyncToRds: false };

    const optionsArray = [
      (
        (canFollow && Sector && Sector.active && !Sector.doNotSyncToRds) ?
          <Grid.Column computer={12} tablet={12} mobile={12} className="following-grid">
            <Button
              className={`user-profile ${showFollowingSelectPopup || followedLength ? 'active' : ''}`}
              onClick={this.setFollowingSelectPopup(true)}
              title={st.follow}
            >
              <div className="bg-icon-props following" />
              <div className="follow-text">
                {followedLength ? `Follow (${followedLength})` : null}
              </div>
              <BmoPopUp
                backgroundColor="#e7e7e7"
                forceHide={false}
                strictDirection="right-parallel"
                alsoOnMobile={true}
                hideController={'click'}
                showOnClick={true}
                onUnMount={this.setFollowingSelectPopup(false)}
              >
                {followPopupMarkup}
              </BmoPopUp>
            </Button>
          </Grid.Column>
          : null
      ),
      (
        canBookmark ?
          <Grid.Column computer={12} tablet={12} mobile={12} className={'bookmark-grid'}>
            <Button
              className={`user-profile ${bookmarks.indexOf(publicationID) > -1 ? 'active' : ''}`}
              onClick={this.handleBookmarkClick}
              title={st.bookmark}
            >
              <div className="bg-icon-props bookmarks" />
            </Button>
          </Grid.Column>
          : null
      ),
      (
        Analysts && Analysts.data ?
          (<Grid.Column computer={12} tablet={12} mobile={12} className={'email-grid'}>
            <Button as="a" className="user-profile" href={`mailto:?subject=${encodeURIComponent(title)}&body=${window.location.href}`} title={st.email} onClick={() => { this.handleGtmClick('Analyst Email', displayName); }}>
              <div className="bg-icon-props emailAlerts" />
            </Button>
          </Grid.Column>)
          : null
      ),
      (
        researchLayoutData._source && researchLayoutData._source.BaseUrl ?
          <Grid.Column computer={12} tablet={12} mobile={12} className={'print-grid'}>
            <Button
              as="a"
              className="user-profile"
              title={st.print}
              target="_blank"
              onClick={() => { this.handlePrintClick(`${this.printLabel}|${pid}`, title); }}
            >
              <div className="bg-icon-props publicationPrint" />
            </Button>
          </Grid.Column>
          : null
      ),
      (
        <Grid.Column computer={12} tablet={12} mobile={12} className="font-grid">
          <div
            className={`ui button user-profile ${showSearchPopup ? 'active' : ''}`}
            onClick={this.setSearchPopup(true)}
            title={st.search}
            onKeyPress={() => {}}
            role="button"
            tabIndex={0}
          >
            <div className="bg-icon-props publicationSearch" />
            <BmoPopUp
              forceHide={false}
              strictDirection="right-mid"
              alsoOnMobile={true}
              hideController={'click'}
              showOnClick={true}
              onUnMount={this.setSearchPopup(false)}
            >
              {this.getSearchPopupContent()}
            </BmoPopUp>
          </div>
        </Grid.Column>
      ),
      (
        <Grid.Column computer={12} tablet={2} mobile={12} className="font-grid">
          <Button
            className={`user-profile ${showFontSelectPopup ? 'active' : ''}`}
            onClick={this.setFontSelectPopup(true)}
            title={st.font}
          >
            <div className="bg-icon-props publicationText" />
            <BmoPopUp
              forceHide={false}
              strictDirection="right-mid"
              alsoOnMobile={true}
              hideController={'click'}
              showOnClick={true}
              backgroundColor="#e7e7e7"
              onUnMount={this.setFontSelectPopup(false)}
            >
              {this.getFontPopupContent()}
            </BmoPopUp>
          </Button>
        </Grid.Column>
      )
    ];

    const displayOptions = this.getFormattedElement(optionsArray.filter(option => option !== null));

    const optionButtons = (
      <Grid>{displayOptions}</Grid>
    );

    return (
      <StickyComponent className="research-layout-filters-sticky">
        <div className="research-layout-filters">
          <div className="desktop-tab-only">{optionButtons}</div>
          <div className="mobile-only" id="mobile-options">
            <Button className="filterButton" content={'+'} onClick={() => this.showOptionsPopup()} />
            <Modal
              open={showOptionsPopup}
              className="research-layout-filters-modal"
              closeOnRootNodeClick={false}
              size="fullscreen"
              mountNode={this.mountNode}
              dimmer={false}
            >
              <Modal.Content className="research-layout-filters-content">
                <div className="button-holder">
                  <Button className="ui button modal-close-icon bmo-close-btn" onClick={() => this.closeOptionsPopup()} />
                </div>
                {displayOptions}
              </Modal.Content>
            </Modal>
          </div>
        </div>
      </StickyComponent>
    );
  }
}

const mapStateToProps = (state) => ({
  researchLayoutData: researchSelector.getResearchLayoutData(state),
  bookmarks: userSelector.getBookmarkIds(state),
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
  profile: userSelector.getUserProfileInfo(state),
  isAuthenticated: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateProfileBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  removeProfileBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  getUserProfilePreferences: () => {
    dispatch(GET_USER_PROFILE_PREFERENCES());
  },
  setProfileCompanyList: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeUserPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResearchLayoutFilters);
