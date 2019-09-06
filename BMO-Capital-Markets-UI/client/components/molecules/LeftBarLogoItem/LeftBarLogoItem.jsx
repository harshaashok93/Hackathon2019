/* @flow weak */

/*
 * Component: LeftBarLogoItem
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import config from 'config';
import { Image } from 'unchained-ui-react';
import { NameAndPosition } from 'components';
import { DEFAULT_PROFILE } from 'constants/assets.js';
import { NavLink } from 'react-router-dom';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './LeftBarLogoItem.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class LeftBarLogoItem extends Component {
  props: {
    // ...
  };

  static defaultProps = {
    // ...
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const data = this.props;
    return (
      <div className="left-bar-logo-item">
        {data.analyst_image ?
          <NavLink to={`${config.analystURLPrefix}/${data.clientCode}`}>
            <Image className={'analyst-image'} alt={data.analyst_name} shape={'circular'} src={data.analyst_image || DEFAULT_PROFILE.img} />
          </NavLink>
          : null
        }
        <NameAndPosition clientCode={data.clientCode} analyst_name={data.analyst_name} analyst_position={data.analyst_position} />
      </div>
    );
  }
}

export default LeftBarLogoItem;
