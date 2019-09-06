/* @flow weak */

/*
 * Component: StrategyVideoCastsPage
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Icon } from 'unchained-ui-react';
import {
  StrategyVideocast
} from 'components';
import { connect } from 'react-redux';
import {
  GET_STRATEGY_VIDEOCASTS_RESULTS,
} from 'store/actions';
import {
  strategySelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  numberWithCommas
} from 'utils';

import './StrategyVideoCastsPage.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyVideoCastsPage extends Component {
  props: {
    apiEndPoint: '',
    getResult: () => void,
    videocastsData: [],
    isloading: bool,
    total: number
  };

  static defaultProps = {
  };

  state = {
    sortOrder: 'desc',
    noOfResultRow: 9
  };

  pageScrollPosition = '';
  resetScrollPosition = false;

  toggleState = () => {
    this.pageScrollPosition = document.getElementById('strategy-videocast-date-sort').offset;
    const { sortOrder } = this.state;
    let sortOrderText = 'desc';
    if (sortOrder === 'desc') {
      sortOrderText = 'asc';
    }
    const reqParameter = {
      page: 0,
      order: sortOrder,
    };
    this.setState({ sortOrder: sortOrderText }, () => {
      this.props.getResult(this.props.apiEndPoint, reqParameter);
    });
  }

  getLoadMoreResult = (pageNum) => {
    this.pageScrollPosition = document.getElementById('strategy-video-load-more').offsetTop;
    const { sortOrder } = this.state;
    const reqParameter = {
      page: pageNum,
      order: sortOrder,
    };
    this.props.getResult(this.props.apiEndPoint, reqParameter);
  }

  componentWillMount() {
    const { sortOrder } = this.state;
    const reqParameter = {
      page: 0,
      order: sortOrder,
    };
    this.props.getResult(this.props.apiEndPoint, reqParameter);
  }

  componentWillReceiveProps(nextProps) {
    this.resetScrollPosition = false;
    this.reverseScrollPosition = false;
    if (nextProps.videocastsData && this.state.noOfResultRow < nextProps.videocastsData.length && this.pageScrollPosition) {
      this.resetScrollPosition = true;
    } else if (nextProps.videocastsData && this.state.noOfResultRow >= nextProps.videocastsData.length && this.pageScrollPosition) {
      this.reverseScrollPosition = true;
    }
    this.setState({ noOfResultRow: nextProps.videocastsData.length });
  }

  componentDidUpdate() {
    if ((this.resetScrollPosition || this.reverseScrollPosition) && this.pageScrollPosition) {
      window.scrollTo(0, this.pageScrollPosition);
    }
  }

  render() {
    const { sortOrder } = this.state;
    const { isloading, videocastsData, total } = this.props;
    return (
      <div className="strategy-video-casts-page">
        <div className={'result-count'}>{numberWithCommas(total)} {'Results'}</div>
        <div className="date-sort" id={'strategy-videocast-date-sort'}>
          <Button className={'linkBtn'} onClick={() => this.toggleState('publisher_date')}>
            <span className={'underline'}>{'Date'}</span>
            <Icon name={(sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Date'} />
          </Button>
        </div>
        <StrategyVideocast
          sortOrder={sortOrder}
          videocastsData={videocastsData}
          parentComponent={'Strategy'}
          isloading={isloading}
          getResults={this.getLoadMoreResult}
          total={total}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  videocastsData: strategySelector.getVideoResult(state),
  isloading: strategySelector.getVideoLoading(state),
  total: strategySelector.getVideocastTotal(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResult: async (url, videocastReqParameter) => {
    await dispatch(GET_STRATEGY_VIDEOCASTS_RESULTS(url, videocastReqParameter));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategyVideoCastsPage);
