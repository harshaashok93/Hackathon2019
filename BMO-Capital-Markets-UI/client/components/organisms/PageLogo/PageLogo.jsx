/* @flow weak */

/*
 * Component: PageLogo
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Heading, Container } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { appsettingsVariable } from 'constants/UnchainedVariable';

import {
  userSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './PageLogo.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class PageLogo extends Component {
  props: {
    pageTitle: '',
    image: '',
    backButtonText: '',
    to: {},
    showCoverageUniverse: '',
    pdfButtonText: '',
    isLoggedIn: bool,
    altText: ''
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { altText, image, pageTitle, backButtonText, to, showCoverageUniverse, pdfButtonText, isLoggedIn } = this.props;
    const pdfLink = appsettingsVariable.GLOBAL_COVERAGE_UNIVERSE_PDF_LINK || '';
    return (
      <Container className="page-logo">
        {
          image ?
            <div className="image">
              <Image className="logo-img" src={image} alt={altText} />
            </div>
            : null
        }
        <Heading className={image ? 'logo-text' : 'logo-text no-padding-left'}>{pageTitle}</Heading>
        {backButtonText && to.url ?
          <div className="back-link-holder">
            <NavLink className="back-link" to={to.url}>
              <span className="bmo_chevron left" />
              {backButtonText}
            </NavLink>
          </div>
          :
          null
        }
        {isLoggedIn && showCoverageUniverse && pdfLink ?
          <div className="coverage-universe-pdf-link">
            <a href={pdfLink} target="_blank" className={'ui button secondary'} title={pdfButtonText || 'Global Coverage Universe'}>{pdfButtonText || 'Global Coverage Universe'}</a>
          </div>
          :
          null
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = () => ({
  //
});

export default connect(mapStateToProps, mapDispatchToProps)(PageLogo);
