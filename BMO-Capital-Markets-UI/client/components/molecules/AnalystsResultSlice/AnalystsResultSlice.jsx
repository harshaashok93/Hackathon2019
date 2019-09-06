/* @flow weak */

/*
 * Component: AnalystsResultSlice
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Image, Button } from 'unchained-ui-react';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import { connect } from 'react-redux';
import st from 'constants/strings';
import {
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { AnalystsListingOverlay } from 'components';
import './AnalystsResultSlice.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsResultSlice extends Component {
  props: {
    data: {},
    isLoggedIn: Boolean,
    analystFollow: Boolean,
    canFollow: Boolean,
    setProfileCompanyList: () => void,
    removeUserPreference: () => void,
    allAnalystId: [],
    sectorSort: '',
    index: number,
    profile: {}
  };

  static defaultProps = {
  };

  state = {
    isOpen: false,
    allAnalystId: [],
    analystFollow: false,
    sectorData: [],
    sectorCounter: 0,
    sectorDisplayCount: 3,
  };

  componentWillReceiveProps(nextProps) {
    const { allAnalystId, analystFollow } = nextProps;
    this.setState({ allAnalystId, analystFollow });
  }

  componentWillMount() {
    const { allAnalystId, analystFollow } = this.props;
    this.setState({ allAnalystId, analystFollow });
  }

  opModal = () => {
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    this.setState({ isOpen: false });
  }

  handleGTM = (data, triggerType, action) => {
    if (data) {
      const gtmData = {
        'BMO Analyst Name': data.display_name,
        'BMO Analyst Job Title': data.position,
        'Sector Name': data.sectors ? data.sectors.map(sec => sec).join(';') : '',
      };
      let type = 'ouranalystClick';
      if (triggerType === 'follow') {
        type = 'ouranalystFollowClick';
        gtmData['Follow Type'] = '';
        gtmData['Follow Details'] = '';
      }
      pushToDataLayer('ourdepartment', type, { action, label: data.display_name, data: gtmData });
    }
  }

  followAction = () => {
    const { data, setProfileCompanyList, analystFollow, removeUserPreference } = this.props;
    if (!data) return;
    if (analystFollow) {
      removeUserPreference({ analysts: [data.person_id] });
      this.handleGTM(data, 'follow', 'Un Follow');
    } else {
      setProfileCompanyList({ analysts: [data.person_id] });
      this.handleGTM(data, 'follow', 'Follow');
    }
  }

  getSectorLink = (sector) => {
    if (sector) {
      return (
        <NavLink
          to={`/library/?searchType=industry&searchVal=${encodeURIComponent(sector)}`}
        >
          {sector}
        </NavLink>
      );
    }
    return sector;
  }

  incrementSectorCount = () => {
    const { sectorDisplayCount } = this.state;
    this.setState({ sectorDisplayCount: sectorDisplayCount + 4 });
  }

  render() {
    const { data, isLoggedIn, canFollow, sectorSort, index, profile } = this.props;
    const { analystFollow } = this.state;
    let sectorArray = Object.assign([], data.sectors);
    sectorArray = sectorSort === 'desc' ? sectorArray.sort().reverse() : sectorArray.sort();
    const displayName = `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`;
    if (!data.is_active) return null;
    return (
      <div className="analysts-result-slice">
        <div className="analysts-name-and-logo">
          <NavLink to={`${config.analystURLPrefix}/${data.client_code}/`} onClick={() => this.handleGTM(data)} className="analyst result-slice-cell hide-on-tab">
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
                <div className={`analyst-name-section ${profile.pages && profile.pages.has_visited_our_analysts_page ? '' : 'intro-part'}`} id={index === 0 ? 'intro-our-analyst-name-id' : ''}>
                  {displayName || 'N/A'}{data.position ? `, ${data.position}` : ''}
                </div>
                <div className="analyst-display-title">
                  {data.display_title || ''}
                </div>
                <div className="analyst-division_name">
                  {data.division_name || ''}
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="email result-slice-cell">
          <a href={`mailto:${data.email}`} className={'forgot-mail-icon'} title={data.email} >{data.email || 'N/A'}</a>
          <a href={`tel:${data.phone}`} className={'forgot-phone-icon'} title={data.phone}>{data.phone || 'N/A'}</a>
        </div>
        <div className="sector result-slice-cell hide-on-tab">
          <ul className={'firstList'}>
            {sectorArray.map((sector) => {
              return (<li><div className={'dot'}>{' • '}</div>{ sector }</li>);
            })
            }
          </ul>
          {
            /*
              TODO: if `Show more` option required please comment this code

              data.sectors.length > sectorArray.length ?
              <Button className={'plusMore'} onClick={() => this.incrementSectorCount()} content={'Show more'} />
              :
              null
            */
          }
        </div>
        {isLoggedIn && canFollow && <Button className={`result-slice-cell hide-on-tab ${analystFollow ? 'follow-contact selected' : 'follow-contact'}`} onClick={this.followAction} title={analystFollow ? st.unfollow : st.follow} />}
        <div className="right only-tab">
          <Button tabIndex={0} className={'linkBtn eye-inactive'} onClick={() => this.opModal()} />
        </div>
        <AnalystsListingOverlay
          handleGTM={this.handleGTM}
          isLoggedIn={isLoggedIn}
          isOpen={this.state.isOpen}
          data={data}
          closeModal={() => this.closeModal()}
          followAction={this.followAction}
          canFollow={canFollow}
          analystFollow={analystFollow}
        />
      </div>
    );
  }
}

const mapStateToProps = () => ({
  //
});

const mapDispatchToProps = (dispatch) => ({
  setProfileCompanyList: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeUserPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalystsResultSlice);
