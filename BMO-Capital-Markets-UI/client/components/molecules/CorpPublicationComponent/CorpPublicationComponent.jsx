/* @flow weak */

/*
 * Component: CorpPublicationComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { RichText, PublicationCardSmall } from 'components';
import { connect } from 'react-redux';
import moment from 'moment';
import { List, Button, Loader } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  librarySelector,
  userSelector
} from 'store/selectors';
import {
  GET_CORP_PUBLICATION
} from 'store/actions';
import './CorpPublicationComponent.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CorpPublicationComponent extends Component {
  props: {
    getCorpPublicationData: () => void,
    isloading: bool,
    corpPublicationData: {
      hits: []
    },
    richText: '',
    bookmarks: []
  };

  static defaultProps = {
  };

  state = {
    corpPublicationData: [],
    reqParam: {}
  };

  componentDidMount() {
    // Component ready
  }
  componentWillMount() {
    const searchDef = window.unchainedSite && window.unchainedSite.SearchDefaults;
    const content = JSON.parse(searchDef && searchDef.Library && searchDef.Library.content);
    const dateField = (content.date_field || 28) * 7;
    const reqParam = {
      gics: '',
      location: ['all', 'us', 'canada', 'other'],
      research_type: ['report', 'comment', 'flash', 'periodical'],
      from: 0,
      size: 3,
      search_type: '',
      search_val: '',
      sort_order: 'desc',
      sort_type: 'publisher_date',
      from_date: moment().subtract(dateField, 'days').format('YYYY-MM-DD'),
      to_date: moment().format('YYYY-MM-DD'),
    };
    this.setState({ reqParam });
    this.props.getCorpPublicationData(reqParam);
  }
  componentWillReceiveProps(next) {
    if (next.corpPublicationData && this.state.corpPublicationData !== next.corpPublicationData.hits) {
      this.setState({ corpPublicationData: next.corpPublicationData.hits });
    }
  }
  showMore = () => {
    const reqParam = this.state.reqParam;
    reqParam.size += 3;
    this.setState({ reqParam });
    this.props.getCorpPublicationData(reqParam);
  }
  render() {
    const { richText, bookmarks, isloading } = this.props;
    const { corpPublicationData } = this.state;
    return (
      <div className="corp-publication-component">
        <RichText richText={richText} />
        <div className="publications">
          <List className={'result-cards'}>
            {
              corpPublicationData && corpPublicationData.map((publicationCard) => {
                return (
                  <List.Item key={publicationCard._source.productID}>
                    <PublicationCardSmall
                      data={publicationCard}
                      bookmarks={bookmarks}
                      isLoggedIn={true}
                      parentComponent={'Strategy'}
                    />
                  </List.Item>
                );
              })
            }
          </List>
        </div>
        {
          corpPublicationData ?
            <div className="show-more-btn-holder">
              {
                isloading ?
                  <Loader active={true} content="Loading..." />
                  :
                  <Button content="Show More" onClick={this.showMore} className="show-more-btn dropdown-chevron bmo_chevron bottom" />
              }
            </div>
            : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  corpPublicationData: librarySelector.getCorpPublicationData(state),
  bookmarks: userSelector.getBookmarkIds(state),
  isloading: librarySelector.getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getCorpPublicationData: (apiData) => {
    dispatch(GET_CORP_PUBLICATION(apiData));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CorpPublicationComponent);
