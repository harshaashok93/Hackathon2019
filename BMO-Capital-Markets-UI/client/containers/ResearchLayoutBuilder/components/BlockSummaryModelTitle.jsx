import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Grid } from 'unchained-ui-react';

const BlockSummaryModelTitle = ({ data }) => {
  if (!data) return null;
  const getTable = () => {
    return (
      <div className="block-summary-model-title">
        <Heading as={'h2'} content={data.title} />
      </div>
    );
  };
  return (
    <Grid className={'block-summary-grid'}>
      <Grid.Column computer={2} tablet={2} mobile={12} className={'empty-grid'} />
      <Grid.Column computer={10} tablet={10} mobile={12} className={'move-right'}>
        {getTable()}
      </Grid.Column>
    </Grid>
  );
};

BlockSummaryModelTitle.propTypes = {
  data: PropTypes.object
};

export default BlockSummaryModelTitle;
