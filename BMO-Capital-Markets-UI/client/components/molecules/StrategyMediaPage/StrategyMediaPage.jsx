/* @flow weak */

/*
 * Component: StrategyMediaPage
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import {
  StrategyMedia
} from 'components';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { connect } from 'react-redux';
import {
  GET_STRATEGY_MEDIA_RESULTS,
} from 'store/actions';

import {
  strategySelector
} from 'store/selectors';
import './StrategyMediaPage.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyMediaPage extends Component {
  props: {
    apiEndPoint: '',
    getResult: () => void,
    media: [],
    isloading: bool,
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.apiEndPoint !== this.props.apiEndPoint) {
      this.props.getResult(nextProps.apiEndPoint);
    }
  }

  componentWillMount() {
    this.props.getResult(this.props.apiEndPoint);
  }

  componentDidMount() {
    // Component ready
  }

  render() {
    const { isloading } = this.props;
    return (
      <div className="strategy-media-page">
        <div className="title-bar">
          <div className="result-column date">
            <span>Date</span>
          </div>
          <div className="result-column title">
            <span>Appearance</span>
          </div>
          <div className="result-column description">
            <span>Summary</span>
          </div>
        </div>
        <StrategyMedia media={this.props.media} isloading={isloading} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  media: strategySelector.getMediaResult(state),
  isloading: strategySelector.getMediaLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResult: async (url) => {
    await dispatch(GET_STRATEGY_MEDIA_RESULTS(url));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategyMediaPage);
