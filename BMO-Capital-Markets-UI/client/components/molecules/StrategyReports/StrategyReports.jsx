/* @flow weak */

/*
 * Component: StrategyReports
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { PublicationCardSmall } from 'components';
import { List } from 'unchained-ui-react';
import { connect } from 'react-redux';
import {
  userSelector,
  strategySelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StrategyReports.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyReports extends Component {
  props: {
    bookmarks: [],
    isLoggedIn: bool,
    strategyReportsData: [],
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };


  render() {
    const { strategyReportsData, isLoggedIn, bookmarks } = this.props; //eslint-disable-line
    const displayData = strategyReportsData;
    return (
      <div className="strategy-reports">
        <List className={'result-cards'}>
          {
            displayData && displayData.map((publicationCard) => {
              return (
                <List.Item key={publicationCard._source.productID}>
                  <PublicationCardSmall
                    bookmarks={bookmarks}
                    data={publicationCard}
                    isLoggedIn={isLoggedIn}
                    parentComponent={'Strategy'}
                  />
                </List.Item>
              );
            })
          }
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  bookmarks: userSelector.getBookmarkIds(state),
  strategyReportsData: strategySelector.getStrategyLandingPage(state),
});
export default connect(mapStateToProps)(StrategyReports);
