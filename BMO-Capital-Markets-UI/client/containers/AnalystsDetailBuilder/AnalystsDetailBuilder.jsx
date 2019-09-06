/* @flow weak */

/*
 * Component: AnalystsDetailBuilder
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StaticContentContainer } from 'containers';
import { Loader } from 'unchained-ui-react';
import { withRouter } from 'react-router';
import { AnalystsDetailBio, AnalystsStockList, AnalystsTeamMembers, BlurredImageComponent } from 'components';
import { ANALYST_DETAILS_PIXELATED_IMAGE } from 'constants/assets';

import {
  GET_ANALYSTS_DETAIL_DATA
} from 'store/actions';

import {
  departmentSelector,
  userSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystsDetailBuilder.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsDetailBuilder extends Component {
  props: {
    match: {
      params: {
        code: ''
      }
    },
    getDetailData: () => void,
    isLoading: bool,
    analystsDetailData: {},
    profile: {
      can_access_content: boolean
    },
    isVerifying: bool
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentWillMount() {
    const { profile, match } = this.props;
    if (profile && profile.can_access_content) {
      this.props.getDetailData(match.params.code);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { profile, match } = nextProps;
    if ((match.params.code !== this.props.match.params.code) ||
        (profile && (profile.can_access_content !== this.props.profile.can_access_content))
    ) {
      this.props.getDetailData(match.params.code);
    }
  }

  buildUI() {
    const { analystsDetailData, profile, isVerifying } = this.props;
    const canAccessContent = profile.can_access_content;
    if (isVerifying) {
      return <Loader active={true} content="Loading..." />;
    }
    if (!canAccessContent) {
      return <BlurredImageComponent blurryImageUrl={ANALYST_DETAILS_PIXELATED_IMAGE} />;
    }

    if (Object.keys(analystsDetailData).length === 0) {
      return <div className="error-message">Oops! There was an error loading this page. Please try again.</div>;
    }
    const canFollow = canAccessContent && profile.can_follow_content;

    return (
      <div>
        <AnalystsDetailBio data={analystsDetailData} canFollow={canFollow} />
        { (analystsDetailData.sectors && Object.keys(analystsDetailData.sectors).length !== 0) ? <AnalystsStockList data={analystsDetailData} canFollow={canFollow} profile={profile} /> : null}
        { (analystsDetailData.team && Object.keys(analystsDetailData.team).length !== 0) ? <AnalystsTeamMembers data={analystsDetailData} canFollow={canFollow} /> : null}
      </div>
    );
  }

  render() {
    const { isLoading, profile } = this.props;
    const canAccessContent = profile.can_access_content;
    return (
      <div className="analysts-detail-builder">
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Header' : 'CorporateDebt-Header'} />
        <div className="analysts-detail-builder-main-wrapper">
          {
            (canAccessContent && isLoading) ?
              <Loader active={true} content="Loading..." />
              : this.buildUI()
          }
        </div>
        <StaticContentContainer identifier={window.unchainedSite && window.unchainedSite.sitename === 'Equity' ? 'Footer' : 'CorporateDebt-Footer'} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  analystsDetailData: departmentSelector.getAnalystsDetailData(state),
  isLoading: departmentSelector.getIsAnalystsDetailLoading(state),
  profile: userSelector.getUserProfileInfo(state),
  isVerifying: userSelector.getIsVerifying(state)
});

const mapDispatchToProps = (dispatch) => ({
  getDetailData: (code) => {
    dispatch(GET_ANALYSTS_DETAIL_DATA(code));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnalystsDetailBuilder));
