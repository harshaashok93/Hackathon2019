/* @flow weak */

/*
 * Component: BmoRedFilterSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BmoRedFilters, BmoRedResultSection } from 'components';
import {
  bmoredSelector
} from 'store/selectors';
import {
  GET_BMO_RED_DROPDOWN_LIST,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BmoRedFilterSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BmoRedFilterSection extends Component {
  props: {
    dropDownList: {},
    getDropdownList: () => void,
    defaults: {},
  };

  static defaultProps = {
  };

  state = {
    slidingTableOpen: false,
  };

  componentDidMount() {
    //
  }

  componentWillMount() {
    this.props.getDropdownList();
  }

  openTable = () => () => {
    this.setState({ slidingTableOpen: true });
  }

  render() {
    const { dropDownList } = this.props;
    const { slidingTableOpen } = this.state;
    return (
      <div className="bmo-red-filter-section">
        {dropDownList && <BmoRedFilters openBMORedTable={this.openTable()} defaults={this.props.defaults} companyList={dropDownList.coverage} analystList={dropDownList.analyst} industryList={dropDownList.sector} />}
        <BmoRedResultSection slidingTableOpen={slidingTableOpen} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dropDownList: bmoredSelector.getdropdownList(state),
});

const mapDispatchToProps = (dispatch) => ({
  getDropdownList: () => {
    dispatch(GET_BMO_RED_DROPDOWN_LIST());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BmoRedFilterSection);
