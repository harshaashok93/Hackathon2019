/* @flow weak */

/*
 * Component: LibraryPageCoverageComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { CoverageOverlay, CompanyInfoLibOverlay } from 'components';
import { Grid, Loader } from 'unchained-ui-react';
import { getParameterByName } from 'utils';
import { connect } from 'react-redux';
import {
  GET_COVERAGE_OVERLAY,
  SET_COVERAGE_OVERLAY
} from 'store/actions';
import {
  departmentSelector,
  userSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LibraryPageCoverageComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LibraryPageCoverageComponent extends Component {
  props: {
    getCoverageOverlay: () => void,
    coverageData: {},
    isOverLayLoading: bool,
    deptSetTicker: '',
    isLoggedIn: bool,
    setCoverageOverlay: () => void,
  };

  static defaultProps = {
  };

  state = {
    searchType: '',
    isLandFromDepartment: false,
    ticker: '',
    isEquity: window.unchainedSite && window.unchainedSite.sitename === 'Equity',
  };

  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    if (this.props.deptSetTicker && this.props.isLoggedIn && getParameterByName('companyNotActive') !== '1') {
      this.setState({ searchType: 'company', isLandFromDepartment: true, ticker: this.props.deptSetTicker });
      this.props.setCoverageOverlay(true);
      if (this.state.isEquity) {
        this.props.getCoverageOverlay({ ticker: this.props.deptSetTicker });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.deptSetTicker && this.state.ticker !== nextProps.deptSetTicker && nextProps.isLoggedIn && getParameterByName('companyNotActive') !== '1') {
      this.setState({ searchType: 'company', isLandFromDepartment: true, ticker: nextProps.deptSetTicker });
      this.props.setCoverageOverlay(true);
      if (this.state.isEquity) {
        this.props.getCoverageOverlay({ ticker: nextProps.deptSetTicker });
      }
    }
    if (!nextProps.deptSetTicker) {
      this.props.setCoverageOverlay(false);
    }
  }

  render() {
    const { coverageData, isOverLayLoading, isLoggedIn } = this.props;
    const { searchType, ticker } = this.state;
    // const showOverlay = (this.props.deptSetTicker) && ((isOverLayLoading && searchType === 'company') || (coverageData && searchType === 'company' && isLoggedIn));
    // this.props.setCoverageOverlay(showOverlay);
    if (ticker === '' || !this.props.deptSetTicker) {
      return null;
    }
    if (isOverLayLoading && searchType === 'company') {
      return (
        <div className="library-page-coverage-component">
          <div className={'coverage-on-lib-loading'}>
            <Loader active={true} content="Loading..." />
          </div>
        </div>
      );
    }
    if (coverageData && searchType === 'company' && isLoggedIn) {
      return (
        <div className="library-page-coverage-component">
          <Grid computer={12} mobile={1}>
            <Grid.Row>
              <Grid.Column className="desktop-company-data" computer={4} mobile={12} tablet={12}>
                <CompanyInfoLibOverlay />
              </Grid.Column>
              <Grid.Column className="mobile-company-data" computer={4} mobile={12} tablet={12}>
                <CompanyInfoLibOverlay mobile={true} />
              </Grid.Column>
              <Grid.Column className="coverageOverlayContainer" computer={8} mobile={12} tablet={12}>
                <CoverageOverlay onlyGraphData={true} forThePage={'for-library'} graphHeight={'250px'} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  isOverLayLoading: departmentSelector.isOverLayLoading(state),
  coverageData: departmentSelector.getCoverageData(state),
  deptSetTicker: departmentSelector.getDeptSetTicker(state),
  isLoggedIn: userSelector.getIsLoggedIn(state)
});

const mapDispatchToProps = (dispatch) => ({
  getCoverageOverlay: (data) => {
    dispatch(GET_COVERAGE_OVERLAY(data));
  },
  setCoverageOverlay: (data) => {
    dispatch(SET_COVERAGE_OVERLAY(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LibraryPageCoverageComponent);
