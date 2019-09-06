/* @flow weak */

/*
 * Component: RetailConsumerTeamCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Container, Image, Button, Heading, List } from 'unchained-ui-react';
import { DEFAULT_PROFILE } from 'constants/assets';
import { pushToDataLayer } from 'analytics';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import st from 'constants/strings';
import { toShowAnalyst, formatAnalystName } from 'utils';

import {
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
} from 'store/actions';
import {
  userSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './RetailConsumerTeamCard.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class RetailConsumerTeamCard extends Component {
  props: {
    data: {},
    gtmData: {},
    canAccessContent: Boolean,
    canFollow: Boolean,
    team: Boolean,
    setProfileCompanyList: () => void,
    removeUserPreference: () => void,
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
  };

  handleAuthorClick = (name) => () => {
    const page = window.location.pathname;
    if (page === '/strategy/strategy-landing/') {
      pushToDataLayer('library', 'analystPicClick', { category: 'Strategy', label: name, data: this.props.gtmData });
    } else {
      pushToDataLayer('library', 'analystPicClick', { label: name, data: this.props.gtmData });
    }
  }

  handleGTM = (data) => {
    if (data) {
      const gtmData = {
        'BMO Analyst Name': data.display_name,
        'BMO Analyst Job Title': data.position,
        'Follow Type': '',
        'Follow Details': '',
      };
      pushToDataLayer('library', 'libraryFollowClick', { label: data.display_name, data: gtmData });
    }
  }

  followAction = (data) => {
    const { setProfileCompanyList, removeUserPreference } = this.props;
    const follow = this.isFollowed(data);
    if (!data) return;
    if (follow) {
      removeUserPreference({ analysts: [parseInt(data.person_id, 10)] });
    } else {
      setProfileCompanyList({ analysts: [parseInt(data.person_id, 10)] });
    }
    this.handleGTM(data);
  }

  isFollowed = (data) => {
    const { userProfilePreferences } = this.props;
    let analystArr = [];
    try {
      analystArr = userProfilePreferences.user_pref.analysts;
    } catch(e) { // eslint-disable-line
      analystArr = [];
    }
    const follow = analystArr.filter(analyst => analyst.id === parseInt(data.person_id, 10)).length > 0;
    return follow;
  }

  render() {
    const { data, canAccessContent, team, canFollow } = this.props;
    let analystCount = data.length;
    data.map((analyst) => {
      if (!toShowAnalyst(analyst)) {
        analystCount -= 1;
      }
    });
    const showMoreData = analystCount < 4;
    return (
      <div className={`retail-consumer-team-card ${analystCount > 8 ? 'scroll-div' : ''}`}>
        {team && <Heading as={'h2'} className={'card-title'} content={'Consumer Team'} /> }
        <List className={`analyst-holder ${team ? 'team-holder' : 'individual-holder'}`}>
          {
            data.map(analyst => {
              if (!toShowAnalyst(analyst)) return null;
              const showAnalystInfo = (analyst.active === '1' || analyst.active === true) && toShowAnalyst(analyst) && canAccessContent;
              const displayName = formatAnalystName(analyst.first_name, analyst.middle_name, analyst.last_name);
              return (
                <List.Item className={`analyst-row ${showMoreData}`} key={Math.random()}>
                  <div className="analyst-info-section">
                    <div className="padBot">
                      {team && <Image src={analyst.avatar_url || DEFAULT_PROFILE.img} alt={analyst.display_name} shape={'circular'} className={'analyst-profile-image'} />}
                      <div className={`${team ? 'analyst-and-ticker' : 'individual-analyst-and-ticker'}`}>
                        <Container
                          className={`name-and-pos ${showAnalystInfo ? '' : 'no-link'}`}
                          as={showAnalystInfo ? NavLink : 'div'}
                          to={(showAnalystInfo) ? `${config.analystURLPrefix}/${analyst.client_code}` : ''}
                        >
                          <Heading as={'h4'} className={'analyst-name'} onClick={showAnalystInfo ? this.handleAuthorClick(analyst.display_name) : ''} content={analyst.position ? `${displayName}, ${analyst.position}` : displayName} />
                        </Container>
                        {showMoreData && <div className="author-designation">{analyst.display_title}</div>}
                        {showMoreData && <div className="author-designation-entity">{analyst.division_name}</div>}
                      </div>
                    </div>
                    {
                      showAnalystInfo && showMoreData ?
                        <div className={`${team ? 'analyst-contact-div' : 'individual-analyst-contact-div'}`}>
                          <a href={`mailto:${analyst.email}`}><Button className={'forgot-mail-icon'}title={analyst.email} /></a>
                          <a href={`tel:${analyst.phone}`}><Button className={'forgot-phone-icon'} title={analyst.phone} /></a>
                          {
                            canFollow ?
                              <Button
                                className={`${this.isFollowed(analyst) ? 'follow-contact selected' : 'follow-contact'}`}
                                onClick={() => this.followAction(analyst)}
                                title={this.isFollowed(analyst) ? st.unfollow : st.follow}
                              >
                                <span>{this.isFollowed(analyst) ? 'Unfollow' : 'Follow'}</span>
                              </Button>
                              : null
                          }
                        </div>
                        : null
                    }
                  </div>
                  { showAnalystInfo ? (
                    <Container
                      className="analyst-profile-go-icon circle-link"
                      title="Analyst Bio"
                      as={showAnalystInfo ? NavLink : 'div'}
                      to={(showAnalystInfo) ? `${config.analystURLPrefix}/${analyst.client_code}` : ''}
                    />) : null }
                  <br className="clearBoth" />
                </List.Item>
              );
            })
          }
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
});

const mapDispatchToProps = (dispatch) => ({
  setProfileCompanyList: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeUserPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RetailConsumerTeamCard);
