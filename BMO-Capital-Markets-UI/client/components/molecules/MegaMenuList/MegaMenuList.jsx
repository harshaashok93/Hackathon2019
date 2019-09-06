/* @flow weak */

/*
 * Component: MegaMenuList
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Image, Accordion, Icon } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { LEFT_ARROW_CIRCLE_BIG } from 'constants/assets';
import { pushToDataLayer } from 'analytics';
import { mapPropsToChildren } from 'utils/reactutils';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './MegaMenuList.scss';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class MegaMenuList extends Component {
  props: {
    text: '',
    to: '',
    children: {},
    closeMegaMenu: () => void
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
    isAccordianClicked: false,
  };

  componentDidMount() {
    // Component ready
  }

  handleAccordianClick = () => {
    this.setState({ isAccordianClicked: !this.state.isAccordianClicked });
  }

  handleNavClick = (action, label) => {
    pushToDataLayer('common', 'megaMenuLinks', { action, label });
    this.props.closeMegaMenu();
  }
  getHeading = (text, to) => {
    if (to.url) {
      if (to.link_target !== 'newTab') {
        return (
          <NavLink to={to.url} onClick={() => this.handleNavClick(text, '')} className="links-card-heading">
            {text}
            <Image className={'link-go-button'} src={LEFT_ARROW_CIRCLE_BIG} />
          </NavLink>
        );
      }
      return (
        <a href={to.url} target="_blank" onClick={() => this.handleNavClick(text, '')} className="links-card-heading">
          {text}
          <Image className={'link-go-button'} src={LEFT_ARROW_CIRCLE_BIG} />
        </a>
      );
    }
    return null;
  }
  render() {
    const { to, children, closeMegaMenu } = this.props;
    const { isAccordianClicked } = this.state;
    // let paddingClass = 'no-padding';
    // if (!children) {
    //   paddingClass = 'padding-need';
    // }
    const parentName = this.props.text;
    const accordianIconClass = isAccordianClicked ? 'circle-link clicked' : 'circle-link';

    return (
      <div className={`mega-menu-list ${window.unchainedSite && window.unchainedSite.sitename}`}>
        <div className="mega-menu-desktop">
          <div>{this.getHeading(parentName, to)}</div>
          <ul className="links">
            {mapPropsToChildren(children, { closeMegaMenu, parentName })}
          </ul>
        </div>
        {
          children && children.length > 1 ?
            <Accordion className="mega-menu-accordian" onTitleClick={this.handleAccordianClick}>
              <Accordion.Title className="link-accordian-heading-text">
                <NavLink to={to.url} onClick={() => this.handleNavClick(parentName, '')} className="links-card-heading">
                  {parentName}
                </NavLink>
                <Icon className={accordianIconClass} onClick={this.handleAccordianClick} />
              </Accordion.Title>
              <Accordion.Content>
                <ul className="links">
                  {mapPropsToChildren(children, { closeMegaMenu, parentName })}
                </ul>
              </Accordion.Content>
            </Accordion>
            :
            <div className="mega-menu-no-children-accordian">
              <NavLink to={to.url} onClick={() => this.handleNavClick(parentName, '')} className="links-card-heading">
                {parentName}
              </NavLink>
            </div>
        }
      </div>
    );
  }
}

export default MegaMenuList;
