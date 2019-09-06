/* @flow weak */

/*
 * Component: AnalystsDetailBio
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { Image, Button } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import { connect } from 'react-redux';
import truncate from 'lodash/truncate';
import st from 'constants/strings';
import { formatAnalystName, downloadBlobFile } from 'utils';

import {
  GET_USER_PROFILE_PREFERENCES,
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
} from 'store/actions';
import {
  userSelector
} from 'store/selectors';

import {
  downloadAnalystBioPDF,
} from 'api/department';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { RichText } from 'components';
import './AnalystsDetailBio.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsDetailBio extends Component {
  props: {
    data: {},
    getUserProfilePreferences: () => void,
    setProfileCompanyList: () => void,
    removeUserPreference: () => void,
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
    canFollow: Boolean,
  };

  static defaultProps = {
  };

  state = {
    displayMore: false,
    contentLength: 350,
  };

  componentWillMount() {
    this.props.getUserProfilePreferences();
  }

  componentWillReceiveProps(nextProps) {
    const { userProfilePreferences, data } = nextProps;
    let analystArr = [];
    try {
      analystArr = userProfilePreferences.user_pref.analysts;
    } catch(e) { // eslint-disable-line
      analystArr = [];
    }
    const follow = analystArr.filter(analyst => analyst.id === data.person_id).length > 0;
    this.setState({ follow });
  }

  handleGTM = (data, triggerType, action) => {
    if (data) {
      const gtmData = {
        'BMO Analyst Name': data.display_name,
        'BMO Analyst Job Title': data.position,
        'Sector Name': data.sectors ? Object.keys(data.sectors).map((key) => key).join(';') : '',
      };
      let type = 'analystsEmailClick';
      if (triggerType === 'follow') {
        type = 'ouranalystFollowClick';
        gtmData['Follow Type'] = '';
        gtmData['Follow Details'] = '';
      }
      pushToDataLayer('ourdepartment', type, { action, label: data.display_name, data: gtmData });
    }
  }

  followAction = () => {
    const { data, setProfileCompanyList, removeUserPreference } = this.props;
    const { follow } = this.state;
    if (!data) return;
    if (follow) {
      removeUserPreference({ analysts: [data.person_id] });
      this.handleGTM(data, 'follow', 'Un Follow');
    } else {
      setProfileCompanyList({ analysts: [data.person_id] });
      this.handleGTM(data, 'follow', 'Follow');
    }
  }

  handleDownloadClick = async (data) => {
    downloadAnalystBioPDF(data.client_code).then(response => {
      if (response.ok) {
        return response.blob();
      }
      return null;
    }).then((result) => {
      if (!result) {
        return;
      }
      downloadBlobFile({
        content: result,
        contentType: data.mime_type,
        filename: data.file_name
      });
    }).catch(() => {
      console.log('Error while downloading PDF');// eslint-disable-line
    });
  }

  renderDownloadIcon = (data) => {
    return (
      <Button
        title={'Download'}
        tabIndex={0}
        onClick={() => this.handleDownloadClick(data)}
        className={'analyst-pdf linkBtn'}
      >
        <span className={'download-report'} />
        <span>Download Analyst Bio PDF</span>
      </Button>
    );
  }

  render() {
    const { data, canFollow } = this.props;
    const { follow, contentLength, displayMore } = this.state;
    const displayName = formatAnalystName(data.first_name, data.middle_name, data.last_name);
    const analystSearchText = "See Analyst's Research";
    return (
      <div className="analysts-detail-bio">
        <div className={'analyst-heading'}>{data.position ? `${displayName}, ${data.position}` : displayName}</div>
        <div className="back-link-holder">
          <NavLink className="back-link" to={`${window.unchainedSite && window.unchainedSite.sitename === 'Corp' ? '/our-analysts/' : '/our-department/our-analysts/'}`}>
            <span className="bmo_chevron left" />
            Back to All Analysts
          </NavLink>
        </div>
        <div className="analyst-profile-pic">
          <div className="analyst-image">
            <Image
              className="analyst-avatar"
              shape={'circular'}
              alt={data.first_name || 'Defalut image'}
              src={data.avatar_url || DEFAULT_PROFILE.img}
            />
          </div>
          <div className="analyst-name">
            <div className="analyst-role-section">
              <div className="displayTitle">{data.display_title || ''}</div>
              <div className={'legal-entity'}>{data.division_name || ''}</div>
            </div>
            <div className="email">
              <a href={`mailto:${data.email}`} className={'forgot-mail-icon'} onClick={() => this.handleGTM(data)} title={data.email}>{data.email || 'N/A'}</a>
              <a href={`tel:${data.phone}`} className={'forgot-phone-icon'} title={data.phone}>{data.phone || ''}</a>
              {
                canFollow ?
                  <Button
                    className={`follow-contact ${follow ? 'follow-contact selected' : 'follow-contact'}`}
                    onClick={() => this.followAction()}
                    title={follow ? st.unfollow : st.follow}
                  >
                    <span>{follow ? 'Unfollow' : 'Follow'}</span>
                  </Button>
                  : null
              }
            </div>
          </div>
        </div>
        <div className="only-desktop-bio bio">
          <RichText richText={data.bio} />
          <br />
          <NavLink
            className="link-buttons ui secondary button see-analyst-research-btn"
            to={`/library/?searchType=analyst&searchVal=${data.display_name}`}
          >
            {analystSearchText}
          </NavLink>
          {data.analyst_bio_pdf &&
            this.renderDownloadIcon(data)
          }
        </div>
        <div className="only-mobile-bio">
          {data.bio && data.bio.length < contentLength && (
            <div className="bio"><RichText richText={data.bio} /></div>
          )
          }
          {
            <div>
              {data.bio && data.bio.length > contentLength &&
                (displayMore ? (
                  <p
                    className="hero-banner-rich-text-content"
                  >
                    <div className="bio truncated">
                      <RichText richText={data.bio} />
                      <Button
                        className="hero-banner-show-button"
                        onClick={() => this.setState({ displayMore: false })}
                      >
                        (less)
                      </Button>
                    </div>
                  </p>
                ) : (
                  <p
                    className="hero-banner-rich-text-content"
                  >
                    <div className="bio truncated">
                      <RichText richText={`${truncate(data.bio, { length: contentLength })}`} />
                      <Button
                        className="hero-banner-show-button"
                        onClick={() => this.setState({ displayMore: true })}
                      >
                        (more)
                      </Button>
                    </div>
                  </p>
                )
                )
              }
            </div>
          }
          <NavLink
            className="link-buttons ui secondary button see-analyst-research-btn"
            to={`/library/?searchType=analyst&searchVal=${data.display_name}`}
          >
            {analystSearchText}
          </NavLink>
          {data.analyst_bio_pdf &&
            this.renderDownloadIcon(data)
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
});

const mapDispatchToProps = (dispatch) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalystsDetailBio);
