import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'unchained-ui-react';
import CommonBMOTable from './CommonBMOTable';

const BlockSummaryModel = ({ data }) => {
  if (!data) return null;

  const getTable = () => {
    return (
      <div className="block-summary-model">
        {
          Object.values(data).map(td => <CommonBMOTable key={Math.random()} data={td} />)
        }
        <p className="Source">Source: BMO Capital Markets, Company Reports</p>
      </div>
    );
  };
  return (
    <Grid className={'block-summary-model-grid'}>
      <Grid.Column computer={2} tablet={2} mobile={12} className={'empty-grid'} />
      <Grid.Column computer={10} tablet={10} mobile={12} className={'move-right'}>
        {getTable()}
      </Grid.Column>
    </Grid>
  );
};

BlockSummaryModel.propTypes = {
  data: PropTypes.array
};

export default BlockSummaryModel;
