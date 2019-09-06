import React from 'react';
import { Heading } from 'unchained-ui-react';
import { RichText } from 'components';
import PropTypes from 'prop-types';
import SearchFormatter from './SearchFormatter';

const FocusHighlight = ({ data }) => {
  if (!data) return null;
  return (
    <div className="focus-highlight">
      <Heading className="title">{SearchFormatter(data.title)}</Heading>
      <RichText className="content" richText={SearchFormatter(data.content, { richText: false })} />
    </div>
  );
};

FocusHighlight.propTypes = {
  data: PropTypes.object
};

export default FocusHighlight;
