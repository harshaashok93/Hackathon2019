/* @flow weak */

/*
 * Component: StrategyVideoBanner
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { RichText } from 'components';
import { Image } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StrategyVideoBanner.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StrategyVideoBanner extends Component {
  props: {
    richText: {},
    videoImage: '',
    videoLink: ''
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
    const { richText, videoImage, videoLink } = this.props;//eslint-disable-line
    return (
      <div className="strategy-video-banner">
        <div className={'details'} >
          <RichText richText={richText} />
          <Image className={'video-play'} src={videoImage} alt={'strategy banner image'} />
        </div>
      </div>
    );
  }
}

export default StrategyVideoBanner;
