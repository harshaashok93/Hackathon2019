/* @flow weak */

/*
 * Component: DesktopCommentOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Button, Image, Container } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import { DEFAULT_PROFILE } from 'constants/assets';
import { connect } from 'react-redux';
import st from 'constants/strings';
import { toShowAnalyst } from 'utils';
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
import { RichText, CustomNavLink } from 'components';
import './DesktopCommentOverlay.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DesktopCommentOverlay extends Component {
  props: {
    data: {},
    previewData: {},
    analystSource: {},
    canAccessContent: Boolean,
    canFollow: Boolean,
    setProfileCompanyList: () => void,
    removeUserPreference: () => void,
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
  };

  componentWillMount() {
    //
  }

  handleGTM = (name, position) => {
    if (name && position) {
      const gtmData = {
        'BMO Analyst Name': name,
        'BMO Analyst Job Title': position,
        'Follow Type': '',
        'Follow Details': '',
      };
      pushToDataLayer('library', 'libraryFollowClick', { label: name, data: gtmData });
    }
  }

  followAction = (data, name, position) => {
    const { setProfileCompanyList, removeUserPreference } = this.props;
    const follow = this.isFollowed(data);
    if (!data) return;
    if (follow) {
      removeUserPreference({ analysts: [parseInt(data, 10)] });
    } else {
      setProfileCompanyList({ analysts: [parseInt(data, 10)] });
    }
    this.handleGTM(name, position);
  }

  isFollowed = (data) => {
    const { userProfilePreferences } = this.props;
    let analystArr = [];
    try {
      analystArr = userProfilePreferences.user_pref.analysts;
    } catch(e) { // eslint-disable-line
      analystArr = [];
    }
    const follow = analystArr.filter(analyst => analyst.id === parseInt(data, 10)).length > 0;
    return follow;
  }

  render() {
    const { data, previewData, analystSource, canAccessContent, canFollow } = this.props;
    let analystName = '';
    let analystAvatar = '';
    let analystPosition = '';
    let analystDisplayTitle = '';
    let analystDivisionName = '';
    let analystsEmail = '';
    let analystsPhone = '';
    let analystsPersonId = '';
    if (analystSource.length > 1) {
      const dataVal = analystSource[0];
      analystName = `${dataVal.first_name || ''} ${dataVal.middle_name || ''} ${dataVal.last_name || ''}`;
      analystAvatar = dataVal.avatar_url;
      analystPosition = (dataVal.position || '');
      analystDisplayTitle = (dataVal.display_title || '');
      analystDivisionName = (dataVal.division_name || '');
      analystsEmail = dataVal.email;
      analystsPhone = dataVal.phone;
      analystsPersonId = dataVal.person_id;
    } else {
      analystName = data.analysts_name;
      analystAvatar = data.analysts_avatar;
      analystPosition = data.position;
      analystDisplayTitle = data.analyst_display_title;
      analystDivisionName = data.analyst_division_name;
      analystsEmail = data.email;
      analystsPhone = data.phone;
      analystsPersonId = data.person_id;
    }
    const showAnalystInfo = (data.active === '1' || data.active === true) && toShowAnalyst(data) && canAccessContent && (!data.doNotSyncToRds);
    return (
      <div className="desktop-comment-overlay">
        <Button className="eye-close-button modal-close-icon bmo-close-btn bg-icon-props" aria-label="Close Modal" />
        <div className="analyst-details-left-section">
          <Container
            as={showAnalystInfo ? NavLink : 'div'}
            to={showAnalystInfo ? `${config.analystURLPrefix}/${data.analyst_code}/` : ''}
          >
            <Button className="analyst-profile-button"><Image className="analyst-profile-image" shape={'circular'} alt={analystName} src={analystAvatar || DEFAULT_PROFILE.img} /></Button>
          </Container>
          <div className={'analyst-and-ticker'}>
            <Container
              as={showAnalystInfo ? NavLink : 'div'}
              to={showAnalystInfo ? `${config.analystURLPrefix}/${data.analyst_code}/` : ''}
            >
              <Button className={`analyst-name linkBtn ${showAnalystInfo ? '' : 'cursor-auto'}`} content={analystPosition ? `${analystName}, ${analystPosition}` : analystName} />
            </Container>
            <div className="author-designation">{(analystDisplayTitle)}</div>
            <div className="author-designation-entity">{analystDivisionName}</div>
          </div>
          {
            showAnalystInfo ?
              <div className={`analyst-contact-div ${analystSource.length > 1 ? 'border-grey' : ''}`}>
                <a href={`mailto:${analystsEmail}`}><Button className={'forgot-mail-icon'} title={analystsEmail} /></a>
                <a href={`tel:${analystsPhone}`}><Button className={'forgot-phone-icon'} title={analystsPhone} /></a>
                {
                  canFollow ?
                    <Button
                      className={`${this.isFollowed(analystsPersonId) ? 'follow-contact selected' : 'follow-contact'}`}
                      onClick={() => this.followAction(analystsPersonId, analystName, analystPosition)}
                      title={this.isFollowed(analystsPersonId) ? st.unfollow : st.follow}
                    >
                      <span>{this.isFollowed(analystsPersonId) ? 'Unfollow' : 'Follow'}</span>
                    </Button>
                    : null
                }
              </div>
              : null
          }
          {/* {
            (showAnalystInfo && analystSource.length > 1) ?
              <div>
                <Heading as={'h4'} className={'team-member-heading'} content={'Other Team Members'} />
                {
                  analystSource.map((data) => {
                    if (data.sequence === '1') return null;
                    const showAnalystInfo = (data.active === '1' || data.active === true) && data.role === 'Analyst';
                    return (
                      <div className={'other-team-member'}>
                        <Container
                          as={showAnalystInfo ? NavLink : 'div'}
                          to={showAnalystInfo ? `${config.analystURLPrefix}/${data.client_code}/` : ''}
                        >
                          <Heading as={'h4'} className={'analyst-name'} content={data.position ? `${data.display_name}, ${data.position}` : data.display_name} />
                        </Container>
                      </div>
                    );
                  })
                }
              </div>
              :
              null
          } */}
        </div>
        <div className={'publication-right-section'}>
          <CustomNavLink
            className={'title linkBtn'}
            to={data.historicalPdf ? data.radarLink : `/research/${data.productID}/`}
            isHistoricalPublication={data.historicalPdf}
            radarLink={data.historicalPdf ? data.radarLink : ''}
            key={`${data.productID}-title`}
          >
            <Button className={'linkBtn component-overlay-pub-title'}>
              <RichText
                richText={data.title}
              />
            </Button>
          </CustomNavLink>
          <div className="comment-section">
            <div className="comment">
              <span className="comment-description"><RichText richText={previewData.description} /></span>
              { previewData.description ?
                (<CustomNavLink
                  className={'title linkBtn'}
                  to={data.historicalPdf ? data.radarLink : `/research/${data.productID}/`}
                  isHistoricalPublication={data.historicalPdf}
                  radarLink={data.historicalPdf ? data.radarLink : ''}
                  key={data.productID}
                >
                  <Button className={'linkBtn'} content={'... (more)'} />
                </CustomNavLink>
                )
                :
                null
              }
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DesktopCommentOverlay);
