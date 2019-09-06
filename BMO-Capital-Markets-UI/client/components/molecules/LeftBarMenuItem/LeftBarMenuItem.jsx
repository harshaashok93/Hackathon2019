/* @flow weak */

/*
 * Component: LeftBarMenuItem
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Heading } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { mapPropsToChildren } from 'utils/reactutils';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  SET_LEFT_MENU_TEXT,
} from 'store/actions';
import {
  headerSelector,
} from 'store/selectors';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LeftBarMenuItem.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LeftBarMenuItem extends Component {
  props: {
    text: '',
    children: '',
    to: '',
    setSelectedText: () => void,
    selectedText: '',
    childComps: {},
    documentUrl: ''
  };

  state = {
    isSubMenuOpen: false,
    isSelected: false,
  }

  openSubMenu = (menuTitle) => {
    const { text, setSelectedText, children } = this.props;
    if (window.location.pathname.indexOf('/q-model/') > -1) {
      pushToDataLayer('qmodel', 'leftMenuClick', { action: menuTitle });
    } else if (window.location.pathname.indexOf('/featured-research/') > -1) {
      pushToDataLayer('featuredresearch', 'menuClick', { action: 'Navigation', label: menuTitle });
    } else if (window.location.pathname.indexOf('/bmo-data/') > -1) {
      pushToDataLayer('featuredresearch', 'menuClick', { action: 'Navigation', category: 'BMO Data', label: menuTitle });
    }
    this.setState({ isSubMenuOpen: !this.state.isSubMenuOpen });
    if (children) {
      this.state.isSubMenuOpen ?
        setSelectedText(`${text}-0`, true)
        :
        setSelectedText(text, true);
    } else {
      setSelectedText(text, false);
    }
  }

  componentWillMount() {
    const { to, children, text, setSelectedText } = this.props;
    if (to && to.url === window.location.pathname) {
      this.setState({ isSelected: true, isSubMenuOpen: true });
      setSelectedText(text, false);
    }
    if (children) {
      children.map((item) => {
        if (item[0].props.to.url === window.location.pathname) {
          this.setState({ isSelected: true, isSubMenuOpen: true });
          setSelectedText(text, false);
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedText, text, childComps, to, children, setSelectedText } = nextProps;
    if (this.props.childComps !== childComps) {
      if (to && to.url === window.location.pathname) {
        this.setState({ isSelected: true, isSubMenuOpen: true });
        setSelectedText(text, false);
      }
      if (children) {
        children.map((item) => {
          if (item[0].props.to.url === window.location.pathname) {
            this.setState({ isSelected: true, isSubMenuOpen: true });
            setSelectedText(text, false);
          }
        });
      }
    }
    if (selectedText === text) {
      this.setState({ isSelected: true });
    } else {
      this.setState({ isSelected: false, isSubMenuOpen: false });
    }
  }

  render() {
    const { text, children, to, setSelectedText, childComps, documentUrl } = this.props;
    const { isSubMenuOpen, isSelected } = this.state;
    let linkUrl = '';
    if (documentUrl && documentUrl !== '') {
      linkUrl = `${documentUrl}?${moment.now()}`;
    } else if (to && to.url) {
      linkUrl = to.url;
    } else {
      linkUrl = '/';
    }
    if (children) {
      const dropDownIcon = isSubMenuOpen ? 'bmo_chevron' : 'bmo_chevron bottom';
      return (
        <div className="left-bar-menu-item">
          <Heading as={'h3'} className={`menu-cell-head ${isSelected ? 'true' : 'false'}`} onClick={() => this.openSubMenu(text)}>
            <div className="title-text">{text}</div>
            <span className={`drop-down-icon ${dropDownIcon}`} />
          </Heading>
          { isSubMenuOpen ?
            <div className={`subMenu ${isSubMenuOpen.toString()}`}>
              <ul>
                {
                  mapPropsToChildren(children, {
                    menutext: text,
                    setSelectedText
                  })
                }
              </ul>
            </div>
            :
            null
          }
        </div>
      );
    }
    return (
      <div className="left-bar-menu-item">
        {
          to && to.link_target !== 'newTab' ?
            <Heading
              as={childComps.length === 1 ? '' : NavLink}
              to={linkUrl}
              className={`menu-cell-head ${isSelected ? 'true' : 'false'}`}
              onClick={() => this.openSubMenu(text)}
              id={text.replace(/\s/g, '-').toLowerCase()}
            >
              <div className="title-text">
                {text}
              </div>
            </Heading>
            :
            <Heading
              as={'a'}
              className={`menu-cell-head ${isSelected ? 'true' : 'false'}`}
              href={linkUrl}
              target={'_blank'}
              id={text.replace(/\s/g, '-').toLowerCase()}
            >
              <div className="title-text">
                {text}
              </div>
            </Heading>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedText: headerSelector.getSelectedText(state),
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedText: (data, isOpen) => {
    dispatch(SET_LEFT_MENU_TEXT(data, isOpen));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftBarMenuItem);
