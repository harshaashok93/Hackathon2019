/* @flow weak */

/*
 * Component: FocalPoints
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
  GET_QUANT_FOCAL_POINT,
} from 'store/actions';
import './FocalPoints.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FocalPoints extends Component {
  props: {
    title: '',
    getFocalPointReport: () => void,
    reportData: [],
    totalCount: number,
    bookmarks: [],
    isLoggedIn: bool,
  };

  static defaultProps = {
  };

  state = {
    currentPageNum: 0
  };

  componentWillMount() {
    const { currentPageNum } = this.state;
    const data = {
      type: 'FOCL',
      from: currentPageNum
    };
    this.props.getFocalPointReport(data);
  }

  onClickShowMore = () => () => {
    const { currentPageNum } = this.state;
    const data = {
      type: 'FOCL',
      from: currentPageNum + 1
    };
    this.props.getFocalPointReport(data);
    this.setState({ currentPageNum: currentPageNum + 1 });
  }

  render() {
    const { title, reportData, totalCount, bookmarks, isLoggedIn } = this.props;
    return (
      <div className="focal-points">
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
  reportData: quantSelector.getFocalPointReports(state),
  totalCount: quantSelector.getFocalPointTotalCount(state),
  bookmarks: userSelector.getBookmarkIds(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  getFocalPointReport: (data) => {
    dispatch(GET_QUANT_FOCAL_POINT(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FocalPoints);
