/* @flow weak */

/*
 * Component: StickyComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { isElementInViewport } from 'utils';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StickyComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StickyComponent extends Component {
  props: {
    children: {},
    updateOnScrollEl: {},
    updateScrollEl: boolean,
    isForMobile: boolean
  };

  state = {
    fixed: false,
    footerFixed: false
  };

  componentDidMount() {
    this.prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    this.stickyComponentEl = document.getElementById('sticky-component');
    this.toggleLeftLayoutFixed();
  }

  toggleLeftLayoutFixed = () => {
    const el = document.getElementById('regular-header-section');
    const { updateOnScrollEl } = this.props;
    if (!el && window.innerWidth >= 1301) return;
    const top = el.getBoundingClientRect().height;
    if (updateOnScrollEl) {
      const currPos = window.pageYOffset || document.documentElement.scrollTop;
      if (this.prevScrollPos > currPos) {
        updateOnScrollEl.scrollTop = 0;
      } else {
        updateOnScrollEl.scrollTop = 100000;
      }
      this.prevScrollPos = currPos;
    }

    const isFooterInViewPort = isElementInViewport(document.getElementById('footer-scroll-benchmark'));
    let isHeightMoreThan250 = true;
    const stickyLeftEl = document.querySelector('#sticky-component div');
    if (stickyLeftEl) {
      isHeightMoreThan250 = stickyLeftEl.getBoundingClientRect().height > 250;
    }
    if (this.stickyComponentEl && this.stickyComponentEl.getBoundingClientRect().top < top) {
      this.setState({ fixed: true, footerFixed: isFooterInViewPort && isHeightMoreThan250 });
    } else {
      this.setState({ fixed: false, footerFixed: isFooterInViewPort && isHeightMoreThan250 });
    }
    if (document.getElementById('research-lyout-builder-layout-right')) {
      const researchLeftPanelElement = document.getElementById('research-lyout-builder-layout-right').getBoundingClientRect();
      if (window.innerWidth <= 1023 && this.state.fixed && researchLeftPanelElement && researchLeftPanelElement.y < 690) {
        this.setState({ fixed: false, footerFixed: isFooterInViewPort && isHeightMoreThan250 });
      }
    }
    // const researchRelatedContent = document.getElementById('research-related-content');
    // if (this.state.fixed && researchRelatedContent && isElementInViewport(researchRelatedContent)) {
    //   this.setState({ fixed: false, footerFixed: isFooterInViewPort && isHeightMoreThan250 });
    // }

    // const publicationCards = document.querySelectorAll('.related-content .publication-card-small');
    // if (this.state.fixed && publicationCards && oneOfTheElementsInViewport(publicationCards)) {
    //   this.setState({ fixed: false, footerFixed: isFooterInViewPort && isHeightMoreThan250 });
    // }
  }

  componentWillMount() {
    window.addEventListener('scroll', this.toggleLeftLayoutFixed);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.toggleLeftLayoutFixed);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateScrollEl === true) {
      setTimeout(() => this.toggleLeftLayoutFixed(), 100);
    }
  }
  render() {
    const { fixed, footerFixed } = this.state;
    return (
      <div id={this.props.isForMobile ? 'sticky-component-mobile' : 'sticky-component'} className={`sticky-component ${fixed ? 'fixed' : ''} ${footerFixed ? 'footer-fixed' : ''}`}>
        { this.props.children }
      </div>
    );
  }
}

export default StickyComponent;
