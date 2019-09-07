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
import DonutChart from 'react-donut-chart';
import { NavLink } from 'react-router-dom';
import {
  GET_GRAPH_HACK_DATA
} from 'store/actions';
import {
  bmomodelsSelector,
  userSelector
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
    data: [],
    profile: {}
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
  getUserData = () => (e) => {
    window.location.replace(`/admin/?stat=${e.label}&page=1`);
  }

  render() {
    const colorDataStatus = ['#0079C1', '#054A72', '#2591D0', '#58BAF3', '#2E6280'];
    const colorDatalinked = ['#0079C1', '#054A72'];
    const { profile, data } = this.props;
    return (
     <div className={'graph-data'} >
        {profile.is_superuser ?
          <div style={{ display: 'inline-block', width: '100%' }}>
            <DonutChart
              data={data.status}
              onClick={this.getUserData()}
              colors={colorDataStatus}
              height={400}
              width={400}
              style={{ display: 'inline-block', width: '50%', 'vertical-align': 'top' }}
            />
            <DonutChart
              data={data.linked}
              colors={colorDatalinked}
              height={400}
              width={400}
              style={{ display: 'inline-block', width: '50%', 'vertical-align': 'top' }}
            />
          </div>
          :
          null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: bmomodelsSelector.getgraphdata(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  getdata: () => {
    dispatch(GET_GRAPH_HACK_DATA());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphData);
