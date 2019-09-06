/* @flow weak */

/*
 * Component: LeftBarSubMenuItem
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Heading } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import moment from 'moment';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LeftBarSubMenuItem.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LeftBarSubMenuItem extends Component {
  props: {
    text: '',
    to: '',
    menutext: '',
    setSelectedText: () => void,
    isSelected: bool,
    isQModelItem: bool
  };

  static defaultProps = {
  };

  state = {
    //
  };

  scrollBasedOnHash = (link = window.location.hash) => {
    const hashParts = link.split('#');
    let hash = '';
    if (hashParts.length > 0) {
      hash = hashParts.slice(-1)[0];
      try {
        const queryHash = document.querySelector(`#${hash}`);
        if (queryHash) {
          queryHash.scrollIntoView();
          window.scrollBy(0, -160);
        }
      } catch (e) {} //eslint-disable-line
    }
  }

  handleClick = (link, text) => () => {
    const { menutext } = this.props;
    this.props.setSelectedText(menutext, false);
    this.scrollBasedOnHash(link);
    if (window.location.pathname.indexOf('/quant/') > -1) {
      pushToDataLayer('quant', 'tipsChangeTab', { label: text });
    } else if (window.location.pathname.indexOf('/q-model/') > -1) {
      const l = `${moment().format('MMMM')} ${(new Date()).getFullYear()} ${text}`;
      pushToDataLayer('qmodel', 'overviewLinks', { label: l });
    } else {
      pushToDataLayer('qmodel', 'overviewLinks', { label: link });
    }
  }

  render() {
    this.scrollBasedOnHash();
    const { text, to, isSelected, isQModelItem } = this.props;
    return (
      <li className="left-bar-sub-menu-item">
        <Heading
          onClick={this.handleClick(to.url, text)}
          role="button" tabIndex={0}
          onKeyPress={() => {}}
          as={NavLink} to={to.url || '/'}
        >
          {
            isSelected || `${to.url}` === `${window.location.pathname}${window.location.hash}` ?
              <div className="active-menu-cell">
                {isQModelItem ? `${moment().format('MMMM')} ${(new Date()).getFullYear()} ${text}` : text}
                <span className="bmo_chevron tick" />
              </div>
              :
              <div className="normal-menu-cell">
                {isQModelItem ? `${moment().format('MMMM')} ${(new Date()).getFullYear()} ${text}` : text}
              </div>
          }
        </Heading>
      </li>
    );
  }
}

export default LeftBarSubMenuItem;
