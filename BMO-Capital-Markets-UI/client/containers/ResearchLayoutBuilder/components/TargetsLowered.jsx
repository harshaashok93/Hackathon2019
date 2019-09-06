import React from 'react';
import PropTypes from 'prop-types';
import SimpleListView from './SimpleListView';

const TargetsLowered = ({ data }) => {
  if (!data) return null;
  return (
    <div className="targets-lowered">
      <SimpleListView row={false} data={data} />
    </div>
  );
};

TargetsLowered.propTypes = {
  data: PropTypes.object
};

export default TargetsLowered;
