/* @flow weak */

/*
 * Component: ThinkSeriesInnerComponents
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Heading } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { ThinkSeriesEvents, ThinkSeriesVideocasts, ThinkSeriesFlashes } from 'components';
import {
  thinkseriesSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ThinkSeriesInnerComponents.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ThinkSeriesInnerComponents extends Component {
  props: {
    reactComponentName: '',
    title: '',
    events: [],
    flashes: [],
    videocasts: []
  }

  state = {
    // Initialize state here
  }

  componentDidMount() {
    // Component ready
  }

  render() {
    const { reactComponentName, title, events, videocasts, flashes } = this.props;
    let show = false;
    if (reactComponentName === 'ThinkSeriesEvents' && events.length) {
      show = true;
    } else if (reactComponentName === 'ThinkSeriesFlashes' && flashes.length) {
      show = true;
    } else if (reactComponentName === 'ThinkSeriesVideocasts' && videocasts.length) {
      show = true;
    }

    return (
      show ?
        <div className={`think-series-inner-components ${reactComponentName}`}>
          <Heading as={'h3'} className={'section-title'} content={title} />
          {(reactComponentName === 'ThinkSeriesEvents') && <ThinkSeriesEvents /> }
          {(reactComponentName === 'ThinkSeriesVideocasts') && <ThinkSeriesVideocasts /> }
          {(reactComponentName === 'ThinkSeriesFlashes') && <ThinkSeriesFlashes /> }
        </div>
        :
        null
    );
  }
}

const mapStateToProps = (state) => ({
  events: thinkseriesSelector.getEvents(state),
  flashes: thinkseriesSelector.getFlashes(state),
  videocasts: thinkseriesSelector.getVideocats(state),
});

export default connect(mapStateToProps, null)(ThinkSeriesInnerComponents);
