/* @flow weak */

/*
 * Component: LeftBarMenu
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button } from 'unchained-ui-react';
import { mapPropsToChildren } from 'utils/reactutils';
import { connect } from 'react-redux';

import {
  headerSelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LeftBarMenu.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LeftBarMenu extends Component {
  props: {
    children: [],
    selectedText: '',
    isOpen: bool,
  };

  static defaultProps = {
  };

  state = {
    isShowDropDown: false,
    isTips: '',
  };

  componentDidMount() {
    const leftMenuItem = document.getElementsByClassName('left-bar-menu-item');
    if (leftMenuItem.length === 1) {
      document.getElementsByClassName('left-bar-menu')[0].style.display = 'none';
      document.getElementsByClassName('result-content-section')[0].style.width = '100%';
      document.getElementsByClassName('result-content-section')[0].style.maxWidth = '100%';
      document.getElementsByClassName('result-content-section')[0].style.padding = '0 50px';
    }
  }

  showDropDown = () => {
    const dropDownState = !this.state.isShowDropDown;
    this.setState({ isShowDropDown: dropDownState });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isShowDropDown: nextProps.isOpen });
  }

  render() {
    const { children, selectedText } = this.props;
    const { isShowDropDown, isTips } = this.state;
    return (
      <div className="left-bar-menu">
        <span className="v-hr" />
        <div className="mobile-view">
          <Button className={isShowDropDown ? 'a-drop-down open' : 'a-drop-down'} onClick={this.showDropDown}>
            <span className="filter-text">
              {selectedText.replace('-0', '')}
            </span>
            <span className="drop-down-icon bmo_chevron bottom" />
          </Button>
          <div className="left-menu-in-mobile">
            {
              window.innerWidth < 768 ?
                <ul className={`left-menu-ul ka ${isShowDropDown ? 'open' : 'close'}`}>
                  {mapPropsToChildren(children, { isForMobile: true, isTips }) }
                </ul>
                : null
            }
          </div>
        </div>
        {
          mapPropsToChildren(children, { isTips })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedText: headerSelector.getSelectedText(state),
  isOpen: headerSelector.isOpen(state),
});

export default connect(mapStateToProps, null)(LeftBarMenu);
