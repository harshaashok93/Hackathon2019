import React from 'react';
import PropTypes from 'prop-types';
import PriceTitleTextBlock from './PriceTitleTextBlock';

const DownsideScenario = ({ data }) => {
  if (!data) return null;
  return (
    <div className="downside-scenario">
      <PriceTitleTextBlock data={data} />
    </div>
  );
};

DownsideScenario.propTypes = {
  data: PropTypes.object
};

export default DownsideScenario;
