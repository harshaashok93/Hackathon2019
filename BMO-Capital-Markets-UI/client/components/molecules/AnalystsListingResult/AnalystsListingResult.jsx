/* @flow weak */

/*
 * Component: AnalystsListingResult
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { AnalystsResultSlice } from 'components';
import { Button, Loader } from 'unchained-ui-react';
import { connect } from 'react-redux';
import {
  GET_OUR_DEPARTMENT_ANALYSTS_DATA,
  GET_USER_PROFILE_PREFERENCES,
} from 'store/actions';
import {
  departmentSelector,
  userSelector
} from 'store/selectors';
import {
  numberWithCommas
} from 'utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystsListingResult.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsListingResult extends Component {
  props: {
    sectorData: [],
    isLoading: bool,
    applySelection: () => void,
    selectedSectorId: number,
    isLoggedIn: Boolean,
    getUserProfilePreferences: () => void,
    userProfilePreferences: {
      user_pref: {
        analysts: []
      }
    },
    profile: {},
    isSubsector: boolean,
  };

  static defaultProps = {
    selectedSectorId: 0
  };

  state = {
    defaultOrderClassSName: 'click-area reverse-sort',
    defaultOrderClassDName: 'click-area reverse-sort',
    selectedSectorId: 0,
    sectorSort: 'asc',
    noOfResultRow: 0,
  };

  componentWillMount() {
    const { applySelection, selectedSectorId, getUserProfilePreferences, isSubsector } = this.props;
    if (isSubsector) {
      applySelection({ gics_code: selectedSectorId, ordertype: 0, orderby: 'last_name' });
    } else {
      applySelection({ gics_code: selectedSectorId, ordertype: 0, orderby: 'last_name' });
    }
    getUserProfilePreferences();
  }

  pageSortScrollPosition = '';
  componentWillReceiveProps(nextProps) {
    this.nodataScrollPosition = false;
    this.sortScrollPosition = false;
    if (nextProps.isLoading || (nextProps.sectorData && nextProps.sectorData.data && nextProps.sectorData.data.length < 20)) {
      this.nodataScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.sectorData && nextProps.sectorData.data ? nextProps.sectorData.data.length : 0 });
    } else if (nextProps.sectorData && nextProps.sectorData.data && this.state.noOfResultRow === nextProps.sectorData.data.length) {
      this.sortScrollPosition = true;
      this.setState({ noOfResultRow: nextProps.sectorData.data.length });
    }
    if (nextProps.selectedSectorId !== this.state.selectedSectorId) {
      this.setState({ selectedSectorId: nextProps.selectedSectorId, defaultOrderClass: 'click-area reverse-sort', sectorSort: 'asc' });
      nextProps.isSubsector ?
        this.props.applySelection({ gics_code: nextProps.selectedSectorId, ordertype: 0, orderby: 'last_name' })
        :
        this.props.applySelection({ sectorId: nextProps.selectedSectorId, ordertype: 0, orderby: 'last_name' });
    }
  }

  componentDidMount() {
    // Component ready
  }

  componentDidUpdate() {
    if (this.nodataScrollPosition) {
      this.pageSortScrollPosition = '';
      window.scrollTo(0, 0);
    }
    if (this.sortScrollPosition && this.pageSortScrollPosition) {
      window.scrollTo(0, this.pageSortScrollPosition);
    }
  }

  sortBy = (orderby, selectedSectorId) => () => {
    this.pageSortScrollPosition = document.getElementById('analyst-result-header-id').offset;
    const { applySelection } = this.props;
    let order = '';
    if (orderby === 'last_name') {
      this.setState({ defaultOrderClassSName: 'click-area reverse-sort' });
      if (this.state.defaultOrderClassDName === 'click-area') {
        this.setState({ defaultOrderClassDName: 'click-area reverse-sort', sectorSort: 'asc' });
        order = 0;
      } else {
        this.setState({ defaultOrderClassDName: 'click-area', sectorSort: 'asc' });
        order = 1;
      }
    } else if (orderby === 'sectors') {
      this.setState({ defaultOrderClassDName: 'click-area reverse-sort' });
      if (this.state.defaultOrderClassSName === 'click-area') {
        this.setState({ defaultOrderClassSName: 'click-area reverse-sort', sectorSort: 'asc' });
        order = 0;
      } else {
        this.setState({ defaultOrderClassSName: 'click-area', sectorSort: 'desc' });
        order = 1;
      }
    }
    if (orderby !== 'sectors') {
      if (this.props.isSubsector) {
        applySelection({ gics_code: selectedSectorId, ordertype: order, orderby });
      } else {
        applySelection({ sectorId: selectedSectorId, ordertype: order, orderby });
      }
    }
  }
  renderResults = (sectorData) => {
    const { userProfilePreferences, isLoggedIn, profile } = this.props;
    if (!sectorData) return null;
    if (sectorData.data && sectorData.data.length) {
      return (
        sectorData.data.map((sectorDataRow, i) => {
          let analystArr = [];
          try {
            analystArr = userProfilePreferences.user_pref.analysts;
          } catch(e) { // eslint-disable-line
            analystArr = [];
          }
          const canFollow = profile && profile.can_access_content && profile.can_follow_content;
          return (
            <AnalystsResultSlice
              key={`${i + 1}`}
              profile={profile}
              sectorSort={this.state.sectorSort}
              index={i}
              data={sectorDataRow}
              isLoggedIn={isLoggedIn}
              canFollow={canFollow}
              analystFollow={analystArr.filter(analyst => analyst.id === sectorDataRow.person_id).length > 0}
              allAnalystId={analystArr.map(e => e.id)}
            />
          );
        }
        )
      );
    }
    return <div className={'no-results-found'}>No Results Found</div>;
  }

  render() {
    const { sectorData, selectedSectorId } = this.props;
    return (
      <div className="analysts-listing-result">
        <span className="result-count">{(sectorData && sectorData.data && sectorData.data.length) ? `${numberWithCommas(sectorData.data.length)} Results` : null }</span>
        <div className="result-card">
          <div className="result-card-header" id={'analyst-result-header-id'}>
            <div className="analyst head-cell">
              <Button className={this.state.defaultOrderClassDName} onClick={this.sortBy('last_name', selectedSectorId)}>
                Analyst <i aria-hidden="true" className="caret down icon" title={'Sort by Analysts'} />
              </Button>
            </div>
            <div className="email-phone head-cell" />
            <div className="sector head-cell">
              <Button className={this.state.defaultOrderClassSName} onClick={this.sortBy('sectors', selectedSectorId)}>
                Sector <i aria-hidden="true" className="caret down icon" title={'Sort by Sectors'} />
              </Button>
            </div>
          </div>
          <div className="result-card-data">
            {
              this.props.isLoading ?
                <div className={'sector-result-loader'}><Loader active={true} content="Loading..." /></div>
                :
                this.renderResults(sectorData)
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  sectorData: departmentSelector.getAnalystsData(state),
  selectedSectorId: departmentSelector.getSelectedSectorId(state),
  isLoading: departmentSelector.isAnalystsDataLoading(state),
  userProfilePreferences: userSelector.getUserProfilePreferences(state),
  profile: userSelector.getUserProfileInfo(state),
  isSubsector: departmentSelector.getSelectedSectorIsSubsector(state),
});

const mapDispatchToProps = (dispatch) => ({
  applySelection: (data) => {
    dispatch(GET_OUR_DEPARTMENT_ANALYSTS_DATA(data));
  },
  getUserProfilePreferences: () => {
    dispatch(GET_USER_PROFILE_PREFERENCES());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalystsListingResult);

