/* @flow weak */

/*
 * Component: SubSectorSelectionFilterJsx
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'unchained-ui-react';
import {
  departmentSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SubSectorSelectionFilterJsx.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SubSectorSelectionFilterJsx extends Component {
  props: {
    subMenu: {},
    applySubSectorSelection: () => void,
    handleGTM: () => void,
    subMenuChildren: {},
    selectedSectorId: '',
    menuClick: () => void
  };

  static defaultProps = {
  };

  state = {
    showSubmenu: false
  };

  iterativeSearch = (obj, selectedSectorId) => {
    /* eslint-disable */
    let result = false;
    for (var p in obj) {
      if ((obj.id || obj.bm_id) === selectedSectorId) {
        return true;
      } else {
        if (typeof obj[p] === 'object') {
          result = this.iterativeSearch(obj[p], selectedSectorId);
          if (result) {
            return result;
          }
        }
      }
    }
    return result;
    /* eslint-enable */
  }

  componentWillMount() {
    const { subMenu, selectedSectorId } = this.props;
    let showSubmenu = false;
    if (subMenu && subMenu.children) {
      showSubmenu = this.iterativeSearch(subMenu, selectedSectorId);
    }
    this.setState({ showSubmenu });
  }

  showSubmenu = (forceCallAPI = false, isAllSub = false) => {
    if (isAllSub || (this.props.menuClick && window.innerWidth < 768 && !this.props.subMenuChildren)) {
      this.props.menuClick();
    }
    const { subMenu, applySubSectorSelection, handleGTM, subMenuChildren } = this.props;
    event.stopPropagation();
    if (!subMenuChildren || forceCallAPI) {
      applySubSectorSelection(subMenu.gics_code || subMenu.id, subMenu.gics_code); handleGTM(subMenu.name);
    } else {
      this.setState({ showSubmenu: !this.state.showSubmenu });
    }
  }

  getChildren() {
    const { subMenu, subMenuChildren, selectedSectorId } = this.props;
    if (subMenuChildren) {
      if (this.state.showSubmenu) {
        return (
          <div>
            <Button
              onClick={() => this.showSubmenu(true, true)}
              className={`linkBtn menu-display-text ${selectedSectorId === subMenu.id ? 'selected' : ''}`}
            >
              All {subMenu.name}
              {selectedSectorId === subMenu.id ? <span className="bmo_chevron tick" /> : null}
            </Button>
            {subMenuChildren}
          </div>
        );
      }
      return null;
    }
    return null;
  }

  render() {
    const { subMenu, subMenuChildren, selectedSectorId } = this.props;
    return (
      <span
        className={(this.state.showSubmenu && subMenuChildren) ? 'active a-sub-menu-cell sub-sector-selection-filter-jsx' : 'a-sub-menu-cell sub-sector-selection-filter-jsx'}
        role="button"
        tabIndex={0}
        onKeyPress={() => {}}
        key={Math.random()}
      >
        <Button
          className={`linkBtn ${selectedSectorId === (subMenu.id || subMenu.bm_id) ? 'selected' : ''}`}
          onClick={() => this.showSubmenu(false)}
        >
          <div className="name">
            {subMenu.name}
            {selectedSectorId === (subMenu.id || subMenu.bm_id) && !subMenuChildren ? <span className="bmo_chevron tick" /> : null}
          </div>
          {
            subMenuChildren ?
              <i aria-hidden="true" className="bmo_chevron child bottom" />
              : null
          }
        </Button>
        {this.getChildren()}
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedSectorId: departmentSelector.getSelectedSectorId(state)
});

export default connect(mapStateToProps)(SubSectorSelectionFilterJsx);
