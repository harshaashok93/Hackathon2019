/* @flow weak */

/*
 * Component: Commentary
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
  GET_QUANT_COMMENTARY,
} from 'store/actions';

import './Commentary.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Commentary extends Component {
  props: {
    title: '',
    getCommentaryReports: () => void,
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
      type: 'TIPS',
      from: currentPageNum
    };
    this.props.getCommentaryReports(data);
  }

  onClickShowMore = () => () => {
    const { currentPageNum } = this.state;
    const data = {
      type: 'TIPS',
      from: currentPageNum + 1
    };
    this.props.getCommentaryReports(data);
    this.setState({ currentPageNum: currentPageNum + 1 });
  }

  render() {
    const { title, reportData, totalCount, bookmarks, isLoggedIn } = this.props;
    return (
      <div className="commentary">
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
  reportData: quantSelector.getCommentaryReports(state),
  totalCount: quantSelector.getCommentaryTotalCount(state),
  bookmarks: userSelector.getBookmarkIds(state),
  isLoggedIn: userSelector.getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  getCommentaryReports: (data) => {
    dispatch(GET_QUANT_COMMENTARY(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Commentary);
