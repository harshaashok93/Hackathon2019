import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'components';
import { Card } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

const PriceTitleTextBlock = ({ data }) => {
  if (!data) return null;
  return (
    <div className="price-title-text-block">
      {
        <div className="item">
          <Card >
            <Card.Content>
              <Card.Header className="header">
                <div>{SearchFormatter(data.title)}</div>
                <div className="price-block">{SearchFormatter(data.price)}</div>
              </Card.Header>
              <Card.Description content={<RichText richText={SearchFormatter(data.text, { richText: false })} />} />
            </Card.Content>
          </Card>
        </div>
      }
    </div>
  );
};

PriceTitleTextBlock.propTypes = {
  data: PropTypes.object
};

export default PriceTitleTextBlock;
