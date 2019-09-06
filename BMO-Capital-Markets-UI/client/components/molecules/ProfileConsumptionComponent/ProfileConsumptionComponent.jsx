/* @flow weak */

/*
 * Component: ProfileConsumptionComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Button } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import { numberWithCommas, downloadBlobFile } from 'utils';
import { connect } from 'react-redux';
import {
  downloadConsumptionReportFile,
} from 'api/profile';
import {
  userSelector,
} from 'store/selectors';

import {
  GET_PROFILE_CONSUMPTION_DATA,
  GET_PROFILE_CONSUMPTION_REPORT,
} from 'store/actions';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileConsumptionComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileConsumptionComponent extends Component {
  props: {
    data: {},
    titleText: '',
    downloadText: ''
  };

  static defaultProps = {
    data: {}
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  downloadReport = () => {
    downloadConsumptionReportFile().then(r => {
      if (r.ok) {
        return r.blob();
      }
      return null;
    }).then((result) => {
      if (!result) return;
      const filename = 'consumption_report.xlsx';

      pushToDataLayer('profile', 'downloadReport', { label: filename });
      downloadBlobFile({
        content: result,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename
      });
    });
  }

  render() {
    const { data, titleText, downloadText } = this.props;
    const { readership } = data;
    return (
      <div className="profile-consumption-component profile-bottom-container">
        <Grid>
          <Grid.Column computer={8} tablet={10} mobile={12}>
            <Grid>
              {/* <Grid.Colu mn computer={4} mobile={12}>
                <div className="heading consumption_title">Interactions</div>
                <hr />
                <div className="text">{interactions ? numberWithCommas(interactions) : 'N/A'}</div>
              </Grid.Column> */}
              {/* <Grid.Column computer={4} mobile={12}>
                <div className="heading consumption_title">Conferences</div>
                <hr />
                <div className="text">{conferences ? numberWithCommas(conferences) : 'N/A'}</div>
              </Grid.Column> */}
              <Grid.Column computer={4} mobile={12}>
                <div className="heading consumption_title">{titleText}</div>
                <hr />
                <div className="text">{readership ? numberWithCommas(readership) : 'N/A'}</div>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
        <Button className="linkBtn" onClick={this.downloadReport}>
          {downloadText}
          <div className="download-report bg-icon-props" />
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  consumption: userSelector.getUserProfileConsumption(state),
});

const mapDispatchToProps = (dispatch) => ({
  getConsumptionData: () => {
    dispatch(GET_PROFILE_CONSUMPTION_DATA());
  },
  getConsumptionReport: () => {
    dispatch(GET_PROFILE_CONSUMPTION_REPORT());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConsumptionComponent);
