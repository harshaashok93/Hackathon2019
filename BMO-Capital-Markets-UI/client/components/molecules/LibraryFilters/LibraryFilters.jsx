/* @flow weak */

/*
 * Component: FilterComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Sidebar, Container, Menu } from 'unchained-ui-react';
import { StickyComponentV2 } from 'components';
import { mapPropsToChildren } from 'utils/reactutils';
import { removeQueryParams, getDateRangeBasedOnUserStatus } from 'utils';
import { sitenameVariable } from 'constants/UnchainedVariable';
import {
  librarySelector,
  searchSelector,
  userSelector
} from 'store/selectors';
import {
  SET_MOBILE_LAYOUT_STATUS,
  RESET_LIBRARY_FILTERS,
  SET_LIBRARY_DATE,
  RESET_SEARCH_TYPE,
  SET_COMP_TICKER_FROM_DEPARTMENT,
  RESET_GICS_TYPE,
  SET_AUTHOR_FILTER
} from 'store/actions';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LibraryFilters.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LibraryFilters extends Component {
  props: {
    // filtersOptions: object;
    children : {},
    mobileLayout: bool,
    onShowFiltersBtnClick: () => void,
    onResetFiltersBtnClick: () => void,
    searchEvent: {
      type: ''
    },
    updateScrollEl: {},
    updateOnScrollEl: {},
    filter_default: {},
    profile: {}
  };

  state = {
    optionValue: {},
  }

  componentDidMount() {
    const { mobileLayout } = this.props;
    this.disableBackgroundScroll(mobileLayout);
  }

  componentWillReceiveProps(nextProps) {
    const { mobileLayout } = nextProps;
    this.disableBackgroundScroll(mobileLayout);
  }

  componentWillUnmount() {
    this.enableBackgroundScroll();
  }

  disableBackgroundScroll = (isMobileLayout) => {
    if (isMobileLayout) {
      document.body.classList.add('noscroll');
    }
  }

  enableBackgroundScroll = () => {
    const { mobileLayout } = this.props;
    if (mobileLayout) {
      document.body.classList.remove('noscroll');
    }
  }

  handleResetBtnClick = () => {
    const { onResetFiltersBtnClick, searchEvent, filter_default, resetGicsType, profile } = this.props; // eslint-disable-line
    const userStatus = profile ? profile.user_status : '';

    const defaultLoc = filter_default.Location;
    const defaultRT = filter_default['Research Type'];
    const defaultAF = filter_default['Additional Filter'];
    const defaultRC = filter_default['Research Category'];
    const defaultDate = filter_default.date_field;

    if (sitenameVariable.isEquity && defaultAF && defaultAF.include_equity) {
      delete defaultAF.include_equity;
    }
    if (sitenameVariable.isCorp && defaultAF && defaultAF.top15) {
      delete defaultAF.top15;
    }
    if (sitenameVariable.isCorp && defaultRT && defaultRT.podcast) {
      delete defaultRT.podcast;
    }

    let fromDate = null;
    let toDate = null;

    const dateField = getDateRangeBasedOnUserStatus(userStatus, defaultDate, true);
    if (dateField) {
      fromDate = dateField.fromDate;
      toDate = dateField.toDate;
    }

    const locationFilters = [];
    const researchFilters = [];
    const additionalFilters = [];
    const rebrandingFilters = [];

    if (defaultLoc) {
      Object.keys(defaultLoc).map(l => {
        if (defaultLoc[l] === true) locationFilters.push(l);
        return null;
      });
    }
    if (defaultRT) {
      Object.keys(defaultRT).map(l => {
        if (defaultRT[l] === true) researchFilters.push(l);
        return null;
      });
    }
    if (defaultAF) {
      Object.keys(defaultAF).map(l => {
        if (defaultAF[l] === true) additionalFilters.push(l);
        return null;
      });
    }

    if (defaultRC) {
      Object.keys(defaultRC).map(l => {
        if (defaultRC[l] === true) rebrandingFilters.push(l);
        return null;
      });
    }

    const filterObj = {
      locationFilters,
      researchFilters,
      additionalFilters,
      rebrandingFilters,
    };
    removeQueryParams();
    onResetFiltersBtnClick(filterObj, { fromDate, toDate });
  }

  onShowFiltersBtnClick = () => {
    const { mobileLayout } = this.props;
    if (mobileLayout) {
      this.enableBackgroundScroll();
    }
    this.props.onShowFiltersBtnClick();
  }

  getFormattedElement = (el) => {
    const MAX_LENGTH = 3;
    if (el.length >= MAX_LENGTH) {
      return (
        <div>
          <div id="intro-library-filter-part">
            {el.slice(0, MAX_LENGTH)}
          </div>
          {el.slice(MAX_LENGTH)}
        </div>
      );
    }
    return el;
  }

  render() {
    const { children, mobileLayout, updateScrollEl, updateOnScrollEl, filter_default } = this.props; // eslint-disable-line
    return (
      <StickyComponentV2 idName={'right-layout-library'}>
        <div className={'left-layout left-drawer-layout library-filter'} id="library-filter-section">
          <Container className={mobileLayout ? 'show-layout' : 'hide-layout'} >
            <Sidebar animation={'slide out'} className={'side-bar'} direction="left" as={Menu} visible={true} vertical >
              <Button className={'linkBtn resetAllFilters'} onClick={this.handleResetBtnClick}>Reset All Filters</Button>
              <div className="close-image">
                <Button className="close bmo-close-btn" onClick={this.onShowFiltersBtnClick} />
              </div>
              <div className="filter-component">
                { this.getFormattedElement(
                  mapPropsToChildren(children, {
                    defaultFilters: filter_default
                  })
                )
                }
              </div>
            </Sidebar>
          </Container>
        </div>
      </StickyComponentV2>
    );
  }
}
const mapStateToProps = (state) => ({
  mobileLayout: librarySelector.isMobileLayout(state),
  searchEvent: searchSelector.getSearchEvent(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  onShowFiltersBtnClick: () => {
    dispatch({ type: SET_MOBILE_LAYOUT_STATUS, data: false });
  },
  onResetFiltersBtnClick: (filterObj, dateObj) => {
    dispatch({ type: RESET_SEARCH_TYPE });
    dispatch({ type: RESET_LIBRARY_FILTERS, data: filterObj });
    dispatch({ type: SET_LIBRARY_DATE, data: dateObj });
    dispatch({ type: SET_AUTHOR_FILTER, data: '' });
    dispatch({ type: RESET_SEARCH_TYPE });
    dispatch({ type: SET_COMP_TICKER_FROM_DEPARTMENT, data: null });
    dispatch({ type: RESET_GICS_TYPE });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LibraryFilters);
