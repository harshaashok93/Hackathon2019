/* @flow weak */

/*
 * Component: GraphData
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Modal } from 'unchained-ui-react';
import { connect } from 'react-redux';
import {
  GET_GRAPH_HACK_DATA
} from 'store/actions';
import {
  bmomodelsSelector,
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './GraphData.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class GraphData extends Component {
  props: {
    getdata: () => void,
    data: []//eslint-disable-line
  };

  static defaultProps = {
  };

  state = {

  };

  componentWillMount() {
    this.props.getdata();
  }

  componentWillUnmount() {

  }

  render() {

    return (
     <div className={'graph-data'}></div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: bmomodelsSelector.getgraphdata(state),
});

const mapDispatchToProps = (dispatch) => ({
  getdata: () => {
    dispatch(GET_GRAPH_HACK_DATA());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphData);
