/* @flow weak */

/*
 * Component: ProfileAutoSuggestComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Dropdown, Heading, Button, Grid } from 'unchained-ui-react';
import { BmoPopUp } from 'components';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ProfileAutoSuggestComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ProfileAutoSuggestComponent extends Component {
  props: {
    options: [],
    preSelectedResults: [],
    titleText: '',
    placeholder: '',
    handleResultUpdate: () => void,
    clearAllPreselect: () => void,
    typeText: ''
  };

  static defaultProps = {
    preSelectedResults: [],
    placeholder: 'Search',
    titleText: '',
    typeText: ''
  };

  state = {
    results: [],
    confirmPopUpOpen: false
  };

  componentWillReceiveProps(nextProps) {
    const { typeText, options, preSelectedResults } = nextProps;
    const results = options[typeText].filter(r => {
      const notAlreadySelected = preSelectedResults[typeText] ? preSelectedResults[typeText].filter(s => s.id === r.value).length === 0 : true;
      return (notAlreadySelected);
    });
    this.setState({ selectedResultSet: Object.assign([], preSelectedResults[typeText]), results });
  }

  handleResultSelect = (e, { value }) => {
    const { handleResultUpdate, typeText } = this.props;
    const textValue = this.props.options[typeText].filter((item) => item.value === value);
    if (handleResultUpdate) {
      handleResultUpdate(typeText, { type: 'update', id: value, title: textValue[0].text });
    }
  }

  removeSelectedOption = ({ id, title }) => {
    const { handleResultUpdate, typeText } = this.props;
    if (handleResultUpdate) {
      handleResultUpdate(typeText, { type: 'delete', id, title });
    }
  }

  clearSelection = () => {
    const { clearAllPreselect, typeText } = this.props;
    if (clearAllPreselect && typeText) {
      clearAllPreselect(typeText);
    }
  }

  closeConfirmPopUp = () => {
    this.setState({ confirmPopUpOpen: true });
  }
  clickFunction = () => {
    this.setState({ confirmPopUpOpen: false });
  }
  render() {
    const { results, confirmPopUpOpen } = this.state;
    const { titleText, placeholder, preSelectedResults, typeText } = this.props;
    return (
      <div className="profile-auto-suggest-component">
        <Grid className={'result-header-content'}>
          <Grid.Column className="section-head-title" computer={3} tablet={4} mobile={12}>
            <Heading content={titleText} as="h3" />
          </Grid.Column>
          <Grid.Column className="follow-type-dropdown" computer={4} tablet={4} mobile={12}>
            <Dropdown
              placeholder={placeholder}
              onChange={this.handleResultSelect}
              selection
              search
              value={''}
              className="searchBox"
              options={results}
              icon={'search'}
              selectOnBlur={false}
            />
          </Grid.Column>
          <Grid.Column className="clear-all-button" computer={3} tablet={4} mobile={12}>
            {
              preSelectedResults && preSelectedResults[typeText] && preSelectedResults[typeText].length ?
                <Button content="Clear All" className="customBtn customBtnH">
                  Clear All
                  <BmoPopUp
                    showOnClick={true}
                    alsoOnMobile={true}
                    forceHide={confirmPopUpOpen}
                    minHeight={120}
                    minWidth={350}
                    hideController="click"
                    hideOnScroll={true}
                    clickFunction={this.clickFunction}
                  >
                    <div className="confirmation-pop-up">
                      <span className="col-md-12 pop-up-title">Are you sure?</span>
                      <span className="pop-up-desc">{preSelectedResults[typeText].length > 1 ? `All ${preSelectedResults[typeText].length} selected` : 'Selected ' } {typeText.replace(/_/g, ' ')} will be cleared.</span>
                      <div className="button-holder">
                        <Button className="conf-btn" content="Yes" onClick={this.clearSelection} />
                        <Button className="conf-btn" content="No" onClick={this.closeConfirmPopUp} />
                      </div>
                    </div>
                  </BmoPopUp>
                </Button>
                : null
            }
          </Grid.Column>
        </Grid>
        {
          preSelectedResults && preSelectedResults[typeText] && preSelectedResults[typeText].length ?
            <Grid className="result-selection-container">
              {
                preSelectedResults && preSelectedResults[typeText] && preSelectedResults[typeText].map((result, i) => {
                  return (
                    <Grid.Column computer={2} tablet={3} mobile={6} className="result-item" key={`${i + 1}`}>
                      <span className="text">{result.title}</span>
                      <Button className="bmo-close-btn bg-icon-props" onClick={() => this.removeSelectedOption(result)} />
                    </Grid.Column>
                  );
                })
              }
            </Grid>
            : null
        }
      </div>
    );
  }
}

export default ProfileAutoSuggestComponent;
