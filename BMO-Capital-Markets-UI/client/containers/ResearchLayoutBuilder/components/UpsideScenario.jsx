import React from 'react';
import PropTypes from 'prop-types';
import PriceTitleTextBlock from './PriceTitleTextBlock';

const UpsideScenario = ({ data }) => {
  if (!data) return null;
  return (
    <div className="upside-scenario">
      <PriceTitleTextBlock data={data} />
    </div>
  );
};

UpsideScenario.propTypes = {
  data: PropTypes.object
};

export default UpsideScenario;
