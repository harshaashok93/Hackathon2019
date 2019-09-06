/* @flow weak */

/*
 * Component: CookieAcknowledgementPopup
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { RichText } from 'components';
import { Button } from 'unchained-ui-react';
import CookieBanner from 'react-cookie-banner';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import './CookieAcknowledgementPopup.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class CookieAcknowledgementPopup extends Component {
  props: {
    content: '',
  };

  closeCookieBar = () => () => {
    this.setState({ accepted: true });
  }

  render() {
    const styles = {
      banner: {
        fontFamily: 'Heebo',
        height: 'auto',
        background: 'rgba(0, 123, 194, 0.7) url(/cookie.png) 20px 50% no-repeat',
        backgroundSize: '30px 30px',
        backgroundColor: '',
        fontSize: '16px',
        fontWeight: 600
      },
      button: {
        border: '0px',
        borderRadius: 4,
        width: 50,
        height: 32,
        lineHeight: '32px',
        background: 'transparent',
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
        opacity: 1,
        right: 0,
        marginTop: '20px',
        top: 0
      },
      message: {
        display: 'block',
        padding: '15px 40px',
        lineHeight: 1.3,
        textAlign: 'left',
        marginRight: 0,
        color: 'white'
      },
      link: {
        textDecoration: 'none',
        fontWeight: 'bold'
      }
    };

    return (
      <div className="cookie-acknowledgement-popup">

        <CookieBanner
          styles={styles}
          id={'cookieAcknowledgementPopup'}
          buttonMessage={<Button className={'modal-close-icon bmo-close-white-btn bg-icon-props'} />}
          dismissOnScroll={false}
          dismissOnClick={false}
          onAccept={this.closeCookieBar()}
          message={<RichText className={'content'} richText={this.props.content} />}
          cookiePath="/"
        />
      </div>
    );
  }
}

export default CookieAcknowledgementPopup;
