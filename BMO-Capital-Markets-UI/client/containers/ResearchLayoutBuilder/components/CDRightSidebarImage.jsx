import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'unchained-ui-react';

const CDRightSidebarImage = ({ data, productId }) => (
  data ?
    <Image
      className="cd-right-sidebar-image"
      src={`/api/v1/publication/getImage/?publication_id=${productId}&image_id=cd-right-sidebar`}
    /> : null
);

CDRightSidebarImage.propTypes = {
  data: PropTypes.string,
  productId: PropTypes.string
};

export default CDRightSidebarImage;
