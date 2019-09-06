import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Button } from 'unchained-ui-react';
import { RESEARCH_LAYOUT_FLASHES } from 'constants/assets';
import SearchFormatter from './SearchFormatter';

const CompanyPerformance = ({ data, type, isOpen = false, handleAccordionClick, isAccordionComponent = false }) => {
  const getArrow = (direction) => {
    if (direction === 'DOWN') {
      return <span className="down-arrow" />;
    } else if (direction === 'UP') {
      return <span className="up-arrow" />;
    }
    return null;
  };
  if (!data) return null;
  return (
    <Grid className="company-performance">
      <Grid.Column computer={4} tablet={2} mobile={12} className={`${isAccordionComponent ? 'mobile-accordion' : 'ticker'}`}>
        <span className={'ticker-name'}>{SearchFormatter(data.ticker)}</span>
        {data.isTop15 ? <span className="top15label" /> : null}
      </Grid.Column>
      {(!isAccordionComponent || (isAccordionComponent && isOpen)) ?
        <Grid.Column computer={2} tablet={2} mobile={12}>
          <div className={'header'}>Rating</div>
          <div className={'company-performance-value'}>
            {getArrow(data.rating.arrow)}
            {SearchFormatter(data.rating.value)}
          </div>
        </Grid.Column> : null
      }
      {(!isAccordionComponent || (isAccordionComponent && isOpen)) ?
        <Grid.Column computer={2} tablet={2} mobile={12}>
          <div className={'header'}>Price: {SearchFormatter(data.price.date)}</div>
          <div className={'company-performance-value'}>
            {getArrow(data.price.arrow)}
            {SearchFormatter(data.price.value)}
          </div>
        </Grid.Column> : null
      }
      {(!isAccordionComponent || (isAccordionComponent && isOpen)) ?
        <Grid.Column computer={2} tablet={2} mobile={12}>
          <div className={'header'}>Target</div>
          <div className={'company-performance-value'}>
            {getArrow(data.target.arrow)}
            {SearchFormatter(data.target.value)}
          </div>
        </Grid.Column> : null
      }
      {
        (!isAccordionComponent || (isAccordionComponent && isOpen)) ?
          data.totalReturn &&
          <Grid.Column computer={2} tablet={2} mobile={12}>
            <div className={'header'}>Total Rtn</div>
            <div className={'company-performance-value'}>{SearchFormatter(data.totalReturn)}</div>
          </Grid.Column> : null
      }
      {
        (!isAccordionComponent || (isAccordionComponent && isOpen)) &&
        type === 'flash' ?
          <Grid.Column computer={1} tablet={2} mobile={12} className="flash_logo">
            <Image className="flash_image" src={RESEARCH_LAYOUT_FLASHES} />
          </Grid.Column>
          : null
      }
      {isAccordionComponent &&
      <div className={`chevron-block ${isOpen ? 'chevron-bottom' : 'chevron-top'}`}>
        <Button className={`linkBtn ${isOpen ? 'bmo_chevron' : 'bmo_chevron bottom'}`} onClick={() => handleAccordionClick('CompanyPerformance')} />
      </div>
      }
    </Grid>
  );
};

CompanyPerformance.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  handleAccordionClick: PropTypes.func,
  isAccordionComponent: PropTypes.bool
};

export default CompanyPerformance;
