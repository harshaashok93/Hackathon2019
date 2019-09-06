/* @flow weak */

/*
 * Component: AdminPageTopComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Heading, Divider, Button } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminPageTopComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminPageTopComponent extends Component {
  props: {
    notificationNum: number,
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
    return (
      <div className="admin-page-top-component">
        <div className={'site-admin-header'}>
          <Heading as={'h1'} content={'Site Admin'} />
        </div>
        <div className={'admin-page-links'}>
          <div className={'row account-requests'}>
            <NavLink className={'admin-sub-page-link'} to={'/admin/'}>
              <Button className={'image-div linkBtn admin-accounts-icon'} />
              <span>{'Accounts'}</span>
              {this.props.notificationNum ?
                <span className={'notification'}>{this.props.notificationNum}</span>
                :
                null
              }
            </NavLink>
          </div>
          <div className={'row event-calendar'}>
            <NavLink className={'admin-sub-page-link'} to={'/admin-event-calendar/'}>
              <Button className={'image-div linkBtn admin-event-calendar-icon'} />
              <span>{'Event Calendar'}</span>
            </NavLink>
          </div>
          <div className={'row search-defaults'}>
            <NavLink className={'admin-sub-page-link'} to={'/search-defaults/'}>
              <Button className={' linkBtn image-div admin-search-defaults-icon'} />
              <span>{'Search Defaults'}</span>
            </NavLink>
          </div>
        </div>
        <Divider />
      </div>
    );
  }
}

export default AdminPageTopComponent;
