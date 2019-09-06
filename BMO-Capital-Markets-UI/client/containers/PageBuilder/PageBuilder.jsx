import React from 'react';
import PropTypes from 'prop-types';

import {
  JSONComponentBuilder,
} from 'containers';

const PageBuilder = (props) => {
  const {
    pathname: slug,
  } = props.location;

  let allPagesData = {};
  let jsonArray = [];

  const previewElement = document.getElementById('unchained');

  if (previewElement) {
    jsonArray = JSON.parse(previewElement.getAttribute('data'));
  } else if (window.unchainedSite && window.unchainedSite.page) {
    allPagesData = window.unchainedSite.page;

    if (allPagesData[slug]) {
      jsonArray = allPagesData[slug];
    }

    // if (slug === '/en') {
    //   jsonArray = allPagesData['/en/'];
    // }

    if (jsonArray.length === 0) {
      jsonArray = allPagesData['/404/'];
    }
  }

  const components = require('components');

  return <JSONComponentBuilder components={components} jsonArray={jsonArray} />;
};

PageBuilder.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default PageBuilder;
