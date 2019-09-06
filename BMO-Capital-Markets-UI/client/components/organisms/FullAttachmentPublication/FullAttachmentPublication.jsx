/* @flow weak */

/*
 * Component: FullAttachmentPublication
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Button, Heading, Container } from 'unchained-ui-react';
import { toShowAnalyst } from 'utils';
import { MainContent, RelatedContent } from 'containers/ResearchLayoutBuilder/components';
import { NavLink } from 'react-router-dom';
import { DEFAULT_PROFILE } from 'constants/assets';
import config from 'config';
import st from 'constants/strings';
import { connect } from 'react-redux';
import {
  userSelector,
} from 'store/selectors';
import {
  SET_USER_PROFILE_PREFERENCE,
  REMOVE_USER_PROFILE_PREFERENCES,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FullAttachmentPublication.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FullAttachmentPublication extends Component {
  props: {
    allInfo: {},
    rawData: {},
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
    type: '',
    updateSearchTerm: () => void,
    setFollowPreference: () => void,
    removeFollowPreference: () => void,
    canFollow: bool,
    isLoggedIn: bool,
  }

  static defaultProps = {
  };

  state = {
    // Initialize state here
  }

  componentDidMount() {
    // Component ready
  }

  followAction = (data) => {
    const { setFollowPreference, removeFollowPreference } = this.props;
    const follow = this.isFollowed(data);
    if (!data) return;
    if (follow) {
      removeFollowPreference({ analysts: [parseInt(data.personId, 10)] });
    } else {
      setFollowPreference({ analysts: [parseInt(data.personId, 10)] });
    }
  }

  isFollowed = (data) => {
    const { userProfilePreferences } = this.props;
    let analystArr = [];
    try {
      analystArr = userProfilePreferences.user_pref.analysts;
    } catch(e) { // eslint-disable-line
      analystArr = [];
    }
    const follow = analystArr.filter(analyst => analyst.id === parseInt(data.personId, 10)).length > 0;
    return follow;
  }

  renderTimezoneTitle = () => {
    const { allInfo, rawData } = this.props;
    return (
      <div className={'time-zone-date'}>
        <span>{allInfo.DisplayPublishDate}</span>
        <div className={'title'}>
          <Heading as={'h1'} content={rawData.name} />
        </div>
      </div>
    );
  }

  renderAnalystsDatails = (analyst, isLoggedIn) => {
    const { canFollow } = this.props;
    const analystData = {
      ...analyst,
      client_code: analyst.clientCode,
    };
    const isActive = (analyst.active === true && toShowAnalyst(analystData) && (!analyst.doNotSyncToRds));
    return (
      <div className={'author-details deskTop'}>
        <div className={'profile'}>
          <Image shape={'circular'} src={analyst.avatarUrl || DEFAULT_PROFILE.img} alt={'profile-image'} />
        </div>
        <div className={'author-details'}>
          <Container
            className="analystsLink"
            as={isActive ? NavLink : 'div'}
            to={(isActive && analyst.clientCode) ? `${config.analystURLPrefix}/${analyst.clientCode}` : ''}
          >
            <span className={'row'}>{analyst.position ? `${analyst.displayName}, ${analyst.position}` : analyst.displayName}</span>
          </Container>
          <span className={'row'}>{analyst.displayTitle || ''}</span>
          <span className={'row legal-entity'}>{analyst.divisionName || ''}</span>
          <div className={'preferences'}>
            <a href={`mailto:${analyst.email}`}><Button className={'forgot-mail-icon'} title={analyst.email} /></a>
            <a href={`tel:${analyst.phone}`}><Button className={'forgot-phone-icon'} title={analyst.phone} /></a>
            {isLoggedIn && canFollow &&
              <Button
                className={`${this.isFollowed(analyst) ? 'follow-contact selected' : 'follow-contact'}`}
                onClick={() => this.followAction(analyst)}
                title={this.isFollowed(analyst) ? st.unfollow : st.follow}
              >
                <span>{this.isFollowed(analyst) ? 'Unfollow' : 'Follow'}</span>
              </Button>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isLoggedIn, allInfo, type, updateSearchTerm } = this.props;
    const analystInfo = allInfo && allInfo.Analysts && allInfo.Analysts.data && allInfo.Analysts.data[0];
    return (
      <div className="full-attachment-publication">
        <div className={'top-section'}>
          {this.renderTimezoneTitle()}
          {this.renderAnalystsDatails(analystInfo, isLoggedIn)}
        </div>
        <MainContent
          data={allInfo.MainContent}
          updateSearchTerm={(val) => updateSearchTerm(val)}
          type={type}
          pid={allInfo.productId}
          isLoggedIn={true}
          productId={allInfo.productId}
        />
        <RelatedContent
          data={allInfo.RelatedContent || []}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
});

const mapDispatchToProps = (dispatch) => ({
  setFollowPreference: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d));
  },
  removeFollowPreference: (d) => {
    dispatch(REMOVE_USER_PROFILE_PREFERENCES(d));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FullAttachmentPublication);
