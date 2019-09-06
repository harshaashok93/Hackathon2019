import React from 'react';
import { Button, Grid } from 'unchained-ui-react';
import PropTypes from 'prop-types';

const ViewFullPublication = ({ data }) => {
  if (!data) return null;
  return (
    <Grid className={'disclosure'}>
      <Grid.Column computer={2} tablet={2} mobile={12} className={'empty-grid'} />
      <Grid.Column computer={10} tablet={10} mobile={12}>
        <div className={'btn-div'}>
          <Button as="a" primary content="Load full report" className="showMorePublicationBtn ui button primary" id="view-full-publication" href={`/api/v1/publication/GetBMDoc/?product_id=${data.productId}`} target="_blank" />
        </div>
      </Grid.Column>
    </Grid>
  );
};

ViewFullPublication.propTypes = {
  data: PropTypes.object
};

export default ViewFullPublication;
