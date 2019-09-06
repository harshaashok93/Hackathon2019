import React from 'react';
import PropTypes from 'prop-types';
import CommonBMOTable from './CommonBMOTable';

const QtrEPS = ({ data }) => {
  if (!data || !data.tableData || !data.tableData.length) return null;
  return (
    <div className="qtr-eps">
      <CommonBMOTable data={data} />
    </div>
  );
};

QtrEPS.propTypes = {
  data: PropTypes.object
};

export default QtrEPS;
