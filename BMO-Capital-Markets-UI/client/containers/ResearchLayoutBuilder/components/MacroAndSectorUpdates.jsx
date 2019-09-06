import React from 'react';
import PropTypes from 'prop-types';
import SimpleListView from './SimpleListView';

const MacroAndSectorUpdates = ({ data }) => {
  if (!data) return null;
  return (
    <div className="macro-and-sector-updates">
      <SimpleListView row={true} data={data} />
    </div>
  );
};

MacroAndSectorUpdates.propTypes = {
  data: PropTypes.object
};

export default MacroAndSectorUpdates;
