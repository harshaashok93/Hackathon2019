import React, { Component } from 'react';
import config from 'config';
import { Grid, Image, Container, Button } from 'unchained-ui-react';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { RichText } from 'components';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import st from 'constants/strings';
import { toShowAnalystOnPublication, formatAnalystName } from 'utils';
import { pushToDataLayer } from 'analytics';

import {
  userSelector,
} from 'store/selectors';

import {
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
  GET_USER_PROFILE_PREFERENCES,
} from 'store/actions';

import SearchFormatter from './SearchFormatter';

class Analysts extends Component {
  props: {
    setProfilePreference: () => void,
    removeUserPreference: () => void,
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
    data: {},
    getUserProfilePreferences: () => void,
    isAuthenticated: boolean,
    profile: {},
    isAccordionComponent: boolean,
    isOpen: boolean,
    handleAccordionClick: () => void
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated && this.props.isAuthenticated === false) {
      this.props.getUserProfilePreferences();
    }
  }

  componentWillMount() {
    const { isAuthenticated, getUserProfilePreferences } = this.props; // eslint-disable-line
    if (isAuthenticated) {
      this.props.getUserProfilePreferences();
    }
  }

  followAction = (analystId, analystsName) => {
    const { setProfilePreference, removeUserPreference } = this.props;
    const follow = this.isFollowed(analystId);
    if (!analystId) return;
    if (follow) {
      removeUserPreference({ analysts: [parseInt(analystId, 10)] });
    } else {
      setProfilePreference({ analysts: [parseInt(analystId, 10)] });
    }
    pushToDataLayer('report', 'reportFollow', { label: `analyst:${analystsName}` });
  }

  isFollowed = (analystId) => {
    const { userProfilePreferences } = this.props;
    let arr = [];
    try {
      arr = userProfilePreferences.user_pref.analysts;
    } catch(e) { // eslint-disable-line
      arr = [];
    }
    return arr.filter(item => item.id === parseInt(analystId, 10)).length > 0;
  }

  handleEmailClick = (name) => {
    pushToDataLayer('report', 'reportEvents', { action: 'Analyst Email', label: name });
  }

  handleAnalystClick = (name) => {
    pushToDataLayer('report', 'reportEvents', { action: 'Analyst', label: name });
  }

  render() {
    const { data, isAuthenticated, profile } = this.props;
    const { isAccordionComponent, isOpen, handleAccordionClick } = this.props;

    if (!data || !data.data) return null;

    const analystList = [];
    const otherTeamMemberList = [];
    const canFollow = profile && profile.can_access_content && profile.can_follow_content;

    data.data && data.data.map((analyst) => {
      const analystData = {
        ...analyst,
        client_code: analyst.clientCode,
      };
      const isActive = (analyst.active === true && toShowAnalystOnPublication(analystData));
      if (isActive) {
        analystList.push(analyst);
      } else {
        otherTeamMemberList.push(analyst);
      }
    });

    const legalEntity = [];

    if (otherTeamMemberList && otherTeamMemberList.length) {
      let i = 1;
      otherTeamMemberList.map((otherAnalyst) => {
        const legalEntityCopy = Object.assign([], legalEntity);
        if (!legalEntity.length) {
          legalEntity.push(`<p>${otherAnalyst.divisionName}</p>`);
        } else {
          const divisionExists = legalEntityCopy.filter(division => division.indexOf(otherAnalyst.divisionName) > -1);
          if (divisionExists.length === 0) {
            const star = '*'.repeat(i);
            i += 1;
            legalEntity.push(`<p>${star}${otherAnalyst.divisionName}</p>`);
          }
        }
      });
    }

    const legalEntityIdentity = {
      3: '',
      4: '*',
      5: '**'
    };

    const removeLine = (analystList.length === 1) && (otherTeamMemberList.length === 0);

    return (
      <div className="analysts-card">
        {
          analystList.map((analysts, idx) => {
            const follow = this.isFollowed(analysts.personId);
            const analystName = formatAnalystName(analysts.firstName, analysts.middleName, analysts.lastName);
            return (
              <Grid
                className={`
                  ${removeLine ? 'analysts-detail-grid remove-line' : 'analysts-detail-grid'}
                  ${idx === analystList.length - 1 && otherTeamMemberList.length === 0 ? 'analysts-detail-grid-remove-border' : ''}
                `}
              >
                <Grid.Column computer={3} className="image-holder">
                  <Container
                    onClick={() => this.handleAnalystClick(analystName)}
                    as={NavLink}
                    to={(analysts.clientCode) ? `${config.analystURLPrefix}/${analysts.clientCode}` : ''}
                  >
                    <Image shape={'circular'} src={analysts.avatarUrl || DEFAULT_PROFILE.img} />
                  </Container>
                </Grid.Column>
                <Grid.Column computer={9} className="analysts-detail-grid-right-section">
                  <div className={'firstItem'}>
                    <Container
                      onClick={() => this.handleAnalystClick(analystName)}
                      className="analystsLink"
                      as={NavLink}
                      to={(analysts.clientCode) ? `${config.analystURLPrefix}/${analysts.clientCode}` : ''}
                    >
                      <span className="name">
                        {SearchFormatter(analystName)}
                        {analysts.position ? `, ${SearchFormatter(analysts.position)}` : null}
                      </span>
                    </Container>
                    {analysts.displayTitle ? <div>{SearchFormatter(analysts.displayTitle)}</div> : null}
                    {analysts.divisionName ? <div className={'legal-entity'}>{SearchFormatter(analysts.divisionName)}</div> : null}
                  </div>
                  { (!isAccordionComponent || (isAccordionComponent && isOpen)) ?
                    (isAuthenticated) &&
                      <div className="icon-holder">
                        <a
                          href={`mailto:${analysts.email}`}
                          className={'forgot-mail-icon icon'}
                          title={analysts.email}
                          onClick={() => this.handleEmailClick(analystName)}
                        >
                          &nbsp;
                        </a>
                        <a href={`tel:${analysts.phone}`} className={'forgot-phone-icon icon'} title={analysts.phone}>&nbsp;</a>
                        {
                          canFollow ?
                            <Button
                              className={`follow-contact ${follow ? 'follow-contact selected' : 'follow-contact'}`}
                              onClick={() => this.followAction(analysts.personId, analystName)}
                              title={follow ? st.unfollow : st.follow}
                            >
                              <span>{follow ? 'Unfollow' : 'Follow'}</span>
                            </Button>
                            : null
                        }
                      </div>
                    : null
                  }
                </Grid.Column>
              </Grid>
            );
          })
        }
        {(!isAccordionComponent || (isAccordionComponent && isOpen)) ?
          otherTeamMemberList.length >= 1 &&
            <div className="other-team-members">
              <div className="title">Other Team Members</div>
              {
                otherTeamMemberList.map((otherAnalyst) => {
                  let identityMark = '';
                  const analystName = formatAnalystName(otherAnalyst.firstName, otherAnalyst.middleName, otherAnalyst.lastName);
                  legalEntity.map((item) => {
                    if (item.indexOf(otherAnalyst.divisionName) > -1) {
                      identityMark = legalEntityIdentity[item.indexOf(otherAnalyst.divisionName)];
                    }
                  });
                  return (
                    <Container
                      className="cat"
                      as={'div'}
                      key={Math.random()}
                    >
                      <span className={'name'}>
                        {SearchFormatter(analystName)}
                        {otherAnalyst.position ? `, ${SearchFormatter(otherAnalyst.position)}` : null}
                        {identityMark}
                      </span>
                    </Container>
                  );
                })
              }
            </div>
          : null
        }
        {((!isAccordionComponent || (isAccordionComponent && isOpen)) && (legalEntity.length && otherTeamMemberList.length >= 1)) ?
          <div className={'legal-entities'}>
            <RichText className="legalEntity" richText={SearchFormatter(`Legal Entity: <br />${legalEntity.join('').replace(/<\/p>/g, '</p></br>')}`, { richText: false })} />
          </div>
          : null
        }
        {isAccordionComponent && <Button className={`linkBtn ${isOpen ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={() => handleAccordionClick('Analysts')} /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: userSelector.getIsLoggedIn(state),
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfilePreferences: () => {
    dispatch(GET_USER_PROFILE_PREFERENCES());
  },
  setProfilePreference: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeUserPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Analysts);
