/* @flow weak */

/*
 * Component: StrategyResultWrapper
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  GET_STRATEGY_REPORTS_RESULT,
  GET_STRATEGY_VIDEOCASTS_RESULTS,
  GET_STRATEGY_MEDIA_RESULTS
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StrategyResultWrapper.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyResultWrapper extends Component {
  props: {
    children: '',
    getStrategyReportsData: () => void,
    getStrategyLandingVideocastsData: () => void,
    getStrategyLandingMediaData: () => void,
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
    const data = {
      fromDate: moment().subtract(180, 'days').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      filter: 'all',
      from: 0,
      size: 3,
      sort_by: 'date',
      sort_type: 'desc',
      sub_filter: ''
    };
    const videocastReqParameter = {
      order: 'desc',
      page: 0,
    };
    this.props.getStrategyReportsData(data);
    this.props.getStrategyLandingVideocastsData('/strategy/getAllStrategyVideocasts/', videocastReqParameter);
    this.props.getStrategyLandingMediaData('/strategy/getAllStrategyMedia/');
  }

  render() {
    const { children } = this.props;
    return (
      <div className="strategy-result-wrapper">
        {children}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getStrategyReportsData: (data) => {
    dispatch(GET_STRATEGY_REPORTS_RESULT(data));
  },
  getStrategyLandingVideocastsData: (url, videocastReqParameter) => {
    dispatch(GET_STRATEGY_VIDEOCASTS_RESULTS(url, videocastReqParameter, true));
  },
  getStrategyLandingMediaData: (url) => {
    dispatch(GET_STRATEGY_MEDIA_RESULTS(url, true));
  }
});

export default connect(null, mapDispatchToProps)(StrategyResultWrapper);
