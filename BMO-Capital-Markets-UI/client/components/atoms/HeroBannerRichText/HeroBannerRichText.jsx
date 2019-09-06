/* @flow weak */

/*
 * Component: HeroBannerRichText
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button } from 'unchained-ui-react';
import truncate from 'lodash/truncate';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './HeroBannerRichText.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class HeroBannerRichText extends Component {
  props: {
    content: '',
  };

  static defaultProps = {
  };

  state = {
    displayMore: false,
    contentLength: 0,
  };

  componentWillMount() {
    this.setTextContentLimit(this.props.content);
  }

  setTextContentLimit = (content = []) => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 480) {
      this.setState({ contentLength: 170 });
    } else if (windowWidth > 480 && windowWidth <= 700) {
      this.setState({ contentLength: 240 });
    } else if (windowWidth > 700 && windowWidth <= 992) {
      this.setState({ contentLength: 320 });
    } else if (windowWidth > 992 && windowWidth <= 1024) {
      this.setState({ contentLength: content.length + 1 });
    } else if (windowWidth > 1024) {
      this.setState({ contentLength: content.length + 1 });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.content !== nextProps.content) {
      this.setState({ displayMore: false });
      this.setTextContentLimit(nextProps.content);
    }
  }

  renderShowmoreshowless = (displayMore) => {
    if (displayMore) {
      return (
        <Button
          className="blue-angle-icon active"
          title="Show Less"
          onClick={() => this.setState({ displayMore: false })}
        >
          {''}
        </Button>
      );
    }
    return (
      <Button
        className="blue-angle-icon"
        title="Show More"
        onClick={() => this.setState({ displayMore: true })}
      >
        {''}
      </Button>
    );
  }

  render() {
    const { content } = this.props;
    const { displayMore, contentLength } = this.state;
    return (
      <div className="hero-banner-rich-text">
        <div className="hero-banner-rich-text-container">
          {content.length < contentLength ? (
            <p className="hero-banner-rich-text-content">{content}</p>
          ) : (
            <div>
              {displayMore ? (
                <p
                  className="hero-banner-rich-text-content"
                >
                  {content}
                </p>
              ) : (
                <p
                  className="hero-banner-rich-text-content"
                >
                  {`${truncate(content, { length: contentLength })}`}
                </p>
              )}
            </div>
          )}
          {content.length > contentLength ?
            this.renderShowmoreshowless(displayMore)
            :
            null
          }
        </div>
      </div>
    );
  }
}

export default HeroBannerRichText;
