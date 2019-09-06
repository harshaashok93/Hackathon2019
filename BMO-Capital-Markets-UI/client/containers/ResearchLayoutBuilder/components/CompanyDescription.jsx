import React from 'react';
import PropTypes from 'prop-types';
import PriceTitleTextBlock from './PriceTitleTextBlock';

const CompanyDescription = ({ data }) => {
  if (!data) return null;
  return (
    <div className="company-description">
      <PriceTitleTextBlock data={data} />
    </div>
  );
};

CompanyDescription.propTypes = {
  data: PropTypes.object
};

export default CompanyDescription;
