/* @flow weak */

/*
 * Component: StockScreenerFilterOverlay
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Grid, List, Checkbox, Label, Input } from 'unchained-ui-react';
import { numberWithCommas } from 'utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './StockScreenerFilterOverlay.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class StockScreenerFilterOverlay extends Component {
  props: {
    closeModal: () => void,
    handleSubmit: () => void,
    filters: {},
  };

  static defaultProps = {
  };

  state = {
    error: {},
  }

  componentWillMount() {
    const { filters } = this.props;
    const filterState = JSON.parse(JSON.stringify(filters));
    this.setState({
      ...filterState,
      hasFormChanged: false,
    });
  }

  handleClose = () => {
    const { filters } = this.props;
    const filterState = JSON.parse(JSON.stringify(filters));
    let canClose = true;
    if (this.state.hasFormChanged) {
      canClose = window.confirm('The Changes you made will be lost.\n Continue?'); // eslint-disable-line
    }
    if (canClose) {
      this.setState({
        ...filterState
      });
      this.props.closeModal();
    }
  }

  ratingCheckBoxClick = (data) => (e, checkBox) => {
    const ratingFilters = { all: 'Show all', OP: 'OP', MKT: 'MKT', UND: 'UND', R: 'R', NR: 'NR' };
    const { rating } = this.state;
    const isChecked = !checkBox.checked;
    rating[data] = isChecked;

    if (data === 'all') {
      Object.keys(ratingFilters).map(opt => {
        rating[opt] = isChecked;
        return null;
      });
    } else {
      const isAtleastOneDeselected = Object.keys(rating).filter(opt => (opt !== 'all' && rating[opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        rating.all = false;
      } else {
        rating.all = true;
      }
    }

    this.setState({ rating, hasFormChanged: true });
  }

  locationCheckBoxClick = (data) => (e, checkBox) => {
    const locationCol = { ALL: 'Show all', US: 'The U.S.', CA: 'Canada' };
    const { location } = this.state;
    const isChecked = !checkBox.checked;
    location[data] = isChecked;

    if (data === 'ALL') {
      Object.keys(locationCol).map(opt => {
        location[opt] = isChecked;
        return null;
      });
    } else {
      const isAtleastOneDeselected = Object.keys(location).filter(opt => (opt !== 'ALL' && location[opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        location.ALL = false;
      } else {
        location.ALL = true;
      }
    }

    this.setState({ location, hasFormChanged: true });
  }

  getNumber = (str) => {
    if (str) {
      return `${str}`.replace(/,/g, '') - 0;
    }
    return '';
  }

  handleMinInputChange = (value, name) => {
    const { minimum } = this.state;
    minimum[name] = value.replace(/\s/g, '');
    this.setState({ minimum, hasFormChanged: true });
  }

  handleMaxInputChange = (value, name) => {
    const { maximum } = this.state;
    maximum[name] = value.replace(/\s/g, '');
    this.setState({ maximum, hasFormChanged: true });
  }

  handleMinimumInputChange = (value, name) => {
    const { minimum, error, maximum } = this.state;
    if (value && !((/^-?\d{1,3}(?:,?\d{3})*(?:\.\d*)?$/).test(value))) {
      error[name] = true;
      this.setState({ error });
      minimum[name] = '';
      this.setState({ minimum });
      return false;
    }
    if (name === 'MinCap' && parseFloat(minimum.MinCap) > parseFloat(maximum.MaxCap)) {
      error[name] = true;
      error.text = 'Max Value should be greater than Min';
      this.setState({ minimum, error });
      return false;
    } else if (name === 'MinCap') {
      error[name] = false;
      error.text = '';
      this.setState({ error });
    }
    minimum[name] = value;
    error[name] = false;
    this.setState({ minimum });
    return true;
  }

  handleMaximumInputChange = (value, name) => {
    const { maximum, error, minimum } = this.state;
    // let fieldErrors = {};
    if (value && !((/^-?\d{1,3}(?:,?\d{3})*(?:\.\d*)?$/).test(value))) {
      error[name] = true;
      this.setState({ error });
      maximum[name] = '';
      this.setState({ maximum });
      return false;
    }
    if (name === 'MaxCap' && parseFloat(minimum.MinCap) > parseFloat(maximum.MaxCap)) {
      error[name] = true;
      error.text = 'Max Value should be greater than Min';
      this.setState({ error });
      return false;
    } else if (name === 'MaxCap') {
      error[name] = false;
      error.text = '';
      this.setState({ error });
    }
    // if (minimum[name] && parseFloat((getNumber(value))) > parseFloat((getNumber(minimum[name])))) {
    //   fieldErrors.name = true;
    //   this.setState({ fieldErrors });
    //   return false;
    // }
    // fieldErrors = {};
    maximum[name] = value;
    error[name] = false;
    this.setState({ maximum });
    return true;
  }

  handleSubmit = () => {
    let data = {};
    data = this.state;
    data.error = {};
    this.props.handleSubmit(data);
    this.props.closeModal();
  }

  clearFields = () => {
    const minimum = { Min2YrEPSGrowth: '', MinCap: '', MinYield: '', MinTotalReturn: '', Min1YrPriceChange: '' };
    const maximum = { MaxCurrentPE: '', MaxCap: '', MaxNextPE: '', MaxPrice2BookVal: '', Max1YrPriceChange: '' };
    this.setState({ minimum, maximum, hasFormChanged: true });
  }

  reFormatNumberField = (value, name, type) => {
    const { minimum, maximum, error } = this.state;
    error[name] = false;
    this.setState({ error });
    if (name) {
      if (type === 'min') {
        const isValueValid = this.handleMinimumInputChange(value, name);
        if (!isValueValid) return;
        minimum[name] = numberWithCommas(value);
        this.setState({ minimum });
      }
      if (type === 'max') {
        const isValueValid = this.handleMaximumInputChange(value, name);
        if (!isValueValid) return;
        maximum[name] = numberWithCommas(value);
        this.setState({ maximum });
      }
    }
  }

  render() {
    const { rating, location, minimum, maximum, fieldErrors } = this.state;
    const ratingFilters = { all: 'Show all', OP: 'OP', MKT: 'MKT', UND: 'UND', R: 'R', NR: 'NR' };
    const locationFilters = { ALL: 'Show all', US: 'The U.S.', CA: 'Canada' };
    return (
      <div className="analysts-listing-overlay">
        <div className="close-button-bar">
          <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={this.handleClose} />
        </div>
        <div className="stock-screener-grid-container">
          <div className="title">Set Advanced Filters</div>
          <Grid className="stock-screener-grid">
            <Grid.Row className="heading-grid-row">
              <Grid.Column className="" mobile={12} tablet={6} computer={4}>
                Minimum
              </Grid.Column>
              <Grid.Column className="" mobile={12} tablet={6} computer={4}>
                Maximum
              </Grid.Column>
              <Grid.Column className="" mobile={12} tablet={6} computer={2}>
                Ratings
              </Grid.Column>
              <Grid.Column className="" mobile={12} tablet={6} computer={2}>
                Location
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column className="filter-grid-column" mobile={12} tablet={6} computer={4}>
                <div className="table-heading-mobile">Minimum</div>
                <List>
                  <List.Item>
                    <Label className={'input-label'} content={'2yr EPS Gr'} />
                    <Input
                      className={this.state.error.Min2YrEPSGrowth ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          onChange: (e) => this.handleMinInputChange(e.target.value, 'Min2YrEPSGrowth'),
                          value: minimum.Min2YrEPSGrowth || '',
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'Min2YrEPSGrowth', 'min'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'Min2YrEPSGrowth', 'min')
                        }
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <Label className={'input-label'} content={'Market Cap (mm)'} />
                    <Input
                      className={this.state.error.MinCap ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'MinCap',
                          value: minimum.MinCap,
                          onChange: (e) => this.handleMinInputChange(e.target.value, 'MinCap'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'MinCap', 'min'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'MinCap', 'min')
                        }
                      }
                    />
                    {
                      this.state.error.MinCap ?
                        <span className="error-text">{this.state.error.text}</span>
                        : null
                    }
                  </List.Item>
                  <List.Item>
                    <Label className={'input-label'} content={'MinYield'} />
                    <Input
                      className={this.state.error.MinYield ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'MinYield',
                          value: minimum.MinYield,
                          onChange: (e) => this.handleMinInputChange(e.target.value, 'MinYield'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'MinYield', 'min'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'MinYield', 'min')
                        }
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <Label className={'input-label'} content={'Total Return'} />
                    <Input
                      className={this.state.error.MinTotalReturn ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'MinTotalReturn',
                          value: minimum.MinTotalReturn,
                          onChange: (e) => this.handleMinInputChange(e.target.value, 'MinTotalReturn'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'MinTotalReturn', 'min'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'MinTotalReturn', 'min')
                        }
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <Label className={'input-label'} content={'1Yr Price Change'} />
                    <Input
                      className={this.state.error.Min1YrPriceChange ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'Min1YrPriceChange',
                          value: minimum.Min1YrPriceChange,
                          onChange: (e) => this.handleMinInputChange(e.target.value, 'Min1YrPriceChange'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'Min1YrPriceChange', 'min'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'Min1YrPriceChange', 'min')
                        }
                      }
                    />
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column className="filter-grid-column" mobile={12} tablet={6} computer={4}>
                <div className="table-heading-mobile">Maximum</div>
                <List>
                  <List.Item>
                    <Label className={'input-label'} content={'Current PE'} />
                    <Input
                      className={this.state.error.MaxCurrentPE ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'MaxCurrentPE',
                          value: maximum.MaxCurrentPE,
                          onChange: (e) => this.handleMaxInputChange(e.target.value, 'MaxCurrentPE'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'MaxCurrentPE', 'max'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'MaxCurrentPE', 'max')
                        }
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <Label className={'input-label'} content={'Market Cap (mm)'} />
                    <Input
                      className={this.state.error.MaxCap ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'MaxCap',
                          value: maximum.MaxCap,
                          onChange: (e) => this.handleMaxInputChange(e.target.value, 'MaxCap'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'MaxCap', 'max'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'MaxCap', 'max')
                        }
                      }
                    />
                    {
                      this.state.error.MaxCap ?
                        <span className="error-text">{this.state.error.text}</span>
                        : null
                    }
                    {fieldErrors.MaxCap === true ? <div className="errorMsg">Max Value should be greater than Min</div> : null}
                  </List.Item>
                  <List.Item>
                    <Label className={'input-label'} content={'Next PE'} />
                    <Input
                      className={this.state.error.MaxNextPE ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'MaxNextPE',
                          value: maximum.MaxNextPE,
                          onChange: (e) => this.handleMaxInputChange(e.target.value, 'MaxNextPE'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'MaxNextPE', 'max'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'MaxNextPE', 'max')
                        }
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <Label className={'input-label'} content={'1Yr Price Change'} />
                    <Input
                      className={this.state.error.Max1YrPriceChange ? 'redBox' : ''}
                      input={
                        {
                          type: 'text',
                          name: 'Max1YrPriceChange',
                          value: maximum.Max1YrPriceChange,
                          onChange: (e) => this.handleMaxInputChange(e.target.value, 'Max1YrPriceChange'),
                          onFocus: (e) => this.reFormatNumberField(e.target.value, 'Max1YrPriceChange', 'max'),
                          onBlur: (e) => this.reFormatNumberField(e.target.value, 'Max1YrPriceChange', 'max')
                        }
                      }
                    />
                    {fieldErrors.Max1YrPriceChange === true ? <div className="errorMsg">Max Value should be greater than Min</div> : null}
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column className="filter-grid-column2" mobile={6} tablet={6} computer={2}>
                <div className="table-heading-mobile">Ratings</div>
                <List>
                  {Object.keys(ratingFilters).map(data => {
                    return (
                      <List.Item key={Math.random()}>
                        <Checkbox
                          label={ratingFilters[data]}
                          checked={rating[data]}
                          onClick={this.ratingCheckBoxClick(data)}
                        />
                      </List.Item>
                    );
                  })}
                </List>
              </Grid.Column>
              <Grid.Column className="filter-grid-column2" mobile={6} tablet={6} computer={2}>
                <div className="table-heading-mobile">Location</div>
                <List>
                  {Object.keys(locationFilters).map(data => {
                    return (
                      <List.Item>
                        <Checkbox
                          label={locationFilters[data]}
                          checked={location[data]}
                          onClick={this.locationCheckBoxClick(data)}
                        />
                      </List.Item>
                    );
                  })}
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div className="button-section">
            <Button content={'Clear All'} secondary onClick={this.clearFields} />
            <Button content={'Done'} secondary onClick={this.handleSubmit} className="second-button" />
          </div>
        </div>
      </div>
    );
  }
}

export default StockScreenerFilterOverlay;

