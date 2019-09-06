/* @flow weak */

/*
 * Component: EmailAlertCheckBoxSection
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Checkbox } from 'unchained-ui-react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './EmailAlertCheckBoxSection.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class EmailAlertCheckBoxSection extends Component {
  props: {
    data: [],
    itemCheck: () => void,
    title: '',
    keyText: '',
    checkboxConfig: {}
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
    const { data, itemCheck, title, keyText, checkboxConfig } = this.props;

    return (
      <Grid.Column computer={3} tablet={6} mobile={12}>
        <div className="heading header-title">{title}</div>
        {
          data.map((c) => {
            const item = c.EmailSettingsCheckbox;
            let isChecked = false;
            let text = '';
            switch (item.valueText) {
              case 'include_new_research':
                isChecked = checkboxConfig.DebtResearch;
                text = 'DebtResearch';
                break;
              case 'send_text':
                isChecked = !checkboxConfig.HtmlFormat;
                text = 'HtmlFormat';
                break;
              case 'send_html':
                isChecked = checkboxConfig.HtmlFormat;
                text = 'HtmlFormat';
                break;
              default: break;
            }

            return (
              <div>
                <div className="heading header-title">{item.title}</div>
                <div>
                  <Checkbox
                    type={keyText !== 'include_new_research' ? 'radio' : 'checkbox'}
                    name={item.valueText}
                    key={item.valueText}
                    onChange={(e, obj) => itemCheck(e, obj, item, text)}
                    label={item.text}
                    checked={isChecked}
                  />
                </div>
              </div>
            );
          })
        }
      </Grid.Column>
    );
  }
}

export default EmailAlertCheckBoxSection;
