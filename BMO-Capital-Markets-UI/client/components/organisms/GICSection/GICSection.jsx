/* @flow weak */

/*
 * Component: BmoResearch
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { pushToDataLayer } from 'analytics';
import { NavLink } from 'react-router-dom';
import st from 'constants/strings';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { RichText } from 'components';
import './GICSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class GICSection extends Component {
  props: {
    children: {},
    richText: '',
    buttonText: '',
    to: {}
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }
  handleNavClick = () => {
    pushToDataLayer('ourdepartment', 'viewAllCoverage');
  }
  render() {
    const { children, richText, buttonText, to } = this.props;
    return (
      <div className={`bmo-research ${buttonText ? 'ourdept' : ''}`}>
        <RichText richText={richText} />
        <div className="gic-cards-wrapper">
          {children}
          {
            buttonText ?
              <div className="button-holder">
                <NavLink to={(to && to.url) || '/'} id="intro-see-all-btn-our-dept" onClick={this.handleNavClick} className="link-buttons ui secondary button" title={st.showMore} >{buttonText}</NavLink>
              </div>
              : null
          }
        </div>
      </div>
    );
  }
}

export default GICSection;
