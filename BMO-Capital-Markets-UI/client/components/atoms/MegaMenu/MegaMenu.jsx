/* @flow weak */

/*
 * Component: MegaMenu
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Button, Grid, Modal } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';
import { mapPropsToChildren } from 'utils/reactutils';
import st from 'constants/strings';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './MegaMenu.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class MegaMenu extends Component {
  props: {
    megaMenuText: '',
    megaMenuIconModal: '',
    megaMenuIconModalAltText: '',
    megaMenuIconHeaderAltText: '';
    mobileHamburgerIconHeader: '';
    children: {}
  };

  static defaultProps = {
  };

  state = {
    isMegaMenuOpen: false
  };
  handleEscape = (e) => {
    if (e.which === 27) {
      const closeButton = document.getElementById('mega-menu-close-icon');
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  handleMouseUp = (e) => {
    if ((e.target.className.indexOf('ui page modals dimmer transition visible active') > -1)) {
      // Adding new classname to overlay parent will not let to close overlay in tablets, on touch of background.
      this.closeMegaMenu();
    }
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleEscape);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscape);
  }
  closeMegaMenu = () => {
    this.setState({ isMegaMenuOpen: false });
    document.body.classList.remove('noscroll');
    document.body.removeEventListener('touchstart', this.handleMouseUp);
  }
  megaMenuOpen = () => {
    document.body.addEventListener('touchstart', this.handleMouseUp);
    window.scrollTo(0, 0);
    this.setState({ isMegaMenuOpen: true });
    document.body.classList.add('noscroll');
    pushToDataLayer('common', 'topMenuNav', { label: 'Menu' });
  }

  render() {
    const {
      megaMenuIconModal,
      megaMenuText,
      megaMenuIconModalAltText,
      mobileHamburgerIconHeader,
      megaMenuIconHeaderAltText,
      children
    } = this.props;

    const sitename = window.unchainedSite && window.unchainedSite.sitename !== 'Equity' && 'mega-menu-corp';

    return (
      <div className="mega-menu-container">
        <Image className="desktop hamburgerMenu" onClick={this.megaMenuOpen} alt={megaMenuIconModalAltText} src={megaMenuIconModal} title={st.megamenu} />
        <Image id="mobileHamburgerMenu" className="mobile hamburgerMenu" onClick={this.megaMenuOpen} alt={megaMenuIconHeaderAltText} src={mobileHamburgerIconHeader} />
        <Button onClick={this.megaMenuOpen} tabIndex={0} className="menu-name white">{megaMenuText}</Button>
        {this.state.isMegaMenuOpen ?
          <Modal
            open={this.state.isMegaMenuOpen}
            onClose={this.closeMegaMenu}
            className={`mega-menu-modal ${sitename}`}
          >
            <Modal.Content>
              <div className={'mega-menu'} id="the-mega-menu">
                <Grid className="mega-menu-holder">
                  <Grid.Row className="menu-header">
                    <Grid.Column computer={12} className="mega-menu-title">
                      <Button tabIndex={0} id="mega-menu-close-icon" className="mega-menu-close-icon bmo-close-btn bg-icon-props" onClick={this.closeMegaMenu} />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="mega-menu-links-set">
                    {mapPropsToChildren(children, { closeMegaMenu: this.closeMegaMenu })}
                  </Grid.Row>
                </Grid>
              </div>
            </Modal.Content>
          </Modal>
          :
          null
        }
      </div>
    );
  }
}

export default MegaMenu;
