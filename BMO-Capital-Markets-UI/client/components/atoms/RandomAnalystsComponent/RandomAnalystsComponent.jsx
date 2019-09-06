/* @flow weak */

/*
 * Component: RandomAnalystsComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Image } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
import {
  GET_ANALYST_PROFILE_LINKS
} from 'store/actions';
import {
  departmentSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './RandomAnalystsComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class RandomAnalystsComponent extends Component {
  props: {
    // analysts: '',
    // displayName: '',
    // division_name: '',
    firstName: '',
    is_active: bool,
    lastName: '',
    position: '',
    sectors: [],
    clientCode: '',
    avatar: '',
    middleName: ''
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  componentWillMount() {
    // this.props.getAnalystProfileLink(this.props.number);
  }

  featuredAnalystClick = (name, job, sector) => () => {
    pushToDataLayer('ourdepartment', 'featuredAnalystClick', { label: name, data: { 'BMO Analyst Name': name, 'BMO Analyst Job Title': job, 'Sector Name': sector } });
  }

  render() {
    const {
      // analyst,
      // division_name: displayName,
      firstName,
      is_active: isActive,
      clientCode,
      lastName,
      position,
      sectors,
      avatar,
      middleName
    } = this.props;
    const displayName = `${firstName || ''} ${middleName || ''} ${lastName || ''}`;
    return (
      <div className="analyst-profile-holder">
        <div className="random-analyst-profile-pic" key={Math.random()}>
          <div className="the-image">
            {
              isActive ?
                <NavLink to={`${config.analystURLPrefix}/${clientCode}`} onClick={this.featuredAnalystClick(displayName, position, sectors)}>
                  <Image className="analyst-avatar" src={avatar || DEFAULT_PROFILE.img} />
                </NavLink>
                :
                <Image className="analyst-avatar" src={avatar || DEFAULT_PROFILE.img} />
            }
          </div>
          {
            isActive ?
              <NavLink to={`${config.analystURLPrefix}/${clientCode}`} onClick={this.featuredAnalystClick(displayName, position, sectors)}>
                <span className="analyst-name">{position ? `${displayName}, ${position}` : displayName}</span>
              </NavLink>
              :
              <span className="analyst-name">{position ? `${displayName}, ${position}` : displayName}</span>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  analystProfileLinks: departmentSelector.setAnalystProfileLinks(state)
});

const mapDispatchToProps = (dispatch) => ({
  getAnalystProfileLink: (d) => {
    dispatch(GET_ANALYST_PROFILE_LINKS(d));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RandomAnalystsComponent);
