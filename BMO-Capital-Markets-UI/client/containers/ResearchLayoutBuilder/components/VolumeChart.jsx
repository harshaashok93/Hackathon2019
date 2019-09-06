import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Button } from 'unchained-ui-react';

const VolumeChart = ({ data, productId, isAccordionComponent = false, handleAccordionClick, isOpen = false }) => (
  data === true ?
    (
      <div className="volume-chart">
        <Heading className="sector-name headingTab">2YR Price Volume Chart
        </Heading>
        {(!isAccordionComponent || (isAccordionComponent && isOpen)) ?
          <object
            className="volume-chart-image"
            aria-label="Volume Chart"
            type="image/svg+xml"
            data={`/api/v1/publication/getImage/?publication_id=${productId}&image_id=chart`}
          />
          : null
        }
        {isAccordionComponent &&
        <Button className={`linkBtn ${isOpen ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={() => handleAccordionClick('VolumeChart')} />
        }
      </div>
    )
    : null
);

VolumeChart.propTypes = {
  data: PropTypes.boolean,
  productId: PropTypes.string,
  isAccordionComponent: PropTypes.bool,
  isOpen: PropTypes.bool,
  handleAccordionClick: PropTypes.func
};

export default VolumeChart;
