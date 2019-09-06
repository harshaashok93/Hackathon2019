/* @flow weak */

/*
 * Component: LollypopCasouselItem
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { RichText } from 'components';
import { NavLink } from 'react-router-dom';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LollypopCasouselItem.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LollypopCasouselItem extends Component {
  props: {
    richText: '',
    learMoreText: '',
    to: '',
    backgroundImage: '',
    backgroundImageTablet: '',
    backgroundImageMobile: '',
    lollopopColor: '',
    carouselType: '',
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  }

  componentDidMount() {
    // Component ready
  }

  renderInternalLink = (url, text) => {
    if (url.indexOf('http') > -1 || url.indexOf('https') > -1) {
      return (
        <a className="learn-more navlink" target={'_self'} href={url}>
          {text}
        </a>
      );
    }
    return (
      <NavLink className="learn-more navlink" to={url || '/'}>
        {text}
      </NavLink>
    );
  }

  renderGeneralLink = (url, text) => {
    return (
      <div>
        <a aria-label={'Navlink link'} className="learn-more anchor" target={'_blank'} href={url}>
          {text}
        </a>
      </div>
    );
  }

  getBackgroundImage = () => {
    const {
      backgroundImageMobile,
      backgroundImageTablet,
      backgroundImage
    } = this.props;
    if (window.innerWidth < 767) {
      return (backgroundImageMobile || backgroundImage);
    } else if (window.innerWidth < 1024) {
      return (backgroundImageTablet || backgroundImage);
    }
    return backgroundImage;
  }

  render() {
    const { richText, learMoreText, to, lollopopColor, carouselType } = this.props;
    let lollypopBackgroundColor = lollopopColor;
    // BCMBT - 547, Lollypop carousel background CSS comes from CMS. Needs to be overridden in mobile to apply blue color.
    // If handled in CSS, there will be red color in the carousel for a second.
    if (window.innerWidth < 767 && carouselType !== 'main-page-carousel') {
      lollypopBackgroundColor = '#0079c1';
    }

    return (
      <div className={'lollypop-casousel-item sub-page'} key={Math.random()}>
        <div className="banner" style={{ background: `url(${this.getBackgroundImage()})` }}>
          <div className="lollypop-circle" style={{ backgroundColor: lollypopBackgroundColor }}>
            <div className="centerAlignVertical">
              <RichText richText={richText} />
              {
                to.url && (
                  (to.link_target !== 'newTab') ?
                    this.renderInternalLink(to.url, learMoreText)
                    :
                    this.renderGeneralLink(to.url, learMoreText)
                )
              }
            </div>
          </div>
          <div className="lollypop-circle-outer" />
        </div>
      </div>
    );
  }
}

export default LollypopCasouselItem;
