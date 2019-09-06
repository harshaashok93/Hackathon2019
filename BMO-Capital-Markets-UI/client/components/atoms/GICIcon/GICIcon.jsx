/* @flow weak */

/*
 * Component: PageLogo
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Heading } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './GICIcon.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class GICIcon extends Component {
  props: {
    altText: '',
    image: '',
    text: '',
    to: '',
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleLinkClick = (text) => {
    if (window.location.pathname === '/') {
      pushToDataLayer('home', 'aboutBMOResearchLink', { label: text });
    } else if (window.location.pathname === '/our-department/') {
      pushToDataLayer('ourdepartment', 'featuredCoverageClick', { label: text });
    }
  }

  render() {
    const { altText, image, text, to } = this.props;
    // URL format
    // library/?searchVal=energy&searchType=industry
    let url = '';
    if (to.link_type === 'generic') {
      url = to.url;
    } else {
      url = `${to.url}?gics=${text}`;
    }
    return (
      <div className="gic-card-logo">
        {
          to.link_target !== 'newTab' ?
            <NavLink className="to-link" to={url || '/'} onClick={() => this.handleLinkClick(text)}>
              <div className="page-logo-link">
                <Image className="page-logo-img" src={image} alt={`${altText} logo`} title={`${altText} link`} />
              </div>
              <Heading className="logo-title">{text}</Heading>
            </NavLink>
            :
            <a className="to-link" target="_blank" href={to.url || '/'} onClick={() => this.handleLinkClick(text)}>
              <div className="page-logo-link">
                <Image className="page-logo-img" src={image} alt={`${altText} logo`} title={`${altText} link`} />
              </div>
              <Heading className="logo-title">{text}</Heading>
            </a>
        }
      </div>
    );
  }
}

export default GICIcon;
