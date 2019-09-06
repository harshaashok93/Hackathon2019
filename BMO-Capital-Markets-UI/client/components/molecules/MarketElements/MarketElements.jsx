/* @flow weak */

/*
 * Component: MarketElements
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { QuantScreeningCards } from 'components';
import { connect } from 'react-redux';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  quantSelector,
  userSelector
} from 'store/selectors';

import {
  GET_QUANT_MARKET_ELEMENT,
} from 'store/actions';

import './MarketElements.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class MarketElements extends Component {
  props: {
    title: '',
    getMarketElementsReport: () => void,
    reportData: [],
    totalCount: number,
    bookmarks: [],
    isLoggedIn: bool,
  };

  static defaultProps = {
  };

  state = {
    currentPageNum: 0,
  };

  componentWillMount() {
    const { currentPageNum } = this.state;
    const data = {
      type: 'ME',
      from: currentPageNum
    };
    this.props.getMarketElementsReport(data);
  }

  onClickShowMore = () => () => {
    const { currentPageNum } = this.state;
    const data = {
      type: 'ME',
      from: currentPageNum + 1
    };
    this.props.getMarketElementsReport(data);
    this.setState({ currentPageNum: currentPageNum + 1 });
  }

  render() {
    const { title, reportData, totalCount, bookmarks, isLoggedIn } = this.props;
    return (
      <div className="market-elements">
        <QuantScreeningCards
          title={title}
          reportData={reportData}
          total={totalCount}
          bookmarks={bookmarks}
          isLoggedIn={isLoggedIn}
          showMoreClick={this.onClickShowMore()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  bookmarks: userSelector.getBookmarkIds(state),
  reportData: quantSelector.getmMrketElementReports(state),
  totalCount: quantSelector.getMarketElementTotalCount(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  getMarketElementsReport: (data) => {
    dispatch(GET_QUANT_MARKET_ELEMENT(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MarketElements);
