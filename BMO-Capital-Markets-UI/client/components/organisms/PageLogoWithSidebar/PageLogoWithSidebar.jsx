/* @flow weak */

/*
 * Component: PageLogoWithSidebar
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Heading, Container } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './PageLogoWithSidebar.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class PageLogoWithSidebar extends Component {
  props: {
    altText: '',
    pageTitle: '',
    image: '',
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
    const { altText, image, pageTitle } = this.props;
    return (
      <Container className="page-logo-with-sidebar">
        <div className="image">
          <Image className="logo-img" src={image} alt={altText} />
        </div>
        <Heading className="logo-text">{pageTitle}</Heading>
      </Container>
    );
  }
}

export default PageLogoWithSidebar;
