/* @flow weak */

/*
 * Component: ProfileLandingBottomComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Button } from 'unchained-ui-react';
import { connect } from 'react-redux';
import {
  userSelector,
} from 'store/selectors';
import {
  USER_AUTH_RESET_PASSWORD_TRIGGERED
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileLandingBottomComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileLandingBottomComponent extends Component {
  props: {
    buttonText: '',
    companyText: '',
    displayNameText: '',
    emailText: '',
    profile: {},
    userNameText: '',
    resetPwdTrigger: () => void,
  };

  state = {
  }

  openResetPwdPopup = () => {
    window.scrollTo(0, 0);
    this.props.resetPwdTrigger();
  }

  render() {
    const {
      profile,
      buttonText,
      displayNameText,
      userNameText,
      companyText,
      emailText,
    } = this.props;

    return (
      <div className="profile-landing-page">
        <div className="profile-landing-body">
          <div className="profile-bottom-component profile-bottom-container">
            <Grid>
              <Grid.Column computer={8} tablet={10} mobile={12} >
                <Grid>
                  <Grid.Column computer={5} tablet={6} mobile={12}>
                    <div className="item display-name">
                      <div className="header">{displayNameText}</div>
                      <div className="text">{profile.first_name} {profile.last_name}</div>
                    </div>
                    <div className="item username">
                      <div className="header">{userNameText}</div>
                      <div className="text">{profile.username ? profile.username.toLowerCase() : ''}</div>
                    </div>
                  </Grid.Column>
                  <Grid.Column computer={7} tablet={6} mobile={12}>
                    <div className="item email-text">
                      <div className="header">{emailText}</div>
                      <div className="text">{profile.email}</div>
                    </div>
                    <div className="item company-name">
                      <div className="header">{companyText}</div>
                      <div className="text">{profile.company}</div>
                    </div>
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid>
            <Button secondary content={buttonText} onClick={() => this.openResetPwdPopup()} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetPwdTrigger: () => dispatch({ type: USER_AUTH_RESET_PASSWORD_TRIGGERED })
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileLandingBottomComponent);
