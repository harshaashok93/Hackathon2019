import React from 'react';
import PropTypes from 'prop-types';

import { JSONComponentBuilder } from 'containers';

const StaticContentContainer = (props) => {
  const {
    identifier,
  } = props;

  const staticContentData = window.unchainedSite && window.unchainedSite.StaticContent;
  let jsonArray = [];

  if (staticContentData !== undefined && staticContentData[identifier] !== undefined) {
    jsonArray = staticContentData[identifier].content;
  }

  const components = require('components');
  return <JSONComponentBuilder components={components} jsonArray={jsonArray} />;
};

StaticContentContainer.propTypes = {
  identifier: PropTypes.string.isRequired,
};

export default StaticContentContainer;
