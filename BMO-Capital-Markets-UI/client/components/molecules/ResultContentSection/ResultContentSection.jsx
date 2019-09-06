/* @flow weak */

/*
 * Component: ResultContentSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { ResultContentContainer } from 'containers';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ResultContentSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ResultContentSection extends Component {
  props: {
    //
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
    return (
      <div className="result-content-section">
        <ResultContentContainer data={this.props} />
      </div>
    );
  }
}

export default ResultContentSection;
