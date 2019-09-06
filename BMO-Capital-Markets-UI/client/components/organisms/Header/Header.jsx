/* @flow weak */

/*
 * Component: Header
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Container } from 'unchained-ui-react';
import { AuthModalContainer, OnboardingContainer } from 'containers';
import { connect } from 'react-redux';
import {
  userSelector,
} from 'store/selectors';

import {
  GET_BOOKMARKS_DATA
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './Header.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Header extends Component {
  props: {
    children: {},
    showOnboardScreen: Boolean,
    triggerBookmarkApi: Boolean,
    getBookmarkInformation: () => void,
  };

  state = {
  };

  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    if (this.props.triggerBookmarkApi) {
      this.props.getBookmarkInformation();
    }
  }
  render() {
    const {
      children,
    } = this.props;

    return (
      <Container className="header-container" id={'mainPageHeader'} >
        {this.props.showOnboardScreen && <OnboardingContainer />}
        <AuthModalContainer />
        {children}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  showOnboardScreen: userSelector.getOnboardScreenStatus(state),
  triggerBookmarkApi: userSelector.getTriggerBookmarkApi(state),
});

const mapDispatchToProps = (dispatch) => ({
  getBookmarkInformation: () => {
    dispatch(GET_BOOKMARKS_DATA());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
