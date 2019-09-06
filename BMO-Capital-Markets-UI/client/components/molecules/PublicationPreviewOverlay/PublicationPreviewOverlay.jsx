/* @flow weak */

/*
 * Component: PublicationPreviewOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { RichText } from 'components';
import { Heading, Button } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './PublicationPreviewOverlay.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class PublicationPreviewOverlay extends Component {
  props: {
    data: [],
    gtmData: {}
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    const { data, gtmData } = this.props;
    pushToDataLayer('strategy', 'strategyPreviewClick', { label: data.title, data: gtmData });
    pushToDataLayer('strategy', 'loadPreviewOverlay');
  }

  render() {
    const { data } = this.props;
    return (
      <div className="publication-preview-overlay">
        <div className={'publication-right-section'}>
          <Heading as={'h4'} className={'title'} content={data.title} />
          <div className="comment-section">
            <div className="comment">
              <span className="comment-description"><RichText richText={data.bottom_line || data.key_points || ''} /></span>
              ... <NavLink to={`/research/${data.product_id}/`}><Button className={'linkBtn'} content={'(more)'} /></NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PublicationPreviewOverlay;
