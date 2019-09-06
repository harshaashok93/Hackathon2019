/* @flow weak */

/*
 * Component: FooterLink
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import { Container, Button, Heading } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { BmoPopUp } from 'components';
import {
  userSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FooterLink.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FooterLink extends Component {
  props: {
    to: '',
    text: '',
    forLoggedInUserField: bool,
    isLoggedIn: bool,
    forRDSUserField: bool,
    profile: {}
  };

  static defaultProps = {
    // ...
  };

  state = {
    forceHide: false
  };

  handleNavClick = (label) => {
    pushToDataLayer('common', 'footerLinks', { label });
  }
  handleCloseDiv = () => {
    this.setState({ forceHide: true });
  }
  clickFunction = () => {
    this.setState({ forceHide: false });
  }
  render() {
    const { to, text, forLoggedInUserField, isLoggedIn, forRDSUserField, profile } = this.props;
    if (to.url) {
      if ((forLoggedInUserField && !isLoggedIn) || (forRDSUserField && profile.rds_id === '')) {
        return (
          <div className="footer-links-set">
            <a className="footer-link">
              {text}
              <BmoPopUp
                showOnClick={true}
                clickFunction={this.clickFunction}
                forceHide={this.state.forceHide}
                minHeight={120}
                minWidth={200}
                hideOnScroll={false}
                hideController="click"
              >
                <div className="auth-modal-not-logged">
                  <div className="close-button-bar">
                    <Button
                      tabIndex={0}
                      className="not-logged-modal-close-footer bmo-close-btn bg-icon-props"
                      onClick={this.handleCloseDiv}
                      aria-label="Close Modal"
                    />
                  </div>
                  <Container className="form-container">
                    <Container className="not-logged-div">
                      <Heading as={'h1'}>
                        This feature accessible to logged in or registered clients only.
                      </Heading>
                    </Container>
                  </Container>
                </div>
              </BmoPopUp>
            </a>
          </div>
        );
      } else if (to.link_target !== 'newTab') {
        return (
          <div className="footer-links-set">
            <NavLink to={to.url} onClick={() => this.handleNavClick(text)} className="footer-link">
              {text}
            </NavLink>
          </div>
        );
      }
      return (
        <div className="footer-links-set">
          <a href={to.url} target="_blank" onClick={() => this.handleNavClick(text)} className="footer-link">
            {text}
          </a>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  profile: userSelector.getUserProfileInfo(state),
});

export default connect(mapStateToProps)(FooterLink);
