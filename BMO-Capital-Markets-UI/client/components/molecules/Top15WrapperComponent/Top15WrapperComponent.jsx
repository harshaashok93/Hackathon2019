/* @flow weak */

/*
 * Component: Top15WrapperComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Loader } from 'unchained-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  GET_RESULTS,
} from 'store/actions';

import { RichText } from 'components';

import {
  resultSelector,
} from 'store/selectors';
import { mapPropsToChildren } from 'utils/reactutils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './Top15WrapperComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Top15WrapperComponent extends Component {
  props: {
    result: {},
    api_endpoint: '',
    title: '',
    children: {},
    showMonth: bool,
    isDataLoading: bool,
    updatedDate: ''
  };

  state = {
    isDataLoading: false,
  }

  componentWillMount() {
    this.props.getResult(this.props.api_endpoint); //eslint-disable-line
    this.setState({ isDataLoading: this.props.isDataLoading });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isDataLoading: nextProps.isDataLoading });
  }

  render() {
    const { result, title, children, showMonth, updatedDate } = this.props;
    const { isDataLoading } = this.state;

    const resultData = result.data;

    if (!isDataLoading && resultData && !resultData.length) {
      return <div>No results found.</div>;
    }

    return (
      <div className="result-content-section">
        <div className="result-content-container">
          {isDataLoading ? <div className="bmo-red-loader"><Loader active={true} content="Loading..." /></div> : null}
          {!isDataLoading && result.data ?
            <div className="top-15">
              <div className="desktop-container">
                <div className="top-header-15">{showMonth ? `${moment().format('MMMM')} ${(new Date()).getFullYear()} ${title}` : title}</div>
                {mapPropsToChildren(children, { result, desktop: true }) }
              </div>
              <div className="accordion-container">
                {mapPropsToChildren(children, { result, desktop: false }) }
              </div>
              {updatedDate && <RichText richText={updatedDate} className={'updated-company'} />}
              <RichText richText={'* Restricted'} className={'restricted-text'} />
            </div>
            : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  result: resultSelector.getResults(state),
  isDataLoading: resultSelector.getIsResultLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  getResult: async (url) => {
    await dispatch(GET_RESULTS(url));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Top15WrapperComponent);
