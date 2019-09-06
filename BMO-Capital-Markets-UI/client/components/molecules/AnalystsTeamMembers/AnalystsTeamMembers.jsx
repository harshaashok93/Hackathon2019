/* @flow weak */

/*
 * Component: AnalystsTeamMembers
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { NavLink } from 'react-router-dom';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { Image } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import { formatAnalystName } from 'utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AnalystsTeamMembers.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AnalystsTeamMembers extends Component {
  props: {
    data: {},
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  handleGTM = (data) => {
    if (data) {
      const gtmData = {
        'BMO Analyst Name': data.display_name,
        'BMO Analyst Job Title': data.position
      };
      pushToDataLayer('ourdepartment', 'industryTeamMemberClick', { label: data.display_name, data: gtmData });
    }
  }

  render() {
    const { data } = this.props;
    return (
      <div className="analysts-team-members">
        {
          Object.keys(data.team).map((key) => {
            if (data.team[key] && data.team[key].length) {
              return (
                <div className="sector-team">
                  <div className="sector-name">{key} Team Members</div>
                  <div className="member-wrap">
                    {
                      data.team[key].map((person) => {
                        const displayName = formatAnalystName(person.first_name, person.middle_name, person.last_name);
                        return (
                          <NavLink to={`${config.analystURLPrefix}/${person.client_code}/`} onClick={() => this.handleGTM(person)}>
                            <div className="team-person">
                              <div className="borderRadius100">
                                <Image
                                  className="analyst-avatar"
                                  shape={'circular'}
                                  alt={person.first_name || 'Defalut image'}
                                  src={person.avatar_url || DEFAULT_PROFILE.img}
                                />
                              </div>
                              <div className="person-name">{displayName}{person.position ? `, ${person.position}` : ''}</div>
                            </div>
                          </NavLink>
                        );
                      })
                    }
                  </div>
                </div>
              );
            }
            return null;
          })
        }
      </div>
    );
  }
}

export default AnalystsTeamMembers;
