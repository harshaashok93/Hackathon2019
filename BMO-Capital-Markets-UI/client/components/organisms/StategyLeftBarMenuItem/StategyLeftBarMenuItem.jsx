/* @flow weak */

/*
 * Component: StategyLeftBarMenuItem
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Heading } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { StrategyFilterOptions } from 'components';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';

import {
  SET_LEFT_MENU_TEXT,
} from 'store/actions';
import {
  headerSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StategyLeftBarMenuItem.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StategyLeftBarMenuItem extends Component {
  props: {
    text: '',
    data: '',
    to: '',
    setSelectedText: () => void,
    selectedText: '',
    childComps: {},
  };

  static defaultProps = {
  };

  state = {
    isSubMenuOpen: false,
    subMenuClose: '',
  }

  componentDidMount() {
    // Component ready
  }

  openSubMenu = () => {
    const { text, setSelectedText, data } = this.props;
    this.setState({ isSubMenuOpen: !this.state.isSubMenuOpen });
    if (this.state.isSubMenuOpen) {
      this.setState({ subMenuClose: 'close' });
    } else {
      this.setState({ subMenuClose: 'open' });
    }
    pushToDataLayer('strategy', 'strategyLeftMenuClick', { label: text });
    if (data.length) {
      this.state.isSubMenuOpen ?
        setSelectedText(`${text}-0`, true)
        :
        setSelectedText(text, true);
    } else {
      setSelectedText(text, false);
    }
  }

  componentWillMount() {
    const { to, text, setSelectedText } = this.props;
    if (to && to.url === window.location.pathname) {
      this.setState({ isSelected: true, isSubMenuOpen: true });
      setSelectedText(text, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { to, selectedText, text, childComps, setSelectedText } = nextProps;
    if (this.props.childComps !== childComps && this.state.subMenuClose !== 'close') {
      if (to && to.url === window.location.pathname) {
        this.setState({ isSelected: true, isSubMenuOpen: true });
        setSelectedText(text, false);
      }
    }
    if (selectedText === text) {
      this.setState({ isSelected: true });
    } else {
      this.setState({ isSelected: false, isSubMenuOpen: false });
    }
  }

  render() {
    const { text, to, data } = this.props;
    const { isSubMenuOpen, isSelected } = this.state;
    if (data.length > 0) {
      const dropDownIcon = isSubMenuOpen ? 'bmo_chevron' : 'bmo_chevron bottom';
      return (
        <div className="stategy-left-bar-menu-item">
          <Heading as={NavLink} to={to.url ? `${to.url}?noscroll=true` : '/'} className={`menu-cell-head ${isSelected ? 'true' : 'false'}`} onClick={() => this.openSubMenu()}>
            <div className="title-text">{text}</div>
            <span className={`drop-down-icon ${dropDownIcon}`} />
          </Heading>
          {
            isSubMenuOpen &&
            <div className={`subMenu ${isSubMenuOpen.toString()}`}>
              <StrategyFilterOptions
                data={data}
                text={text}
                setSelectedText={this.props.setSelectedText}
              />
            </div>
          }
        </div>
      );
    }
    return (
      <div className="stategy-left-bar-menu-item">
        <Heading as={NavLink} to={to.url || '/'} className={`menu-cell-head ${isSelected ? 'true' : 'false'}`} onClick={() => this.openSubMenu()}>
          <div className="title-text">
            {text}
          </div>
        </Heading>
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

export default connect(mapStateToProps, mapDispatchToProps)(StategyLeftBarMenuItem);
