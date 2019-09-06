import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'unchained-ui-react';

const UpsideDownsideArrowImage = ({ data, productId }) => (
  data === true ?
    <Image
      className="upside-downside-arrow-image"
      src={`/api/v1/publication/getImage/?publication_id=${productId}&image_id=scenario_chart`}
    /> : null
);

UpsideDownsideArrowImage.propTypes = {
  data: PropTypes.string,
  productId: PropTypes.string
};

export default UpsideDownsideArrowImage;
