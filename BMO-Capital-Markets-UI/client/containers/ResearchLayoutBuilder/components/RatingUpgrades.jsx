import React from 'react';
import PropTypes from 'prop-types';
import SimpleListView from './SimpleListView';

const RatingUpgrades = ({ data }) => {
  if (!data) return null;
  return (
    <div className="rating-upgrades">
      <SimpleListView row={false} data={data} />
    </div>
  );
};

RatingUpgrades.propTypes = {
  data: PropTypes.object
};

export default RatingUpgrades;
