import React from 'react';
import PropTypes from 'prop-types';
import SearchFormatter from './SearchFormatter';

const Scenarios = ({ data }) => {
  if (!data || !data.content) return null;
  return (
    <div className="scenarios">
      <div className="">{SearchFormatter(data.content)}</div>
    </div>
  );
};

Scenarios.propTypes = {
  data: PropTypes.object,
};

export default Scenarios;
