import React from 'react';
import PropTypes from 'prop-types';
import CommonBMOTable from './CommonBMOTable';

const BMOEstimates = ({ data }) => {
  if (!data) return null;
  return (
    <div className="company-data">
      <CommonBMOTable data={data} />
    </div>
  );
};

BMOEstimates.propTypes = {
  data: PropTypes.object
};

export default BMOEstimates;
