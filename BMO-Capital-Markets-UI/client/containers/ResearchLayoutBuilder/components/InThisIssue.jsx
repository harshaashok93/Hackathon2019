import React from 'react';
import { Heading } from 'unchained-ui-react';
import PropTypes from 'prop-types';
import SearchFormatter from './SearchFormatter';

const InThisIssue = ({ data }) => {
  if (!data) return null;
  return (
    <div className="in-this-issue">
      <Heading className="title">{SearchFormatter(data.title)}</Heading>
    </div>
  );
};

InThisIssue.propTypes = {
  data: PropTypes.object
};

export default InThisIssue;
