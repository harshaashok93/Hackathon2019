import React from 'react';
import PropTypes from 'prop-types';
import SimpleListView from './SimpleListView';

const InitiationTransfers = ({ data }) => {
  if (!data) return null;
  return (
    <div className="initiation-transfers">
      <SimpleListView row={false} data={data} />
    </div>
  );
};

InitiationTransfers.propTypes = {
  data: PropTypes.object
};

export default InitiationTransfers;
