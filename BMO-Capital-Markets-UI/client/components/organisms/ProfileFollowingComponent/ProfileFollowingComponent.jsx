/* @flow weak */

/*
 * Component: ProfileFollowingComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Button } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';
import { mapPropsToChildren } from 'utils/reactutils';
import {
  GET_PROFILE_COMPANY_LIST,
  SET_USER_PROFILE_PREFERENCE,
  GET_USER_PROFILE_PREFERENCES,
  SHOW_ONBOARD_SCREEN,
  SET_ONBOARDING_SCREEN_INDEX
} from 'store/actions';


import {
  userSelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileFollowingComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileFollowingComponent extends Component {
  props: {
    getProfileCompanyList: () => void,
    profileCompanyList: {
      sector: [],
      coverage: [],
      analyst: []
    },
    setProfileCompanyList: () => void,
    getUserProfilePreferences: () => void,
    userProfilePreferences: {
      user_pref: {}
    },
    showOnboardingScreen: () => void,
    userPrefSubmitting: bool,
    children: {},
    buttonText: '',
  };

  state = {
    industryList: [],
    companyList: [],
    analystList: [],
    preSelectedResults: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileCompanyList && (nextProps.profileCompanyList !== this.props.profileCompanyList)) {
      this.setAutosuggestList(nextProps);
    }
    const userPref = nextProps.userProfilePreferences.user_pref;
    if (userPref && (userPref !== this.props.userProfilePreferences.user_pref)) {
      const preSelectedResults = {};
      Object.keys(userPref).map(pref => {
        preSelectedResults[pref] = userPref[pref].map(item => ({ id: item.id, title: item.name }));
        return null;
      });
      this.setState({ preSelectedResults });
    }
  }

  setAutosuggestList(props = this.props) {
    let industryList = [];
    let companyList = [];
    let analystList = [];
    if (props.profileCompanyList.sector) {
      industryList = props.profileCompanyList.sector.map((sector, i) => ({ text: sector.text, value: sector.value, key: `${i}` }));
    }
    if (props.profileCompanyList.coverage) {
      companyList = props.profileCompanyList.coverage.map((coverage, i) => ({ text: coverage.text, value: coverage.value, key: `${i}` }));
    }
    if (props.profileCompanyList.analyst) {
      analystList = props.profileCompanyList.analyst.map((analyst, i) => ({ text: analyst.text, value: analyst.value, key: `${i}` }));
    }
    this.setState({ industryList, companyList, analystList });
  }

  componentWillMount() {
    const { profileCompanyList, getProfileCompanyList, getUserProfilePreferences } = this.props;
    if (Object.keys(profileCompanyList).length === 0) {
      getProfileCompanyList();
    } else {
      this.setAutosuggestList();
    }
    getUserProfilePreferences();
  }

  handleResultUpdate(key, data) {
    if (!data) return;

    const { preSelectedResults } = this.state;
    const arr = preSelectedResults[key];

    if (data.type === 'update') {
      const obj = {
        id: data.id,
        title: data.title
      };
      if (arr) {
        preSelectedResults[key].push(obj);
      } else {
        preSelectedResults[key] = [obj];
      }
      pushToDataLayer('profile', 'followingAddAlert', { label: `${key}:${data.title}` });
    } else if (data.type === 'delete') {
      preSelectedResults[key] = arr.filter(item => item.id !== data.id);
      pushToDataLayer('profile', 'followingRemoveAlert', { label: `${key}:${data.title}` });
    }
    this.setState({ preSelectedResults });
  }

  handleViewContentGuide = () => {
    this.props.showOnboardingScreen();
    pushToDataLayer('profile', 'viewContentGuide');
  }

  handleSubmit = () => {
    const { preSelectedResults } = this.state;
    const apiData = {};
    Object.keys(preSelectedResults).map(item => {
      apiData[item] = preSelectedResults[item].map(ids => ids.id);
      return null;
    });
    this.props.setProfileCompanyList(apiData);
  }

  clearAllPreselect = (type) => {
    const { preSelectedResults } = this.state;
    preSelectedResults[type].splice(0, preSelectedResults[type].length);
    this.setState({ preSelectedResults });
  }

  render() {
    const { industryList, analystList, companyList, preSelectedResults } = this.state;
    const { userPrefSubmitting, children, buttonText } = this.props;

    return (
      <div className="profile-landing-page">
        <div className="profile-landing-body">
          <div className="profile-following-component profile-bottom-container">
            <Grid className="commonGrid">
              <Grid.Column computer={8} tablet={6} mobile={12} className={'following-content-text'}>
                <div className={'text'}>Looking for an easy way to manage the content you follow? </div>
              </Grid.Column>
              <Grid.Column className="contentGuide" computer={4} tablet={6} mobile={12}>
                <Button secondary content={buttonText} onClick={this.handleViewContentGuide} />
              </Grid.Column>
            </Grid>
            <Grid>
              {
                mapPropsToChildren(children, {
                  handleResultUpdate: (type, d) => this.handleResultUpdate(type, d),
                  preSelectedResults: (preSelectedResults || {}),
                  clearAllPreselect: this.clearAllPreselect,
                  options: {
                    sub_sectors: industryList,
                    coverages: companyList,
                    analysts: analystList
                  }
                })
              }
            </Grid>
            <div className="submitButtonContainer">
              <Button secondary onClick={this.handleSubmit}>
                {userPrefSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profileCompanyList: userSelector.getProfileCompanyList(state),
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
  userPrefSubmitting: userSelector.getUserPrefSubmittingStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  getProfileCompanyList: () => {
    dispatch(GET_PROFILE_COMPANY_LIST());
  },
  setProfileCompanyList: (d) => {
    dispatch(SET_USER_PROFILE_PREFERENCE(d, 'put'));
  },
  getUserProfilePreferences: () => {
    dispatch(GET_USER_PROFILE_PREFERENCES());
  },
  showOnboardingScreen: () => {
    dispatch({ type: SHOW_ONBOARD_SCREEN, data: true });
    dispatch({ type: SET_ONBOARDING_SCREEN_INDEX, data: 0 });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFollowingComponent);
