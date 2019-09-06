/* @flow weak */

/*
 * Component: StrategyMedia
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Loader } from 'unchained-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  strategySelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StrategyMedia.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyMedia extends Component {
  props: {
    mediaResults: [],
    isloading: bool
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { mediaResults, isloading } = this.props;
    if (isloading) {
      return <div className={'loader-container'}><Loader active={true} content="Loading..." /></div>;
    }
    return (
      <div className="strategy-media">
        <div className={'strategy-media-table'}>
          {
            mediaResults.map((data, i) => {
              const keyProps = i + 1;
              return (
                <div className={'strategy-media-table-row'} key={keyProps}>
                  <div className={'row-column date'}>
                    <span>{moment(data.date).format('MM/DD/YYYY')}</span>
                  </div>
                  <div className={'row-column title'}>
                    <a target="_blank" href={data.link}>
                      <div className={'title'}>
                        {data.title}
                        <span className={'external-link-icon'} />
                      </div>
                    </a>
                  </div>
                  <div className={'row-column description'}>
                    <span>{data.content}</span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  mediaResults: strategySelector.getMediaResult(state),
});
export default connect(mapStateToProps)(StrategyMedia);
