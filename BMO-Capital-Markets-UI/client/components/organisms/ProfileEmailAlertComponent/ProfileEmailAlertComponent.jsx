/* @flow weak */

/*
 * Component: ProfileEmailAlertComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Grid } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';
import { mapPropsToChildren } from 'utils/reactutils';
import { withRouter } from 'react-router-dom';

import {
  GET_PROFILE_COMPANY_LIST,
  SET_EMAIL_PROFILE_PREFERENCES,
  GET_USER_EMAIL_PREFERENCES
} from 'store/actions';

import {
  userSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileEmailAlertComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileEmailAlertComponent extends Component {
  props: {
    profile: {
      email: ''
    },
    getProfileCompanyList: () => void,
    profileCompanyList: {
      sector: [],
      coverage: [],
      analyst: []
    },
    userEmailPreferences: {
      data: {}
    },
    setEmailPreferences: () => void,
    getUserEmailPreferences: () => void,
    userPrefSubmitting: bool,
    children: {},
    history: {}
  };

  state = {
    industryList: [],
    companyList: [],
    analystList: [],
    preSelectedResults: {},
  }

  getUserEmailPrefSelecteResults = (userEmailPref) => {
    const preSelectedResults = {};
    const { Data } = userEmailPref;
    if (Data && Data.length) {
      const preference = Data[0].Preferences;
      Object.keys(preference).map(pref => {
        if (preference[pref] instanceof Array) {
          preSelectedResults[pref] = preference[pref].map(item => ({ id: (item.id || item.bm_id), title: item.name }));
        }
        return null;
      });
    }
    return preSelectedResults;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileCompanyList && (nextProps.profileCompanyList !== this.props.profileCompanyList)) {
      this.setAutosuggestList(nextProps);
    }
    if (nextProps.userEmailPreferences && nextProps.userEmailPreferences.data
      && (nextProps.userEmailPreferences !== this.props.userEmailPreferences)) {
      const userEmailPref = nextProps.userEmailPreferences.data;
      if (userEmailPref) {
        const preSelectedResults = this.getUserEmailPrefSelecteResults(userEmailPref);
        this.setState({ preSelectedResults });
      }
      const emailAlertSettingsConfig = this.getEmailConfig(nextProps);
      this.setState({ config: emailAlertSettingsConfig });
    }
    const { profile, history } = nextProps;
    if (profile && profile.rds_id === '') {
      history.push('/');
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
    const {
      profileCompanyList,
      getProfileCompanyList,
      getUserEmailPreferences,
      profile,
      history,
    } = this.props;

    if (profile && profile.rds_id === '') {
      history.push('/');
    }

    const emailAlertSettingsConfig = this.getEmailConfig(this.props);

    if (Object.keys(profileCompanyList).length === 0) {
      getProfileCompanyList();
    } else {
      this.setAutosuggestList();
    }

    this.setState({ config: emailAlertSettingsConfig });
    getUserEmailPreferences();
  }

  getEmailConfig(props = this.props) {
    let dataObj = {};
    const { userEmailPreferences } = props;

    if (userEmailPreferences && userEmailPreferences.data) {
      const userEmailPref = userEmailPreferences.data;
      if (userEmailPref) {
        const { Data } = userEmailPref;
        if (Data && Data.length) {
          const preference = Data[0].Preferences;
          dataObj = {
            ...preference.EmailAlert
          };
        }
      }
    }

    return dataObj;
  }

  itemCheck = (evt, obj, item) => {
    const { config } = this.state;
    switch (item.valueText) {
      case 'include_new_research':
        config.DebtResearch = obj.checked;
        break;
      case 'send_text':
        config.HtmlFormat = !obj.checked;
        break;
      case 'send_html':
        config.HtmlFormat = obj.checked;
        break;
      default: break;
    }
    this.setState({ config });
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
      pushToDataLayer('profile', 'emailPreferenceAddAlert', { label: `${key}:${data.title}` });
    } else if (data.type === 'delete') {
      preSelectedResults[key] = arr.filter(item => item.id !== data.id);
      pushToDataLayer('profile', 'emailPreferenceRemoveAlert', { label: `${key}:${data.title}` });
    }
    this.setState({ preSelectedResults });
  }
  clearAllPreselect = (type) => {
    const { preSelectedResults } = this.state;
    preSelectedResults[type].splice(0, preSelectedResults[type].length);
    this.setState({ preSelectedResults });
  }
  handleSubmit = () => {
    const { preSelectedResults, config } = this.state;
    const sectorPref = {};
    const { userEmailPreferences } = this.props;
    if (userEmailPreferences && userEmailPreferences.data) {
      const propsPreSelectedResults = this.getUserEmailPrefSelecteResults(userEmailPreferences.data);
      Object.keys(propsPreSelectedResults).map(item => {
        const preSelIds = preSelectedResults[item].map(ids => ids.id);
        const propsIds = propsPreSelectedResults[item].map(ids => ids.id);
        sectorPref[item] = [];
        preSelIds.map(id => {
          if (propsIds.indexOf(id) === -1) {
            sectorPref[item].push({
              RdsID: id,
              Action: 'A'
            });
          }
        });
        propsIds.map(id => {
          if (preSelIds.indexOf(id) === -1) {
            sectorPref[item].push({
              RdsID: id,
              Action: 'D'
            });
          }
        });
        return null;
      });
    } else if (preSelectedResults && Object.keys(preSelectedResults).length) {
      Object.keys(preSelectedResults).map(item => {
        const preSelIds = preSelectedResults[item].map(ids => ids.id);
        sectorPref[item] = [];
        preSelIds.map(id => {
          sectorPref[item].push({
            RdsID: id,
            Action: 'A'
          });
        });
      });
    }
    const finalConfiguration = {
      ...config,
      IncludePdf: false
    };
    const apiData = {
      Preferences: {
        ...sectorPref,
        EmailAlert: {
          ...finalConfiguration,
        }
      }
    };
    this.props.setEmailPreferences(apiData);
  }

  render() {
    const { industryList, analystList, companyList, preSelectedResults, config } = this.state;
    const { userPrefSubmitting, children, profile } = this.props;

    return (
      <div className="profile-landing-page">
        <div className="profile-landing-body">
          <div className="profile-email-alert-component profile-bottom-container">
            <Grid>
              {
                mapPropsToChildren(children, {
                  handleResultUpdate: (type, d) => this.handleResultUpdate(type, d),
                  clearAllPreselect: this.clearAllPreselect,
                  preSelectedResults: (preSelectedResults || {}),
                  profile,
                  options: {
                    Industries: industryList,
                    Companies: companyList,
                    Analysts: analystList
                  },
                  itemCheck: (e, obj, c, k) => this.itemCheck(e, obj, c, k),
                  checkboxConfig: config
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
  userEmailPreferences: userSelector.getUserEmailPreferences(state),
  userPrefSubmitting: userSelector.getUserPrefSubmittingStatus(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  getProfileCompanyList: () => {
    dispatch(GET_PROFILE_COMPANY_LIST());
  },
  setEmailPreferences: (d) => {
    dispatch(SET_EMAIL_PROFILE_PREFERENCES(d));
  },
  getUserEmailPreferences: () => {
    dispatch(GET_USER_EMAIL_PREFERENCES());
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileEmailAlertComponent));
