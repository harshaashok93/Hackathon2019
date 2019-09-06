/* @flow weak */

/*
 * Component: ThinkSeriesWrapper
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  GET_THINK_SERIES_RESULTS,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ThinkSeriesWrapper.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ThinkSeriesWrapper extends Component {
  props: {
    getResult: () => void,
    children: '',
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    const reqParameter = {
      events: {
        page: 1,
        rows: 2
      },
      videocasts: {
        page: 1,
        rows: 2
      },
      flashes: {
        page: 1,
        rows: 2
      },
    };
    this.props.getResult(reqParameter);
  }

  render() {
    const { children } = this.props;
    return (
      <div className="think-series-wrapper">
        {children}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getResult: async (reqParameter) => {
    dispatch(GET_THINK_SERIES_RESULTS(reqParameter));
  }
});

export default connect(null, mapDispatchToProps)(ThinkSeriesWrapper);
