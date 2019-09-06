/* @flow weak */

/*
 * Component: FeaturedResearchEventCarousel
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { CarouselComponent } from 'components';
import './FeaturedResearchEventCarousel.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FeaturedResearchEventCarousel extends Component {
  props: {
    // Prop types go here
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
    const carouselNode = [
      <div><h3>1</h3></div>,
      <div><h3>2</h3></div>,
      <div><h3>3</h3></div>,
      <div><h3>4</h3></div>,
      <div><h3>5</h3></div>,
      <div><h3>6</h3></div>
    ];
    return (
      <div className="featured-research-event-carousel">
        <CarouselComponent carouselNode={carouselNode} />
      </div>
    );
  }
}

export default FeaturedResearchEventCarousel;
