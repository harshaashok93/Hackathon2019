/* @flow weak */

/*
 * Component: QuantPageChildrenComp
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import {
  EquityScreening,
  Commentary,
  MarketElements,
  FocalPoints
} from 'components';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantPageChildrenComp.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantPageChildrenComp extends Component {
  props: {
    componentName: {},
    title: ''
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };
  componentDidMount() {
    // Didmount
  }
  render() {
    const { componentName, title } = this.props;
    return (
      <div className="quant-page-children-comp quantitative-technical">
        <div id={componentName.toLowerCase()} />
        <div>
          {componentName === 'EquityScreeningbyIndustry' && <EquityScreening title={title} />}
          {componentName === 'Commentary' && <Commentary title={title} />}
          {componentName === 'MarketElements' && <MarketElements title={title} />}
          {componentName === 'FocalPoints' && <FocalPoints title={title} />}
        </div>
      </div>
    );
  }
}

export default QuantPageChildrenComp;
