/* @flow weak */

/*
 * Component: AnalystSelection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Image } from 'unchained-ui-react';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { NavLink } from 'react-router-dom';
import { pushToDataLayer } from 'analytics';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystSelection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystSelection extends Component {
  props: {
    displayName: '',
    avatar: '',
    position: '',
    role: '',
    clientCode: '',
    is_active: boolean
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleGTM = () => {
    const { displayName, position } = this.props;
    const gtmData = {
      'BMO Analyst Name': displayName,
      'BMO Analyst Job Title': position
    };
    pushToDataLayer('ourdepartment', 'ouranalystClick', { label: displayName, data: gtmData });
  }

  render() {
    const { displayName, firstName, lastName, middleName, avatar, position, role, clientCode, is_active, display_title, division_name } = this.props; // eslint-disable-line
    const isActive = is_active; // eslint-disable-line
    const displayTitle = display_title; // eslint-disable-line
    const divisionName = division_name; // eslint-disable-line
    const showName = `${firstName || ''} ${middleName || ''} ${lastName || ''}`;
    return (
      <div className="analyst-selection">
        <div>
          <div className="analyst-image">
            {
              isActive ?
                <NavLink to={`${config.analystURLPrefix}/${clientCode}/`} onClick={() => this.handleGTM()}>
                  <Image
                    className="analyst-avatar"
                    alt={displayName || 'Defalut image'}
                    src={avatar || DEFAULT_PROFILE.img}
                  />
                </NavLink>
                :
                <Image
                  className="analyst-avatar"
                  alt={displayName || 'Defalut image'}
                  src={avatar || DEFAULT_PROFILE.img}
                />
            }
          </div>
          <div className="analyst-name">
            {
              isActive ?
                <NavLink to={`${config.analystURLPrefix}/${clientCode}/`} onClick={() => this.handleGTM()}>
                  <div className="analyst-name-section">
                    {showName || 'N/A'}{position ? `, ${position}` : ''}
                  </div>
                </NavLink>
                :
                <div className="analyst-name-section">
                  {showName || 'N/A'}{position ? `, ${position}` : ''}
                </div>
            }
            <div className="analyst-display-title">
              {displayTitle || ''}
            </div>
            <div className="analyst-division_name">
              {divisionName || ''}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnalystSelection;
