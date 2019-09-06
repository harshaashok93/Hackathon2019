import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Grid } from 'unchained-ui-react';
import CommonBMOTable from './CommonBMOTable';
import CoverageUniverseMobileTable from './CoverageUniverseMobileTable';

const CoverageUniverse = ({ data }) => {
  if (!data) return null;
  return (
    <Grid className={'block-summary-model-grid coverage-universe-model-grid'}>
      <Grid.Column computer={2} tablet={2} mobile={12} className={'empty-grid'} />
      <Grid.Column computer={10} tablet={10} mobile={12} className={'move-right'}>
        <div className="coverage-universe-model">
          <Heading as={'h2'} content="Coverage Universe" />
          <div className={'desktop-view'}>
            {
              Object.values(data).map(td => <CommonBMOTable data={td} />)
            }
          </div>
          <div className={'mobile-view'}>
            {
              Object.values(data).map(td => <CoverageUniverseMobileTable data={td} />)
            }
          </div>
          <p>
            {
              Object.values(data).map(d => d.analysts.map(a => <p>{a.name}</p>))
            }
          </p>
          <p>Stock Rating System: OP - Outperform; Mkt - Market Perform; Und - Underperform; R - Restricted; NR - Not Rated; (S) -Speculative.</p>
          <p>Source: BMO Capital Markets.</p>
        </div>
      </Grid.Column>
    </Grid>
  );
};
CoverageUniverse.propTypes = {
  data: PropTypes.object
};

export default CoverageUniverse;
