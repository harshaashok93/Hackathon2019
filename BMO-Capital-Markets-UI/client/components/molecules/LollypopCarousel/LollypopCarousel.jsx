/* @flow weak */

/*
 * Component: LollypopCarousel
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import Slick from 'react-slick';
import {
  Container,
  Segment,
} from 'unchained-ui-react';
import { mapPropsToChild } from 'utils/reactutils';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LollypopCarousel.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class LollypopCarousel extends Component {
  props: {
    children: '',
    carouselType: '',
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  getCarouselStyle = () => {
    const { carouselType } = this.props;
    switch (carouselType) {
      case 'main-page-carousel':
        return 'hero-carousel-padding';
      case 'our-department-carousel':
        return 'our-department-height';
      default: return '';
    }
  }

  render() {
    const { children } = this.props;
    const settings = {
      dots: children.length > 1,
      speed: 1000,
      arrows: children.length > 1,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: false,
      accessibility: true,
      centerMode: true,
      centerPadding: '0px 0px',
      infinite: children.length > 1,
      responsive: [{
        breakpoint: 768,
        settings: {
          arrows: children.length > 1,
          dots: children.length > 1,
          swipeToSlide: true,
          centerMode: true,
          centerPadding: '0px 0px',
          slidesToShow: 1,
          infinite: children.length > 1,
          slidesToScroll: 1
        }
      },
      { breakpoint: 320,
        settings: {
          infinite: children.length > 1,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    };
    return (
      <div className={`lollypop-carousel ${this.getCarouselStyle()}`} >
        <div id="vue" />
        <div className={'carousel-component'} style={{display: 'none'}}>
          <Segment className={'carousel-segment-homepage'}>
            <Container className={`${this.props.carouselType}`}>
              <Slick {...settings}>
                { children.map((item) => {
                  return <div key={Math.random()}>{mapPropsToChild(item, { carouselType: this.props.carouselType })}</div>;
                })}
              </Slick>
            </Container>
          </Segment>
        </div>
      </div>
    );
  }
}

export default LollypopCarousel;
