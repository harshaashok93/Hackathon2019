import React from 'react';
import PropTypes from 'prop-types';
import SimpleListView from './SimpleListView';

const RatingDowngrades = ({ data }) => {
  if (!data) return null;
  return (
    <div className="rating-upgrades">
      <SimpleListView row={false} data={data} />
    </div>
  );
};

RatingDowngrades.propTypes = {
  data: PropTypes.object
};

export default RatingDowngrades;
