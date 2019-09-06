import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'unchained-ui-react';

const DisclosureCharts = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="disclosure-charts">
      {
        data.map(d => <Image key={Math.random()} src={d} />)
      }
    </div>
  );
};

DisclosureCharts.propTypes = {
  data: PropTypes.array
};

export default DisclosureCharts;
