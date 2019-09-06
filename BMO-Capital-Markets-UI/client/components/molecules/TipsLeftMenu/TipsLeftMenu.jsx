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
// import { pushToDataLayer } from 'analytics';
import { connect } from 'react-redux';
import { LeftBarSubMenuItem } from 'components';
import {
  quantSelector,
  headerSelector
} from 'store/selectors';

import {
  SET_LEFT_MENU_TEXT,
} from 'store/actions';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './TipsLeftMenu.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class TipsLeftMenu extends Component {
  props: {
    text: '',
    to: { url: ''},
    tipsData: {},
    setSelectedText: () => void,
    selectedText: '',
    childComps: {},
  };

  state = {
    isSubMenuOpen: false
  }

  defaultProps = {
    text: 'text',
    to: {}
  }

  openSubMenu = () => {
    const { text, setSelectedText, tipsData } = this.props;
    this.setState({ isSubMenuOpen: !this.state.isSubMenuOpen });
    if (tipsData) {
      this.state.isSubMenuOpen ?
        setSelectedText(`${text}-0`, true)
        :
        setSelectedText(text, true);
    } else {
      setSelectedText(text, false);
    }
  }

  componentWillMount() {
    const { to, text, tipsData, setSelectedText } = this.props;
    if (to && to.url === window.location.pathname) {
      this.setState({ isSelected: true, isSubMenuOpen: true });
      setSelectedText(text, false);
    }
    if (tipsData) {
      this.setState({ tipsData });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedText, text, tipsData, childComps, to, setSelectedText } = nextProps;
    if (this.props.childComps !== childComps) {
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
    if (tipsData) {
      this.setState({ tipsData: nextProps.tipsData });
    }
  }

  render() {
    const { text, to } = this.props;
    const { isSubMenuOpen, selected, tipsData } = this.state;
    if (tipsData) {
      const dropDownIcon = isSubMenuOpen ? 'bmo_chevron' : 'bmo_chevron bottom';
      return (
        <div className="left-bar-menu-item tips-left-menu">
          <Heading as={'h3'} className={`menu-cell-head ${isSubMenuOpen.toString()}`} onClick={() => this.openSubMenu()}>
            <div className="title-text">{text}</div>
            { tipsData.data ? <span className={`drop-down-icon ${dropDownIcon}`} /> : null }
          </Heading>
          {
            isSubMenuOpen && tipsData.data ?
              <div className={`subMenu ${isSubMenuOpen.toString()}`}>
                <ul>
                  {
                    tipsData.data.map((menu) => {
                      const hash = menu.value.toLowerCase().replace(/\s/g, '').replace(/&/g, '-');
                      return (
                        <LeftBarSubMenuItem
                          to={{ url: `/quant/trends-inflection-points/#${hash}` }}
                          text={menu.value}
                          menutext={text}
                          setSelectedText={this.props.setSelectedText}
                        />
                      );
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
        <Heading as={NavLink} to={(to && to.url) ? to.url : '/'} className={`menu-cell-head ${!selected ? 'unselect' : ''}`} onClick={() => this.openSubMenu()}>
          <div className="title-text">
            {text}
          </div>
        </Heading>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tipsData: quantSelector.getTipsData(state),
  selectedText: headerSelector.getSelectedText(state),
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedText: (data, isOpen) => {
    dispatch(SET_LEFT_MENU_TEXT(data, isOpen));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TipsLeftMenu);
