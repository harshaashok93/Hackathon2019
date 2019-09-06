import React from 'react';
import PropTypes from 'prop-types';
import PriceTitleTextBlock from './PriceTitleTextBlock';

const OurThesis = ({ data }) => {
  if (!data) return null;
  return (
    <div className="our-thesis">
      <PriceTitleTextBlock data={data} />
    </div>
  );
};

OurThesis.propTypes = {
  data: PropTypes.object
};

export default OurThesis;
