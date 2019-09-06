import React from 'react';
import PropTypes from 'prop-types';
import CommonBMOTable from './CommonBMOTable';

const Valuation = ({ data }) => {
  if (!data) return null;
  return (
    <div className="company-data">
      <CommonBMOTable data={data} />
    </div>
  );
};

Valuation.propTypes = {
  data: PropTypes.object
};

export default Valuation;
