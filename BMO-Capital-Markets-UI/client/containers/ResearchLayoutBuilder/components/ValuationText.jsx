import React from 'react';
import PropTypes from 'prop-types';
import PriceTitleTextBlock from './PriceTitleTextBlock';

const ValuationText = ({ data }) => {
  if (!data) return null;
  return (
    <div className="valuation-text">
      <PriceTitleTextBlock data={data} />
    </div>
  );
};

ValuationText.propTypes = {
  data: PropTypes.object
};

export default ValuationText;
