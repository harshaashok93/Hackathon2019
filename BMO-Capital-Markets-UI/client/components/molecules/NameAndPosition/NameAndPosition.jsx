/* @flow weak */

/*
 * Component: NameAndPosition
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { NavLink } from 'react-router-dom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './NameAndPosition.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class NameAndPosition extends Component {
  props: {
    // Prop types go here
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const data = this.props;
    if (data.analyst_name || data.analyst_position) {
      return (
        <div className="analyst-name-and-desig">
          <div className="picture-detail">
            {data.clientCode ?
              <NavLink to={`${config.analystURLPrefix}/${data.clientCode}/`}>
                <span className="name rw">
                  {data.analyst_name}
                </span>
              </NavLink>
              :
              <span className="name rw">
                {data.analyst_name}
              </span>
            }
            <span className="position rw">
              {data.analyst_position}
            </span>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default NameAndPosition;
