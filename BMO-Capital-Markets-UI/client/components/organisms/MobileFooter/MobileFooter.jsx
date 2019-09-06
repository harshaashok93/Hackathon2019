/* @flow weak */

/*
 * Component: MobileFooter
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { List, Label, Accordion, Button } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './MobileFooter.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class MobileFooter extends Component {
  props: {
    mobileFooterOptions: {}
  };

  static defaultProps = {
    mobileFooterOptions: [
      {
        title: 'Legal',
        list: [
          { optionVal: 'disclosure_statement', optionText: 'Disclosure Statements', to: 'http://google.com' },
          { optionVal: 'conflict_statement', optionText: 'Conflict Statements', to: 'http://google.com' },
        ]
      },
      {
        title: 'Client',
        list: [
          { optionVal: 'disclosure_statement', optionText: 'Disclosure Statements', to: 'http://google.com' },
          { optionVal: 'disclosure_statement', optionText: 'Disclosure Statements', to: 'http://google.com' }
        ],
      },
      {
        title: 'BMO',
        list: [
          { optionVal: 'disclosure_statement', optionText: 'Disclosure Statements', to: 'http://google.com' },
          { optionVal: 'disclosure_statement', optionText: 'Disclosure Statements', to: 'http://google.com' }
        ]
      },
      {
        title: 'Contact',
        list: [
          { optionVal: 'disclosure_statement', optionText: 'Disclosure Statements', to: 'http://google.com' },
          { optionVal: 'disclosure_statement', optionText: 'Disclosure Statements', to: 'http://google.com' }
        ]
      }
    ]
  };

  state = {
    //
  };

  componentDidMount() {
    // Component ready
  }

  render() {
    const { mobileFooterOptions } = this.props;
    const panels = mobileFooterOptions.map((objectItem, i) => ({
      key: `panel-${i}`,
      title: <Label as={Button} className={'footer-item-name'}><span className={'footer-option-title'}>{objectItem.title}</span><span className={'image-span'} /></Label>,
      content: (
        <List className="footer-options">
          {
            objectItem.list.map((x) => {
              return (
                <List.Item key={Math.random()}>
                  <NavLink className="to-link" to={x.to || '/'}>
                    {x.optionText}
                  </NavLink>
                </List.Item>
              );
            })
          }
        </List>
      )
    }));
    return (
      <div className="mobile-footer">
        <Accordion panels={panels} />
      </div>
    );
  }
}

export default MobileFooter;
