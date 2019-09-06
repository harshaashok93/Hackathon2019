import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'unchained-ui-react';
import { sitenameVariable } from 'constants/UnchainedVariable';

let prodId = '';

const getPdfUrl = () => {
  window.open(`/api/v1/publication/getPublicationPdfLive/?id=${prodId}&read=true&stamp=${new Date().getTime() * 1000}&sitename=${sitenameVariable.sitename}`, '_blank');
};

const getUI = (data, pid, showAvailableOnlyInPDFMessage) => {
  if (data) {
    return (
      <div className={'view-publication-btn'}>
        {
          <div>
            {showAvailableOnlyInPDFMessage && <div className={'publication-btn-message'}>This publication is currently only available as a PDF.</div>}
            <Button className="showMorePublicationBtn ui button primary" id="view-full-publication" onClick={() => { getPdfUrl(); }} >
              Load full report
            </Button>
          </div>
        }
      </div>
    );
  }
  return null;
};

const Attachments = ({ data, pid, productId, type, showAvailableOnlyInPDFMessage }) => {
  prodId = productId;
  if (!data) return null;
  const getTable = () => {
    return (
      <div className="attachments">
        {
          getUI(data, pid, showAvailableOnlyInPDFMessage)
        }
      </div>
    );
  };

  return (
    <Grid className={'attachments-grid'}>
      <Grid.Column computer={type === 'full_attachment' ? 0 : 2} tablet={type === 'full_attachment' ? 0 : 2} mobile={type === 'full_attachment' ? 0 : 2} className={'empty-grid'} />
      <Grid.Column computer={type === 'full_attachment' ? 12 : 10} tablet={type === 'full_attachment' ? 12 : 10} mobile={12}>
        {getTable()}
      </Grid.Column>
    </Grid>
  );
};

Attachments.propTypes = {
  data: PropTypes.object,
  pid: PropTypes.string,
  showAvailableOnlyInPDFMessage: PropTypes.boolean,
  productId: PropTypes.string,
  type: '',
};

export default Attachments;
