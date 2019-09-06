import React from 'react';
import PropTypes from 'prop-types';
import PriceTitleTextBlock from './PriceTitleTextBlock';

const WhatsInside = ({ data }) => {
  if (!data) return null;
  return (
    <div className="whats-inside">
      <PriceTitleTextBlock data={data} />
    </div>
  );
};

WhatsInside.propTypes = {
  data: PropTypes.object
};

export default WhatsInside;
