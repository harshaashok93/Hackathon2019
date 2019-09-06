/* @flow weak */

/*
 * Component: QuantTipsButtonSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Heading, Button } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import {
  quantSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QuantTipsButtonSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QuantTipsButtonSection extends Component {
  props: {
    title: '',
    buttonText: '',
    to: '',
    pricedDate: ''
  };

  static defaultProps = {
  };

  state = {
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { title, buttonText, to, pricedDate } = this.props;
    return (
      <div className="quant-tips-button-section quantitative-technical">
        <div className="head-section">
          <Heading className="page-title" content={title} />
          <div className="button-and-price">
            <NavLink to={to.url}>
              <Button primary className="tips-btn" content={buttonText} />
            </NavLink>
            {
              pricedDate ?
                <span className="price-text">{pricedDate}</span>
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pricedDate: quantSelector.getQuantPricedDate(state),
});

export default connect(mapStateToProps, null)(QuantTipsButtonSection);
