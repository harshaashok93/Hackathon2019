/* @flow weak */

/*
 * Component: FeaturedResearchResults
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { List, Loader, Button, Icon } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { PublicationCardSmall } from 'components';
import st from 'constants/strings';
import {
  userSelector,
  resultSelector,
  librarySelector
} from 'store/selectors';

import {
  GET_MOST_RECENT_DATA,
  SET_LAST_FETCHED_NOTIFICATION_ID,
  UPDATE_SHOW_MORE_OR_LESS_FILTER
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FeaturedResearchResults.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FeaturedResearchResults extends Component {
  props: {
    result: [],
    isLoggedIn: bool,
    bookmarks: [],
    isDataLoading: bool,
    mostRecentTotal: number,
    api: '',
    getMostRecentData: () => void,
    resetApiResult: () => void,
    isMostRecentPage: bool,
    resetFetchedNotificationId: () => void,
    updateShowMoreOrLessFilter: () => void,
    details: bool,
    showMoreText: '',
    showLessText: '',
    isExpand: bool,
    profile: {},
  };

  static defaultProps = {
    showMoreText: 'Show More Detail',
    showLessText: 'Show Less Detail',
  };

  state = {
    page: 1,
  }

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    const { api, isMostRecentPage, getMostRecentData, profile, resetApiResult } = this.props;
    if (isMostRecentPage) {
      const filters = {
        page_number: 1
      };
      resetApiResult();
      if (profile.can_follow_content) {
        getMostRecentData(api, filters);
      }
    }
  }

  componentWillUnmount() {
    const { resetFetchedNotificationId } = this.props;
    resetFetchedNotificationId(0);
  }

  onShowMore = () => () => {
    const { getMostRecentData, api } = this.props;
    const { page } = this.state;
    const filters = {
      page_number: page + 1,
    };
    this.setState({ page: page + 1 }, () => {
      getMostRecentData(api, filters);
    });
  }

  showDetails = () => {
    this.props.updateShowMoreOrLessFilter();
  }

  getResultsMarkup() {
    const { result, isExpand, bookmarks, isLoggedIn } = this.props;

    return (
      <List className={`result-cards expand-${isExpand.toString()}`}>
        {
          result.map((publicationCard) => {
            return (
              <List.Item key={Math.random()}>
                <PublicationCardSmall
                  bookmarks={bookmarks}
                  data={publicationCard}
                  isLoggedIn={isLoggedIn}
                  parentComponent={'Featured Research'}
                />
              </List.Item>
            );
          })
        }
      </List>
    );
  }

  render() {
    const { isDataLoading, result, mostRecentTotal, isMostRecentPage, details, showMoreText, showLessText } = this.props;
    const { page } = this.state;
    const resultLength = Object.keys(result).length;
    if (!result || result.data) return null;

    if (isMostRecentPage && isDataLoading && page === 1) {
      return <Loader active={true} content="Loading..." />;
    }

    if (!isMostRecentPage && isDataLoading) {
      return <Loader active={true} content="Loading..." />;
    }

    return (
      <div>
        <div className="featured-research-results publication-search-result">
          <div className="title-bar desktop-view">
            <div className={'mobile-wrapper'}>
              <div className="result-column icon date">
                <span className={'date'}>{'Date'}</span>
              </div>
              <div className="result-column icon author">
                <span className={'author'}>{'Author'}</span>
              </div>
              <div className="result-column icon ticker">
                <span className={'ticker'}>{'Ticker'}</span>
              </div>
              <div className="result-column icon subject">
                <span className={'title'}>{'Subject'}</span>
              </div>
              <div className="result-column icon user-pref intro-show-more-section">
                <Button className="linkBtn btn-text-color" onClick={() => this.showDetails()}>
                  <span >{!details ? showMoreText : showLessText }</span>
                  <Icon className="showMoreLessIcon" name={!details ? 'angle down' : 'angle up'} title={st.showMoreLess} />
                </Button>
              </div>
            </div>
          </div>
          {resultLength ?
            this.getResultsMarkup()
            : <div className={'no-results-found'}>No Results Found</div>
          }
          {resultLength > 0 && isMostRecentPage &&
            <div className={'show-more'}>
              {
                isDataLoading && (
                  <div className="load-more-button"><div className="load-more">{'Loading...'}</div></div>
                )
              }
              { !isDataLoading && (page < mostRecentTotal) ?
                <Button onClick={this.onShowMore()} className="linkBtn bmo_chevron bottom">{'Show More'}</Button>
                : null
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  bookmarks: userSelector.getBookmarkIds(state),
  isDataLoading: resultSelector.getIsResultLoading(state),
  mostRecentTotal: resultSelector.getMostRecentTotal(state),
  isExpand: librarySelector.getShowMoreOrLess(state),
  details: librarySelector.getShowMoreOrLess(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateShowMoreOrLessFilter: () => {
    dispatch(UPDATE_SHOW_MORE_OR_LESS_FILTER());
  },

  getMostRecentData: (url, data) => {
    dispatch(GET_MOST_RECENT_DATA(url, data));
  },

  resetFetchedNotificationId: (notificationId) => {
    dispatch({ type: SET_LAST_FETCHED_NOTIFICATION_ID, data: notificationId });
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(FeaturedResearchResults);
