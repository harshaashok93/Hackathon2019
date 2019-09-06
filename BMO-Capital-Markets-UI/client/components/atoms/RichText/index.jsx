import React from 'react';
import PropTypes from 'prop-types';

const createMarkup = (html) => {
  return { __html: html };
};

const RichText = (props) => {
  if (!props) {
    return null;
  }

  const {
    richText,
    className
  } = props;

  return (
    /* eslint-disable */
    <div className={ className ? `richText ${className}` : 'richText' } dangerouslySetInnerHTML={createMarkup(richText)} />
    /* eslint-disable */
  );
};

RichText.propTypes = {
  richText: PropTypes.string,
  className: PropTypes.any
};

export default RichText;
