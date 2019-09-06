/* @flow weak */

/*
 * Component: QuantitativeTechnical
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Heading, Button } from 'unchained-ui-react';
import { EquityScreening } from 'components';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantitativeTechnical.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantitativeTechnical extends Component {
  props: {
    price: ''
  };

  static defaultProps = {
    price: 'Priced Dec. 19, 2017'
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { price } = this.props;
    return (
      <div className="quantitative-technical">
        <div className="head-section">
          <Heading className="page-title" content={'BMO Trends & Inflection Points'} />
          <div className="button-and-price">
            <Button primary className="tips-btn" content={'TIPS'} />
            <span className="price-text"> {price} </span>
          </div>
        </div>
        <span className="hl" />
        <EquityScreening />
      </div>
    );
  }
}

export default QuantitativeTechnical;
