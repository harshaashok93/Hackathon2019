/* @flow weak */

/*
 * Component: CoverageOverlayAnalystConnection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import st from 'constants/strings';
import { toShowAnalyst } from 'utils';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
} from 'store/actions';
import {
  userSelector
} from 'store/selectors';
import './CoverageOverlayAnalystConnection.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CoverageOverlayAnalystConnection extends Component {
  props: {
    companyData: {},
    userProfilePreferences: {},
    removeUserPreference: () => void,
    setProfileCompanyList: () => void,
    profile: {}
  };

  static defaultProps = {
  };

  state = {
    isFollowed: false
  };

  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    const { companyData } = this.props;
    if (companyData && companyData.analyst && companyData.analyst.analystId) {
      this.isAnalystFollowed(companyData.analyst.analystId);
    }
  }
  followAction = (analystInfo, analystId) => () => {
    const gtmData = {
      'BMO Analyst Name': analystInfo.name,
      'BMO Analyst Job Title': analystInfo.position || '',
      'Sector Name': analystInfo.sectors ? Object.keys(analystInfo.sectors).map((key) => key).join(';') : '',
    };
    const { userProfilePreferences } = this.props;
    let newAnalystSet = [];
    if (userProfilePreferences && userProfilePreferences.user_pref && userProfilePreferences.user_pref.analyst) {
      newAnalystSet = userProfilePreferences.user_pref.analyst;
      newAnalystSet.map(x => x.name);
    }
    newAnalystSet.push(analystId);
    if (this.state.isFollowed) {
      this.props.removeUserPreference({ analysts: [analystId] });
      this.setState({ isFollowed: false });
      gtmData['Follow Type'] = 'Un Follow';
      pushToDataLayer('ourdepartment', 'OurCoverageOverlayPage', { label: name, action: 'Follow', data: gtmData });
    } else {
      this.props.setProfileCompanyList({ analysts: newAnalystSet });
      this.setState({ isFollowed: true });
      gtmData['Follow Type'] = 'Follow';
      pushToDataLayer('ourdepartment', 'OurCoverageOverlayPage', { label: name, action: 'Follow', data: gtmData });
    }
  }
  isAnalystFollowed = (analystId) => {
    const { userProfilePreferences } = this.props;
    if (userProfilePreferences && userProfilePreferences.user_pref && userProfilePreferences.user_pref.analysts) {
      const analysts = userProfilePreferences.user_pref.analysts;
      let { isFollowed } = this.state;
      analysts.map(x => { (x.id === analystId || isFollowed ? isFollowed = true : isFollowed = false); return null; });
      this.setState({ isFollowed });
    }
  }
  render() {
    const { companyData, profile } = this.props;
    const { isFollowed } = this.state;

    let roles = [];
    roles = companyData.analyst.roles.map((item) => {
      return (
        { name: item }
      );
    });

    const analystData = {
      roles,
      client_code: companyData.analyst.client_code
    };

    const isActive = (companyData.analyst.is_active === true && toShowAnalyst(analystData) && (!companyData.analyst.do_not_sync_to_rds));
    if (isActive) {
      return (
        <div className="coverage-overlay-analyst-connection">
          <a href={`mailto:${companyData.analyst.contacts.email}`} title={companyData.analyst.contacts.email}>
            <span className="forgot-mail-icon icons" />
          </a>

          <a href={`tel:${companyData.analyst.contacts.phone}`} title={companyData.analyst.contacts.phone}> <span className="forgot-phone-icon icons" data-phone={companyData.analyst.contacts.phone} /></a>
          {
            profile && profile.can_access_content && profile.can_follow_content ?
              <div className="follow-text" onClick={this.followAction(companyData.analyst, companyData.analyst.analystId)} tabIndex={0} role={'button'} onKeyPress={() => {}}>
                <span className={isFollowed ? 'follow-contact selected icons' : 'follow-contact icons'} title={isFollowed ? st.unfollow : st.follow} />
                {!isFollowed ? 'Follow' : 'Unfollow'}
              </div>
              : null
          }
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  setProfileCompanyList: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeUserPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoverageOverlayAnalystConnection);
