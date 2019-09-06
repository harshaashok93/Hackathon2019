import React from 'react';
import PropTypes from 'prop-types';
import CommonBMOTable from './CommonBMOTable';

const ConsensusEstimates = ({ data }) => {
  if (!data) return null;
  return (
    <div className="company-data">
      <CommonBMOTable data={data} />
    </div>
  );
};

ConsensusEstimates.propTypes = {
  data: PropTypes.object
};

export default ConsensusEstimates;
