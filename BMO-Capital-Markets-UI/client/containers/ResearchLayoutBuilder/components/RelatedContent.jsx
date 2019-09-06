import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PublicationCardSmall } from 'components';
import {
  userSelector
} from 'store/selectors';

class RelatedContent extends Component {
  props: {
    data: {},
    isAuthenticated: boolean,
    bookmarks: []//eslint-disable-line
  }

  render() {
    const { data, isAuthenticated, bookmarks } = this.props;

    return (
      <div className="related-content">
        <div id="research-related-content" />
        <h2 className="heading">You might also be interested in</h2>
        <div className="list-container">
          <ul>
            {
              data.map((row, i) => {
                return (
                  <PublicationCardSmall
                    bookmarks={bookmarks}
                    data={row}
                    isLoggedIn={isAuthenticated}
                    parentComponent={'Related Content'}
                    key={`${i + 1}`}
                  />
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: userSelector.getIsLoggedIn(state),
  bookmarks: userSelector.getBookmarkIds(state)
});

const mapDispatchToProps = (dispatch) => ({ // eslint-disable-line
  updateProfileBookmarksData: (data, allBookmarks) => {
    dispatch(UPDATE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  },
  removeProfileBookmarksData: (data, allBookmarks) => {
    dispatch(REMOVE_PROFILE_BOOKMARKS_DATA('publication', data, allBookmarks));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RelatedContent);
