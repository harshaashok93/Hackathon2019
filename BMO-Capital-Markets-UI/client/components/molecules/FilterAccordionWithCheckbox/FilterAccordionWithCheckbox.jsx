/* @flow weak */

/*
 * Component: FilterAccordionWithCheckbox
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Accordion, List, Checkbox, Label, Button, Image } from 'unchained-ui-react';
import { tierImageMap, QUESTION_MARK_ICON } from 'constants/assets';
import { BmoPopUp, RichText } from 'components';
import { tierKeyMapping } from 'utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './FilterAccordionWithCheckbox.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class FilterAccordionWithCheckbox extends Component {
  props: {
    heading: '',
    list: [],
    selectedOptions: {},
    checkBoxClick: () => void,
    isRebranding: bool,
    toolTip: '',
  };

  static defaultProps = {
    heading: '',
    list: [],
    selectedOptions: {}
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    // Component ready
  }

  checkBoxClick = (val, text) => (e, checkBox) => {
    const { checkBoxClick } = this.props;
    if (checkBoxClick) {
      checkBoxClick(val, text, e, checkBox);
    }
  }

  render() {
    const { heading, list, selectedOptions, isRebranding, toolTip } = this.props;

    const tierMap = {
      tier_1: 'tier1',
      tier_2: 'tier2',
      tier_3: 'tier3'
    };
    return (
      <Accordion defaultActiveIndex={0}>
        <Accordion.Title>
          <i aria-hidden="true" className="bmo_chevron bottom" />
          {isRebranding ?
            <Label className={'filter-name rebranding'}>
              {heading}
              <div className={'rebranding-popup'}>
                <BmoPopUp
                  alsoOnMobile={true}
                  debug={false}
                  direction="horizontal-mid"
                  minHeight={300}
                >
                  <RichText richText={toolTip} />
                </BmoPopUp>
                <Image src={QUESTION_MARK_ICON} className="rebranding-tooltip" />
              </div>
            </Label>
            :
            <Label as={Button} content={heading} className={'filter-name'} />
          }
        </Accordion.Title>
        <Accordion.Content>
          <List className="checkBoxes">
            {
              list.map((listOption) => {
                const val = listOption.optionVal;
                const text = listOption.optionText;
                const triangleImage = isRebranding && val !== 'all' ? tierKeyMapping(tierMap[val]) : [];
                return (
                  <List.Item key={Math.random()}>
                    {isRebranding && val !== 'all' ? <Image alt={'Brand-triangle'} src={tierImageMap[triangleImage[0]]} className={'brand-triangle-icon'} /> : ''}
                    <Checkbox
                      ariaLabel={text}
                      label={text}
                      checked={selectedOptions[val] || false}
                      onClick={this.checkBoxClick(val, text)}
                      className={isRebranding && val !== 'all' ? 'rebranding-checkbox' : ''}
                    />
                  </List.Item>
                );
              })
            }
          </List>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default FilterAccordionWithCheckbox;
