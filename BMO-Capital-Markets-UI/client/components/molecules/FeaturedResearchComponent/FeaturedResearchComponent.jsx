/* @flow weak */

/*
 * Component: FeaturedResearchComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, List, Segment } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { RichText } from 'components';
import './FeaturedResearchComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FeaturedResearchComponent extends Component {
  props: {
    altText: '',
    image: '',
    sectionDescription: '',
    sectionTitle: '',
    to: '',
    navLinkAltText: '',
    navImage: '',
  };

  state = {
  };

  componentDidMount() {
  }

  handleLinkClick = (sectionTitle) => {
    pushToDataLayer('home', 'researchOptionsLink', { label: sectionTitle });
  }
  getFormattedText = (text) => {
    if (!text) return text;
    const splitArr = text.split(' ');
    if (splitArr.length === 2) {
      return (
        <span>
          {splitArr[0]}<br />
          {splitArr[1]}
        </span>
      );
    }
    return text;
  }

  render() {
    const { altText, image, sectionDescription, sectionTitle, to, navImage, navLinkAltText } = this.props;
    const markup = (
      <Segment textAlign="center" basic>
        <List className="list-wrap">
          <List.Item className="title section-title"><span>{this.getFormattedText(sectionTitle)}</span></List.Item>
          <List.Item className="component-image-holder">
            <Image className="component-image" height={72} src={image} alt={altText} title={altText} />
          </List.Item>
          <List.Item className="description"><RichText richText={sectionDescription} /></List.Item>
          <Image className="link-imag" width={42} src={navImage} alt={`${navLinkAltText} to ${sectionTitle}`} title={`${navLinkAltText} to ${sectionTitle}`} />
        </List>
      </Segment>
    );
    return (
      <Segment.Group horizontal className="featured-research-component">
        {
          to.url !== 'newTab' ?
            <NavLink className="to-link" onClick={() => this.handleLinkClick(sectionTitle)} to={to.url || '/'}>
              {markup}
            </NavLink>
            :
            <a className="to-link" onClick={() => this.handleLinkClick(sectionTitle)} href={to.url || '/'} target="_blank">
              {markup}
            </a>
        }
      </Segment.Group>
    );
  }
}

export default FeaturedResearchComponent;
