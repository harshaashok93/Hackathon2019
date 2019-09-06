/* @flow weak */

/*
 * Component: FourZeroFour
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Button } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { RichText } from 'components';
import './FourZeroFour.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FourZeroFour extends Component {
  props: {
    image: '',
    richText: '',
    buttonText: '',
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }
  render() {
    const { image, richText, buttonText } = this.props;
    return (
      <div className="four-zero-four">
        <RichText richText={richText} />
        {image ?
          <Image alt={'404'} src={image} title={'book-icon'} className="four-zero-four-image" />
          :
          <p>&nbsp;</p>
        }
        <NavLink to={'/'}>
          <Button className="secondary" content={buttonText} />
        </NavLink>
      </div>
    );
  }
}

export default FourZeroFour;
