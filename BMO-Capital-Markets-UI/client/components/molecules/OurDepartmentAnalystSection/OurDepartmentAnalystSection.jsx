/* @flow weak */

/*
 * Component: OurDepartmentAnalystSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { RichText } from 'components';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import st from 'constants/strings';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './OurDepartmentAnalystSection.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class OurDepartmentAnalystSection extends Component {
  props: {
    richText: '',
    to: {},
    buttonText: '',
    children: {},
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleNavClick = () => {
    pushToDataLayer('ourdepartment', 'viewAllAnalysts');
  }

  render() {
    const { richText, to, buttonText, children } = this.props;
    return (
      <div className="our-department-analyst-section">
        <RichText className={'about-bmo-info-text'} richText={richText} />
        {children}
        <div className="button-holder">
          <NavLink to={(to && to.url) || '/'} onClick={this.handleNavClick} id="intro-view-all-btn-our-dept" className="link-buttons ui secondary button" title={st.viewAll} >{buttonText}</NavLink>
        </div>
      </div>
    );
  }
}

export default OurDepartmentAnalystSection;
