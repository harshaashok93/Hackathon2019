import React from 'react';
import PropTypes from 'prop-types';
import CommonBMOTable from './CommonBMOTable';

const ResearchCompanyModelLinks = ({ data }) => {
  if (!data) return null;
  return (
    <div className="company-data">
      <CommonBMOTable data={data} />
    </div>
  );
};

ResearchCompanyModelLinks.propTypes = {
  data: PropTypes.object
};

export default ResearchCompanyModelLinks;
