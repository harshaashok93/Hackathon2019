import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'unchained-ui-react';

const ScenarioChart = ({ data, productId }) => (
  data === true ?
    <Image
      className="scenario-chart"
      src={`/api/v1/publication/getImage/?publication_id=${productId}&image_id=scenario_chart`}
    /> : null
);

ScenarioChart.propTypes = {
  data: PropTypes.boolean,
  productId: PropTypes.string
};

export default ScenarioChart;
