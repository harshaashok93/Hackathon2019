/* @flow weak */

/*
 * Component: StickyComponentV2
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StickyComponentV2.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StickyComponentV2 extends Component {
  props: {
    children: {},
    idName: ''
  };

  static defaultProps = {
  };

  state = {
    topEdgeElement: 'regular-header-section',
    topEdge: 0,
    styleObj: {},
    stickyState: 'absTop'
  };
  lastPos = 0;
  componentWillMount() {
    document.addEventListener('scroll', this.computePos);
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.computePos);
    document.getElementById('layout-container').style.paddingTop = '0px';
  }

  componentWillReceiveProps(nextProps) { //eslint-disable-line
    document.addEventListener('scroll', this.computePos);
  }

  calculateBottom = () => {
    if (window.innerWidth > 768) {
      return 15;
    }
    return 100;
  }

  componentDidMount() {
    const stickyBox = document.getElementById('sticky-component-ii');
    if (stickyBox) {
      const stickyBoundClint = stickyBox.getBoundingClientRect();
      if (stickyBoundClint) {
        if (stickyBoundClint.top > 110 && stickyBoundClint.bottom < window.innerHeight) {
          document.removeEventListener('scroll', this.computePos);
          document.getElementById('layout-container').style.paddingTop = '0px';
        }
      }
    }
  }
  /* eslint-disable */
  direction = () => {
    if (this.lastPos < window.pageYOffset) {
      this.lastPos = window.pageYOffset;
      return 'dn';
    }
    if (this.lastPos > window.pageYOffset) {
      this.lastPos = window.pageYOffset;
      return 'up';
    }
    return 'sm';
  }
  lastBottom = 0;
  computePos = () => {
    const stickyBox = document.getElementById('sticky-component-ii');

    // This is the section after which the sticky component should hide in the top of the page
    const topEdge = document.getElementById(this.state.topEdgeElement);

    // This is the div where the footer begins
    const footerBenchMark = document.getElementById('footer-scroll-benchmark');

    // The result container on the right side
    const rightLayoutBookMark = document.getElementById(this.props.idName);

    // The analyst dropdown element
    const analystDropdown = document.querySelector('.ui.search.searchBox .menu.transition');

    if (topEdge && stickyBox && footerBenchMark) {
      // Fetching the boundaries of all the necessary entitites
      const footerBenchMarkBoundClint = footerBenchMark.getBoundingClientRect();
      const stickyBoundClint = stickyBox.getBoundingClientRect();
      const topEdgeBoundClint = topEdge.getBoundingClientRect();
      const rightLayoutBookMarkBoundClint = rightLayoutBookMark.getBoundingClientRect();
      const analystDropdownBoundClient = analystDropdown && analystDropdown.getBoundingClientRect();

      document.getElementById('layout-container').style.position = 'relative';
      /*
        Moving the layout-container down by 100px (height of the regular header)
        when the user scrolls by 55px (height of the blue header)
      */
      if (window.pageYOffset >= 55) {
        document.getElementById('layout-container').style.paddingTop = '100px';
      } else if (window.pageYOffset < 55) {
        /*
          Moving the layout-container up to 0
          when the user blue header is visible
        */
        document.getElementById('layout-container').style.paddingTop = '0px';
      }
      const d = this.direction();

      let deltaHeight = 0;

      if (analystDropdownBoundClient && analystDropdownBoundClient.bottom >= window.innerHeight) {
        deltaHeight = (analystDropdownBoundClient.bottom - window.innerHeight) + 10;
      }

      if (rightLayoutBookMarkBoundClint.top > 145) {
        console.log('condition first'); // eslint-disable-line
        this.setState({ stickyState: 'absTop', styleObj: { position: 'absolute' } });
      } else if(d === 'dn' && (stickyBoundClint.bottom < window.innerHeight || footerBenchMarkBoundClint.top <= window.innerHeight)) {
        /*
          Conditions:
          Scrolling down AND
          Bottom of sticky is below the window OR
          Top of the Footer is visible in the window
        */
        if (this.state.stickyState !== 'fixedMid') {
          this.lastBottom = stickyBoundClint.top;
        }
        console.log(`condition second ${deltaHeight}`); // eslint-disable-line
        this.setState({ stickyState: 'fixBottom', styleObj: { position: 'fixed', top: this.lastBottom - deltaHeight } });
      } else if(d === 'up' && stickyBoundClint.top >= topEdgeBoundClint.height + 15) {
        console.log(`condition third ${window.innerHeight} ${analystDropdownBoundClient.bottom} ${deltaHeight}`); // eslint-disable-line
        this.setState({ stickyState: 'fixTop', styleObj: { position: 'fixed', top: topEdgeBoundClint.height + 15 - deltaHeight } });
      } else if(d === 'up' && this.state.stickyState === 'fixBottom') {
        console.log(`condition four ${deltaHeight}`); // eslint-disable-line
        this.setState({ stickyState: 'absMid', styleObj: { position: 'absolute', bottom: rightLayoutBookMarkBoundClint.bottom - window.innerHeight - 28 } });
      } else if(d === 'dn' && this.state.stickyState === 'fixTop') {
        console.log(`condition five ${deltaHeight}`); // eslint-disable-line
        this.setState({ stickyState: 'absMid', styleObj: { position: 'absolute', top: window.pageYOffset - 220 } });
      }
      if (this.state.stickyState === 'fixBottom' && footerBenchMarkBoundClint.top <= (window.innerHeight || document.documentElement.clientHeight)) {
        console.log(`condition six ${deltaHeight}`); // eslint-disable-line
        this.setState({ stickyState: 'absMid', styleObj: { position: 'absolute', bottom: this.props.idName === 'our-dept-result-wrapper-id' ? this.calculateBottom() : 15 } });
      }
    }
  }
  render() {
    return (
      <div style={this.state.styleObj} className={`sticky-component-v-2 ${this.props.idName === 'our-dept-result-wrapper-id' ? 'our-dept' : ''}`} id="sticky-component-ii">
        {this.props.children}
      </div>
    );
  }
}

export default StickyComponentV2;
