/* @flow weak */

/*
 * Component: AdminSearchSelectionPage
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { AdminSearchSelectionPannel, AdminPageTopComponent } from 'components';
import { StaticContentContainer } from 'containers';
import { connect } from 'react-redux';
import { Loader } from 'unchained-ui-react';
import {
  GET_DEFAULT_SEARCH_RESULT_DATA,
} from 'store/actions';
import {
  adminSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminSearchSelectionPage.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminSearchSelectionPage extends Component {
  props: {
    defaultSearch: [],
    getDefaultSearchResult: () => void,
  };

  static defaultProps = {
  };

  state = {
  }

  componentDidMount() {
    //
  }

  componentWillMount() {
    this.props.getDefaultSearchResult();
    document.title = 'Search Defaults';
  }

  render() {
    const { defaultSearch } = this.props;
    return (
      <div className="admin-registration-page">
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Header' : 'CorporateDebt-Header'} />
        <AdminPageTopComponent />
        { defaultSearch.length > 0 ? <AdminSearchSelectionPannel defaultSearch={defaultSearch} /> : <Loader active={true} content="Loading..." /> }
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Footer' : 'CorporateDebt-Footer'} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defaultSearch: adminSelector.getDefaultSearch(state),
});

const mapDispatchToProps = (dispatch) => ({
  getDefaultSearchResult: () => {
    dispatch(GET_DEFAULT_SEARCH_RESULT_DATA());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminSearchSelectionPage);
