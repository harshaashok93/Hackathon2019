import React from 'react';
import PropTypes from 'prop-types';
import SimpleListView from './SimpleListView';

const CompanyUpdates = ({ data }) => {
  if (!data) return null;
  return (
    <div className="macro-and-sector-updates">
      <SimpleListView row={false} data={data} />
    </div>
  );
};

CompanyUpdates.propTypes = {
  data: PropTypes.object
};

export default CompanyUpdates;
