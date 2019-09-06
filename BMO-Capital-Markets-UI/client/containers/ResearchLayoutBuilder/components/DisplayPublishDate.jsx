import React from 'react';
import PropTypes from 'prop-types';
import SearchFormatter from './SearchFormatter';

const DisplayPublishDate = ({ data }) => {
  return (
    <div className="display-publish-date">{SearchFormatter(data)}</div>
  );
};

DisplayPublishDate.propTypes = {
  data: PropTypes.string
};

export default DisplayPublishDate;
