/* @flow weak */

/*
 * Component: SectorSelectionFilter
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getParameterByName } from 'utils';
import { Button } from 'unchained-ui-react';
import { StickyComponentV2, SubSectorSelectionFilterJsx } from 'components';
import {
  SET_SECTOR_ID,
  SET_SUB_SECTOR_OPTIONS
} from 'store/actions';
import { pushToDataLayer } from 'analytics';
import {
  departmentSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './SectorSelectionFilter.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class SectorSelectionFilter extends Component {
  props: {
    selectedSectorId: '',
    data: [],
    applySelection: () => void,
    setExtendedSubSector: () => void,
    filterTitle: '',
  };

  state = {
    selectedSectorName: this.props.filterTitle,
    selectedParentSector: -1,
    selectedSectorId: -1,
    subSectors: [],
    isDropOpen: false,
  };
  subSectors = [];
  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    let sectorId = getParameterByName('sectorId');
    if (!sectorId) {
      sectorId = 0;
    }
    this.setState({ selectedSectorId: parseInt(sectorId, 10), selectedParentSector: -2 });
    this.props.applySelection({ sectorId });
  }
  getSubMenu = (data, lavel, parentLabel, correctSubtree) => {
    if (data && data.children && data.children.length) {
      return (
        data.children.map((subMenu) => {
          const subMenuChildren = (
            subMenu.children.length ? (
              <ul className="coverage-sub-menu" key={subMenu.id}>
                {this.getSubMenu(subMenu, lavel + 1, subMenu.name, (this.state.selectedSectorId === subMenu.id) || correctSubtree)}
              </ul>
            )
              : null
          );
          return (
            <li key={Math.random()} className={`coverage-sub-menu-cell cell-depth-${lavel}`}>
              <SubSectorSelectionFilterJsx
                subMenu={subMenu}
                menuClick={() => { this.showSubmenu(null, 0, false, subMenu.name); }}
                applySubSectorSelection={this.applySubSectorSelection}
                handleGTM={this.handleGTM}
                subMenuChildren={subMenuChildren}
              />
            </li>
          );
        })
      );
    } else if (data && data.length) {
      data.map(subMenu => {
        this.subSectors.push({ key: subMenu.id, text: subMenu.name });
        this.getSubMenu(subMenu, lavel + 1, '', (this.state.selectedSectorId === subMenu.id) || correctSubtree);
      });
      return null;
    }
    return null;
  }
  applySubSectorSelection = (selectedSectorId, isLastLevel) => {
    this.props.applySelection({ sectorId: selectedSectorId, isLastLevel });
  }
  showSubmenu = (evt, selectedSectorId, doesHaveSubMenu, selectedSectorName, selectedParentSectorIdx, justOpen) => {
    if (evt) evt.stopPropagation();
    if (this.state.selectedParentSector === selectedParentSectorIdx) {
      this.setState({ selectedParentSector: -5 });
      return 0;
    }
    if (!doesHaveSubMenu && window.innerWidth < 768) {
      this.setState({ submenuOpenClass: 'dont-show' });
    }
    if (selectedParentSectorIdx > -2) {
      this.setState({ selectedParentSector: selectedParentSectorIdx, selectedSectorId: -2 });
    }
    this.setState({
      selectedSectorName,
      selectedSectorId
    });
    if (!justOpen) {
      this.props.applySelection({ sectorId: selectedSectorId, isLastLevel: true });
      this.subSectors = [];
      this.filterHiddenSubSectors(this.props.data, selectedSectorId, selectedSectorId === -1);
      this.props.setExtendedSubSector(this.subSectors);
    }
    return 0;
  }
  openSubMenu = () => {
    if (this.state.submenuOpenClass !== 'show') {
      this.setState({ submenuOpenClass: 'show' });
    } else {
      this.setState({ submenuOpenClass: 'dont-show' });
    }
  }
  filterHiddenSubSectors = (data, selectedSectorId, underCorrectSubsector) => {
    data && data.map(subSect => {
      if (underCorrectSubsector) {
        this.subSectors.push({ key: subSect.id, text: subSect.name });
      }
      this.filterHiddenSubSectors(subSect.children, selectedSectorId, (underCorrectSubsector || selectedSectorId === subSect.id));
    });
  }
  getAllsectors = (data, selectedParentSector, selectedSectorId) => {
    this.subSectors = [];
    const sectorData = data.map((menuCell, idx) => {
      const isParentSelected = this.state.selectedSectorId === (menuCell.gics_code);
      const isSectorSelected = this.props.selectedSectorId === (menuCell.gics_code);

      return (
        <li key={Math.random()} className={(selectedParentSector === idx || selectedSectorId === menuCell.gics_code) ? 'active coverage-menu-cell' : 'coverage-menu-cell'}>
          <div
            className={selectedParentSector === idx ? 'coverage-menu-cell-first-level show' : 'coverage-menu-cell-first-level'}
            role="button"
            tabIndex={0}
            onKeyPress={() => {}}
            key={Math.random()}
            data={menuCell.id}
            onClick={(evt) => {
              const hasSubMenu = menuCell.children && (menuCell.children.length);
              this.showSubmenu(evt, menuCell.gics_code || menuCell.id, hasSubMenu, menuCell.name, idx, hasSubMenu);
              this.handleGTM(menuCell.children.length > 0 ? `${menuCell.name}: All` : menuCell.name);
            }}
          >
            <div className="menu-display-text" title={menuCell.name}>{menuCell.name}</div>
            {
              menuCell.children.length ?
                <i aria-hidden="true" className="bmo_chevron bottom" />
                : null
            }
          </div>
          {
            menuCell.children.length ?
              <div className="coverage-sub-menu-cell-first-level">
                <ul className="coverage-sub-menu">
                  <li key={Math.random()} className={'coverage-sub-menu-cell cell-depth-0'}>
                    <span
                      className={isParentSelected ? 'active a-sub-menu-cell' : 'a-sub-menu-cell'}
                      role="button"
                      tabIndex={0}
                      onKeyPress={() => {}}
                      key={Math.random()}
                      onClick={() => { this.handleGTM(`${menuCell.name}`); }}
                    >
                      <Button
                        onClick={(evt) => { this.showSubmenu(evt, menuCell.gics_code || menuCell.id, false, `All ${menuCell.name}`); this.handleGTM(`${menuCell.name} : All`); }}
                        className={`linkBtn menu-display-text ${isSectorSelected ? 'selected' : ''}`}
                      >
                        All {menuCell.name}
                        {isSectorSelected ? <span className="bmo_chevron tick" /> : null}
                      </Button>
                    </span>
                  </li>
                  {this.getSubMenu(menuCell, 0, menuCell.name, isParentSelected)}
                </ul>
              </div>
              : null
          }
        </li>
      );
    });
    return sectorData;
  }
  handleGTM = (label) => {
    if (event) event.stopPropagation();
    if (label) {
      let type = 'ourcoverageLeftNavSel';
      const pageUrlSplit = window.location.pathname.split('/');
      if (pageUrlSplit && pageUrlSplit[2]) {
        if (pageUrlSplit[2] === 'our-analysts') {
          type = 'ouranalystsLeftNavSel';
        }
        pushToDataLayer('ourdepartment', type, { label });
      }
    }
  }

  openOptionDiv = () => () => {
    const { isDropOpen } = this.state;
    this.setState({ isDropOpen: !isDropOpen });
  }

  render() {
    const { data, filterTitle } = this.props;
    const { selectedSectorName, selectedParentSector, selectedSectorId, isDropOpen } = this.state;
    this.subSectors = [];
    return (
      <StickyComponentV2 idName={'our-dept-result-wrapper-id'}>
        <div className="sector-selection-filter">
          <div className="sector-selection-filters-menu left-drawer-layout">
            <ul className="coverage-menu">
              <span
                className={`coverage-menu-cell mobile-only head ${this.state.submenuOpenClass || ''}`}
                role="button"
                tabIndex={0}
                onKeyPress={() => {}}
                onClick={this.openSubMenu}
              >
                {selectedSectorName}
                <Button className={`linkBtn ${isDropOpen ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={this.openOptionDiv()} />
              </span>
              <li className="rest">
                <ul className="coverage-menu">
                  <li className={(selectedParentSector === -1 || selectedSectorId === 0) ? 'active coverage-menu-cell' : 'coverage-menu-cell'}>
                    <span
                      className="coverage-menu-cell-first-level"
                      role="button"
                      tabIndex={0}
                      onKeyPress={() => {}} key={Math.random()}
                      onClick={(evt) => { this.showSubmenu(evt, 0, false, 'All Sectors', -1); this.handleGTM('All Sectors'); }}
                    >
                      {filterTitle} ( {data.length} )
                    </span>
                  </li>
                  {this.getAllsectors(data, selectedParentSector, selectedSectorId)}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </StickyComponentV2>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedSectorId: departmentSelector.getSelectedSectorId(state),
  deptData: departmentSelector.setAnalystProfileLinks(state)
});

const mapDispatchToProps = (dispatch) => ({
  applySelection: (data) => {
    dispatch(SET_SECTOR_ID(data));
  },
  setExtendedSubSector: (data) => {
    dispatch({ type: SET_SUB_SECTOR_OPTIONS, data });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SectorSelectionFilter);

