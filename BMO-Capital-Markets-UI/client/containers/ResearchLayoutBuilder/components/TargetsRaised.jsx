import React from 'react';
import PropTypes from 'prop-types';
import SimpleListView from './SimpleListView';

const TargetsRaised = ({ data }) => {
  if (!data) return null;
  return (
    <div className="target-raised">
      <SimpleListView row={false} data={data} />
    </div>
  );
};

TargetsRaised.propTypes = {
  data: PropTypes.object
};

export default TargetsRaised;
