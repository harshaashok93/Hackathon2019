/* @flow weak */

/*
 * Component: QuantPageWrapper
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  GET_QUANT_DATA,
  GET_TIPS_DATA
} from 'store/actions';
import {
  quantSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantPageWrapper.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantPageWrapper extends Component {
  props: {
    children: {},
    getQuantData: () => void,
    getTipsData: () => void,
    lastUpdatedDate: ''
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };
  componentWillMount() {
    this.props.getQuantData();
    this.props.getTipsData();
  }
  componentDidMount() {
    // Component ready
  }

  render() {
    const { children, lastUpdatedDate } = this.props;
    return (
      <div className="result-content-section">
        <div className="result-content-container">
          {children}
          <div className={'last-updated'}>Last Updated: {lastUpdatedDate}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  result: quantSelector.getTipsData(state),
  lastUpdatedDate: quantSelector.getLastUpdateDate(state),
});

const mapDispatchToProps = (dispatch) => ({
  getQuantData: async () => {
    dispatch(GET_QUANT_DATA());
  },
  getTipsData: async () => {
    dispatch(GET_TIPS_DATA());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuantPageWrapper);
