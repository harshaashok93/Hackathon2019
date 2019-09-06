/* @flow weak */

/*
 * Component: RegularHeader
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid } from 'unchained-ui-react';
import { isElementInViewport } from 'utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './RegularHeader.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class RegularHeader extends Component {
  props: {
    children: {}
  };

  static defaultProps = {
  };

  state = {
    fixed: false
  };

  handleHeaderScroll = () => {
    const isFooterInViewPort = isElementInViewport(document.getElementById('footer-scroll-benchmark'));
    if (isFooterInViewPort && this.state.fixed === false) return;
    const el = document.getElementById('top-header');
    if (!el) return;
    const top = el.getBoundingClientRect().height;
    const inputEl = document.getElementById('search-input-text-box');
    if (inputEl) {
      if (window.innerWidth < 768) {
        if (inputEl.id !== document.activeElement.id) {
          inputEl.blur();
        }
      } else {
        inputEl.blur();
      }
    }
    if (window.pageYOffset >= top) {
      this.setState({ fixed: true });
    } else {
      inputEl.value.length && inputEl.focus();
      this.setState({ fixed: false });
    }
  }

  componentWillMount() {
    window.addEventListener('scroll', this.handleHeaderScroll);
  }
  componentDidMount() {
    this.handleHeaderScroll();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleHeaderScroll);
  }

  render() {
    const { children } = this.props;

    return (
      <Grid className={`regular-header-section ${this.state.fixed ? 'fixed' : ''}`} id="regular-header-section">
        <Grid.Row>
          {children}
        </Grid.Row>
      </Grid>
    );
  }
}

export default RegularHeader;
