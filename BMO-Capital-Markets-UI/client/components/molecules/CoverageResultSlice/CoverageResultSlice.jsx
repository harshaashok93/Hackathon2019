/* @flow weak */

/*
 * Component: CoverageResultSlice
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Image, Button, Container } from 'unchained-ui-react';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { pushToDataLayer } from 'analytics';
import { connect } from 'react-redux';
import { BmoPopUp, RetailConsumerTeamCard } from 'components';
import { toShowAnalyst } from 'utils';
import config from 'config';
import {
  GET_COVERAGE_OVERLAY
} from 'store/actions';
import {
  userSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './CoverageResultSlice.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class CoverageResultSlice extends Component {
  props: {
    data: {},
    getCoverageOverlay: () => void,
    profile: {},
    isLoggedIn: Boolean,
    showCoverageModel: () => void,
    index: number
  };

  static defaultProps = {
  };

  state = {
    isGraphModalOpen: false
  };

  componentDidMount() {
    // Component ready
  }
  handleGTM = (type, label) => {
    if (type && label) {
      pushToDataLayer('ourdepartment', type, { label });
    }
  }
  getOverlay = (ticker) => () => {
    const { showCoverageModel, getCoverageOverlay } = this.props;
    if (showCoverageModel) {
      showCoverageModel();
    }
    getCoverageOverlay({ ticker });
  }
  closeGraphModal = () => {
    this.setState({ isGraphModalOpen: false });
  }
  render() {
    const { data, isLoggedIn, profile, index } = this.props;
    const canAccessContent = isLoggedIn && profile.can_access_content; // eslint-disable-line

    let roles = [];
    roles = data.roles.map((item) => {
      return (
        { name: item }
      );
    });

    const retailConsumerData = { // eslint-disable-line
      ...data,
      id: data.person_id,
      role: data.analyst_role,
      roles,
      do_not_sync_to_rds: data.do_not_sync_to_rds,
      display_name: data.analyst,
      active: data.is_active,
      position: data.analyst_position
    };

    const isActive = (data.is_active === true && toShowAnalyst(retailConsumerData) && (!data.do_not_sync_to_rds));
    const displayName = `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`;
    return (
      <div className="coverage-result-slice">
        <div className="company-name-and-logo">
          <div role="button" tabIndex={0} onKeyPress={() => {}} onClick={this.getOverlay(data.ticker)} className="company result-slice-cell">
            <span className="company-name sub-cell">
              <Button className={`company-name-btn ${profile.pages && profile.pages.has_visited_our_coverage_page ? '' : 'intro-part-our-coverage'}`} id={index === 0 ? 'intro-our-coverage-name-id' : ''} onClick={() => this.handleGTM('ourcoverageOpenClick', data.name, data.ticker)}> {data.name} </Button>
            </span>
            <span className="company-ticker sub-cell">
              ({data.ticker || 'N/A'})
            </span>
          </div>
        </div>
        <div className="sector result-slice-cell">
          {data.sector}
        </div>
        <div className={`rating result-slice-cell ${data.rating_short_code}`}>
          {data.rating_short_code}
        </div>
        <div className="analyst result-slice-cell hide-on-tab">
          <div className="analyst-profile-pic">
            {data.analyst &&
              <div>
                <Container
                  as={isActive ? NavLink : 'div'}
                  className={isActive ? 'active' : ''}
                  id={index === 0 ? 'intro-our-coverage-analyst-info-id' : ''}
                  to={(isActive) ? `${config.analystURLPrefix}/${data.client_code}` : ''}
                >
                  <div className="the-image">
                    <Image
                      className="analyst-avatar"
                      shape={'circular'}
                      alt={data.analyst ? data.analyst : 'Defalut image'}
                      src={data.analyst_avatar ? data.analyst_avatar : DEFAULT_PROFILE.img}
                    />
                  </div>
                  <span className="analyst-name">
                    {displayName || null}{data.analyst_position ? `, ${data.analyst_position}` : null}
                  </span>
                </Container>
                {(data && isActive) ?
                  <BmoPopUp rightPosBuff={15} topBuff={15} leftPosBuff={15} rightBuff={20}>
                    <RetailConsumerTeamCard
                      team={false}
                      canAccessContent={canAccessContent}
                      data={data.analysts || []}
                      isOpen={true}
                      canFollow={canAccessContent && profile && profile.can_follow_content}
                    />
                  </BmoPopUp>
                  :
                  null
                }
              </div>
            }
          </div>
        </div>
        <div className="eye-inactive only-tab" onKeyPress={() => {}} role={'button'} tabIndex={0} onClick={this.getOverlay(data.ticker)} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: userSelector.getIsLoggedIn(state),
  profile: userSelector.getUserProfileInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  getCoverageOverlay: (data) => {
    dispatch(GET_COVERAGE_OVERLAY(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CoverageResultSlice);
