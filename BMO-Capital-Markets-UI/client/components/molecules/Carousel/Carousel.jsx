/* @flow weak */

/*
 * Component: Carousel
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import Slick from 'react-slick';
import {
  Container,
  Segment,
  Image,
} from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './Carousel.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Carousel extends Component {
  props: {
    data: []
  };

  static defaultProps = {
    //
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { data } = this.props;
    const settings = {
      dots: true,
      speed: 1000,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: false,
      accessibility: true,
      centerMode: true,
      centerPadding: '0px 0px',
      responsive: [{
        breakpoint: 700,
        settings: {
          arrows: true,
          dots: true,
          swipeToSlide: true,
          centerMode: true,
          centerPadding: '0px 0px',
          slidesToShow: 1
        }
      },
      { breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    };
    return (
      <div className={'carousel-component'}>
        <Segment className={'carousel-segment'}>
          <Container>
            <Slick {...settings}>
              {
                data.map((item) => {
                  return (
                    <div className="featured-research-carousel-image">
                      <Image alt={'carousel-image'} src={item.image} />
                    </div>
                  );
                })
              }
            </Slick>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default Carousel;
