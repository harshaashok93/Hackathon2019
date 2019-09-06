import React from 'react';
import PropTypes from 'prop-types';
import PriceTitleTextBlock from './PriceTitleTextBlock';

const KeyCatalysts = ({ data }) => {
  if (!data) return null;
  return (
    <div className="key-catalysts">
      <PriceTitleTextBlock data={data} />
    </div>
  );
};

KeyCatalysts.propTypes = {
  data: PropTypes.object
};

export default KeyCatalysts;
