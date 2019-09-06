/* @flow weak */

/*
 * Component: BmoRedFilters
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Grid, Checkbox, Divider, List, Modal, Label, Dropdown, Button, Input } from 'unchained-ui-react';
import { connect } from 'react-redux';
import { pushToDataLayer } from 'analytics';
import { getParameterByName, removeQueryParams } from 'utils';
import {
  bmoredSelector
} from 'store/selectors';
import {
  GET_BMO_RED_RESULTS,
} from 'store/actions';


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './BmoRedFilters.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class BmoRedFilters extends Component {
  props: {
    getBMORedResult: () => void,
    openBMORedTable: () => void,
    companyList: [],
    analystList: [],
    industryList: [],
    defaults: {},
  };

  static defaultProps = {
  };

  state = {
    showList: [],
    dropDownType: '',
    companyDropdownValues: [],
    industryDropdownValues: [],
    analystDropdownValues: [],
    value: 'rest',
    location: { all: false, us: false, canada: false },
    rating: { all: false, op: false, r: false, mkt: false, nr: false, und: false },
    locationTemp: { all: false, us: false, canada: false },
    ratingTemp: { all: false, op: false, r: false, mkt: false, nr: false, und: false },
    minimum: { marketCap: '', yield: '', totalReturn: '' },
    maximum: { currentPE: '', marketCap: '', nextPE: '' },
    minimumTemp: { marketCap: '', yield: '', totalReturn: '' },
    maximumTemp: { currentPE: '', marketCap: '', nextPE: '' },
    isOpen: false,
    mobDropValue: 'Company',
    error: {
      maximum: {},
      minimum: {}
    },
  }

  componentWillMount() {
    const { defaults } = this.props;
    const locationFilter = this.state.location;
    const ratingFilter = this.state.rating;
    if (defaults) {
      Object.keys(defaults.Location || {}).map((key) => { locationFilter[key] = defaults.Location[key]; return null; });
      Object.keys(defaults.Rating || {}).map((key) => { ratingFilter[key] = defaults.Rating[key]; return null; });
    }
    this.setState({ location: locationFilter, rating: ratingFilter });
  }

  componentWillReceiveProps(nextProps) {
    const { companyDropdownValues } = this.state;
    const { companyList } = nextProps;
    const showList = this.state.showList;
    const id = getParameterByName('ticker') || '';
    if (id && this.props.companyList !== nextProps.companyList) {
      companyDropdownValues.push(id - 0);
      companyList && companyList.map((item) => {
        if (item.value === id - 0) {
          showList.push({ text: item.text, value: item.value });
        }
      });
      this.setState({ showList, dropDownType: 'company' }, () => this.onClickStartBtn('outModal'));
    }
  }

  onDropdownValueChange = (name) => (e, { value }) => {
    let { companyDropdownValues, analystDropdownValues, industryDropdownValues, minimum, maximum } = this.state;
    const { dropDownType } = this.state;
    let showList = this.state.showList;
    const { companyList, analystList, industryList } = this.props;
    let isPresent = '';
    removeQueryParams();

    switch (name) {
      case 'company':
        if (dropDownType !== 'company') {
          analystDropdownValues = [];
          industryDropdownValues = [];
          showList = [];
        }
        isPresent = companyDropdownValues.filter((item) => item === value).length;
        if (isPresent <= 0) {
          companyDropdownValues.push(value);
        }
        companyList.map((item) => {
          if (item.value === value && isPresent <= 0) {
            showList.push({ text: item.text, value: item.value });
            pushToDataLayer('databoutique', 'searchFilter', { action: 'Company/ticker Drop down', label: item.text });
          }
        });
        this.setState({ showList, dropDownType: 'company' });
        minimum = Object.assign({}, { marketCap: '', yield: '', totalReturn: '' });
        maximum = Object.assign({}, { currentPE: '', marketCap: '', nextPE: '' });
        break;
      case 'industry':
        if (dropDownType !== 'sector') {
          analystDropdownValues = [];
          companyDropdownValues = [];
          showList = [];
        }
        isPresent = industryDropdownValues.filter((item) => item === value).length;
        if (isPresent <= 0) {
          industryDropdownValues.push(value);
        }
        industryList.map((item) => {
          if (item.value === value && isPresent <= 0) {
            showList.push({ text: item.text, value: item.value });
            pushToDataLayer('databoutique', 'searchFilter', { action: 'Industry/Sector Drop down', label: item.text });
          }
        });
        this.setState({ showList, dropDownType: 'sector' });
        break;
      case 'analyst':
        if (dropDownType !== 'analyst') {
          industryDropdownValues = [];
          companyDropdownValues = [];
          showList = [];
        }
        isPresent = analystDropdownValues.filter((item) => item === value).length;
        if (isPresent <= 0) {
          analystDropdownValues.push(value);
        }
        analystList.map((item) => {
          if (item.value === value && isPresent <= 0) {
            showList.push({ text: item.text, value: item.value });
            pushToDataLayer('databoutique', 'searchFilter', { action: 'Change Type Drop down', label: item.text });
          }
        });
        this.setState({ showList, dropDownType: 'analyst' });
        break;
      default:
        industryDropdownValues = [];
        companyDropdownValues = [];
        analystDropdownValues = [];
        break;
    }
    this.setState({ companyDropdownValues, industryDropdownValues, analystDropdownValues, minimum, maximum, showList });
  }

  handleRadioChange = (data, name) => (e, checkBox) => {
    const locationCol = { all: 'Show All', us: 'US', canada: 'Canada' };
    const { locationTemp } = this.state;
    const isChecked = !checkBox.checked;
    locationTemp[data] = isChecked;

    if (data === 'all') {
      Object.keys(locationCol).map(opt => {
        locationTemp[opt] = isChecked;
        return null;
      });
    } else {
      const isAtleastOneDeselected = Object.keys(locationTemp).filter(opt => (opt !== 'all' && locationTemp[opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        locationTemp.all = false;
      } else {
        locationTemp.all = true;
      }
    }

    this.setState({ locationTemp });
    pushToDataLayer('databoutique', 'searchFilter', { action: 'Location', label: name });
  }

  checkBoxClick = (data, name) => (e, checkBox) => {
    const ratingFirstCol = { all: 'Show All', op: 'OP', r: 'R', mkt: 'MKT', nr: 'NR', und: 'Und' };
    const { ratingTemp } = this.state;
    const isChecked = !checkBox.checked;

    ratingTemp[data] = isChecked;

    if (data === 'all') {
      Object.keys(ratingFirstCol).map(opt => {
        ratingTemp[opt] = isChecked;
        return null;
      });
    } else {
      const isAtleastOneDeselected = Object.keys(ratingTemp).filter(opt => (opt !== 'all' && ratingTemp[opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        ratingTemp.all = false;
      } else {
        ratingTemp.all = true;
      }
    }

    this.setState({ ratingTemp, hasFormChanged: true });
    pushToDataLayer('databoutique', 'searchFilter', { action: 'Rating', label: name });
  }

  handleInputChange = (type, name) => (e) => {
    const value = e.target.value;
    const { minimumTemp, maximumTemp } = this.state;
    switch (type) {
      case 'minimum':
        minimumTemp[name] = value;
        break;
      case 'maximum':
        maximumTemp[name] = value;
        break;
      default:
        break;
    }
    this.setState({ minimumTemp, maximumTemp, hasFormChanged: true });
  }

  validateField = (type, name) => (e) => {
    const value = e.target.value;
    const { minimumTemp, maximumTemp, error } = this.state;

    if (value && !(/^-?\d{1,3}(?:,?\d{3})*(?:\.\d*)?$/).test(value)) {
      error[type][name] = true;
      minimumTemp[name] = '';
      maximumTemp[name] = '';
      this.setState({ error, minimumTemp, maximumTemp });
      return false;
    }
    if (value !== '') {
      let fixedVal = '';
      if (name === 'Price to Book') {
        fixedVal = parseFloat(value).toFixed(1);
      } else {
        fixedVal = parseFloat(value).toFixed(2);
      }
      switch (type) {
        case 'minimum':
          minimumTemp[name] = fixedVal;
          break;
        case 'maximum':
          maximumTemp[name] = fixedVal;
          break;
        default:
          break;
      }
      if (name === 'marketCap' && minimumTemp[name] !== '' && maximumTemp[name] !== '' && parseFloat(minimumTemp[name]) > parseFloat(maximumTemp[name])) {
        error[type][name] = true;
        error.text = 'Max Value should be greater than Min';
        this.setState({ error, minimumTemp, maximumTemp });
        return false;
      } else if (name === 'marketCap') {
        error.maximum[name] = false;
        error.minimum[name] = false;
        error.text = '';
        this.setState({ error });
      }
    }
    error[type][name] = false;
    this.setState({ error, minimumTemp, maximumTemp });
    return true;
  }

  onClickStartBtn = (submitType) => {
    const {
      companyDropdownValues,
      industryDropdownValues,
      analystDropdownValues,
      rating,
      minimum,
      maximum,
      location,
      maximumTemp,
      minimumTemp,
      ratingTemp,
      locationTemp
    } = this.state;
    const min = submitType === 'inModal' ? minimumTemp : minimum;
    const max = submitType === 'inModal' ? maximumTemp : maximum;
    const ratingSubmit = submitType === 'inModal' ? ratingTemp : rating;
    const locationSubmit = submitType === 'inModal' ? locationTemp : location;
    const data = {
      companyDropdown: companyDropdownValues,
      industryDropdown: industryDropdownValues,
      analystDropdown: analystDropdownValues,
      ratingSubmit,
      min,
      max,
      locationSubmit,
    };
    this.setState({
      isOpen: false,
      error: {
        maximum: {},
        minimum: {},
        text: ''
      }
    });
    if (submitType === 'inModal') {
      this.setState({
        minimum: minimumTemp,
        maximum: maximumTemp,
        rating: ratingTemp,
        location: locationTemp
      });
    }
    this.props.getBMORedResult(data);
    this.props.openBMORedTable();
    pushToDataLayer('databoutique', 'setFieldRange', { action: 'Set Field Range' });
  }

  clearFields = () => {
    this.setState({
      minimumTemp: { marketCap: '', yield: '', totalReturn: '' },
      maximumTemp: { currentPE: '', marketCap: '', nextPE: '' },
      hasFormChanged: true
    });
  }

  deleteValue = (value) => {
    let { companyDropdownValues, analystDropdownValues, industryDropdownValues } = this.state;
    const { dropDownType } = this.state;
    const showList = this.state.showList;
    if (dropDownType === 'company') {
      companyDropdownValues = companyDropdownValues.filter(item => item !== value);
    } else if (dropDownType === 'sector') {
      industryDropdownValues = industryDropdownValues.filter(item => item !== value);
    } else {
      analystDropdownValues = analystDropdownValues.filter(item => item !== value);
    }
    this.setState({ showList: showList.filter(item => item.value !== value), companyDropdownValues, analystDropdownValues, industryDropdownValues });
  }

  handleMouseUp = (e) => {
    if ((e.target.className.indexOf('ui page modals dimmer transition visible active') > -1)) {
      // Adding new classname to overlay parent will not let to close overlay in tablets, on touch of background.
      this.handleClose();
    }
  }

  openModal = () => {
    const { minimum, maximum, location, rating } = this.state;
    document.body.addEventListener('touchstart', this.handleMouseUp);
    this.setState({
      isOpen: true,
      hasFormChanged: false,
      minimumTemp: Object.assign({}, minimum),
      maximumTemp: Object.assign({}, maximum),
      locationTemp: Object.assign({}, location),
      ratingTemp: Object.assign({}, rating),
    });
  }

  hideBodyScroll = () => () => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('noscroll');
  }

  showBodyScroll = () => () => {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll');
  }

  handleClose = () => {
    let canClose = true;
    if (this.state.hasFormChanged) {
      canClose = window.confirm('The Changes you made will be lost.\n Continue?'); // eslint-disable-line
    }
    if (canClose) {
      document.body.removeEventListener('touchstart', this.handleMouseUp);
      this.setState({
        isOpen: false,
        error: {
          maximum: {},
          minimum: {},
          text: ''
        }
      });
    }
  }

  mobDropChange = (e, { value }) => {
    this.setState({ mobDropValue: value, showList: [] });
  }

  render() {
    const { companyList, analystList, industryList } = this.props;
    const ratingFirstCol = { all: 'Show All', op: 'OP', r: 'R', mkt: 'MKT', nr: 'NR', und: 'Und' };
    const locationCol = { all: 'Show All', us: 'US', canada: 'Canada' };
    const minimumCol = { marketCap: 'Market Cap', yield: 'Yield', totalReturn: 'Total Return' };
    const maximumCol = { marketCap: 'Market Cap', currentPE: 'Current PE', nextPE: 'Next PE' };
    const { companyDropdownValues, showList, ratingTemp, minimumTemp, maximumTemp, locationTemp, dropDownType, mobDropValue } = this.state;
    const allMobileDropdown = [
      {
        key: 'sector',
        value: 'Sector',
        text: 'Sector',
      },
      {
        key: 'analyst',
        value: 'Analyst',
        text: 'Analyst',
      },
      {
        key: 'company',
        value: 'Company',
        text: 'Company',
      },
    ];
    return (
      <div className="bmo-red-filters">
        <Modal
          open={this.state.isOpen}
          className={'stock-screener-modal'}
          onMount={this.hideBodyScroll()}
          onUnmount={this.showBodyScroll()}
          onClose={() => this.handleClose()}
          closeOnDocumentClick={false}
          closeOnDimmerClick={true}
        >
          <Modal.Content>
            <div className="analysts-listing-overlay">
              <div className="close-button-bar">
                <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={() => this.handleClose()} />
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
                        {Object.keys(minimumCol).map((data, i) => {
                          const key = `${i}-min`;
                          return (
                            <List.Item className={'heading-input'} key={key}>
                              <Label className="input-label" content={data === 'marketCap' ? 'Market Cap (mm)' : minimumCol[data]} />
                              <Input
                                className={this.state.error.minimum[data] ? 'redBox' : ''}
                                disabled={companyDropdownValues.length > 0}
                                input={{
                                  value: minimumTemp[data],
                                  onChange: this.handleInputChange('minimum', data),
                                  onBlur: this.validateField('minimum', data),
                                  onFocus: this.validateField('minimum', data)
                                }}
                              />
                              {
                                this.state.error.minimum[data] ?
                                  <span className="error-text">{this.state.error.text}</span>
                                  : null
                              }
                            </List.Item>
                          );
                        })
                        }
                      </List>
                    </Grid.Column>
                    <Grid.Column className="filter-grid-column" mobile={12} tablet={6} computer={4}>
                      <div className="table-heading-mobile">Maximum</div>
                      <List>
                        {Object.keys(maximumCol).map((data, j) => {
                          const key = `${j}-max`;
                          return (
                            <List.Item className={'heading-input'} key={key}>
                              <Label className="input-label" content={data === 'marketCap' ? 'Market Cap (mm)' : maximumCol[data]} />
                              <Input
                                className={this.state.error.maximum[data] ? 'redBox' : ''}
                                disabled={companyDropdownValues.length > 0}
                                input={{
                                  value: maximumTemp[data],
                                  onChange: this.handleInputChange('maximum', data),
                                  onBlur: this.validateField('maximum', data),
                                  onFocus: this.validateField('maximum', data)
                                }}
                              />
                              {
                                this.state.error.maximum[data] ?
                                  <span className="error-text">{this.state.error.text}</span>
                                  : null
                              }
                            </List.Item>
                          );
                        })
                        }
                      </List>
                    </Grid.Column>
                    <Grid.Column className="filter-grid-column2" mobile={6} tablet={6} computer={2}>
                      <div className="table-heading-mobile">Ratings</div>
                      <List>
                        {Object.keys(ratingFirstCol).map((data) => {
                          return (
                            <List.Item>
                              <Checkbox
                                label={ratingFirstCol[data]}
                                checked={ratingTemp[data]}
                                onClick={this.checkBoxClick(data, ratingFirstCol[data])}
                              />
                            </List.Item>
                          );
                        })}
                      </List>
                    </Grid.Column>
                    <Grid.Column className="filter-grid-column2" mobile={6} tablet={6} computer={2}>
                      <div className="table-heading-mobile">Location</div>
                      <List>
                        {Object.keys(locationCol).map((data) => {
                          return (
                            <List.Item>
                              <Checkbox
                                label={locationCol[data]}
                                checked={locationTemp[data]}
                                onClick={this.handleRadioChange(data, locationCol[data])}
                              />
                            </List.Item>
                          );
                        })
                        }
                      </List>
                    </Grid.Column>
                  </Grid.Row>
                  <div className="button-section">
                    <Button content={'Clear All'} secondary onClick={this.clearFields} />
                    <Button className="second-button" content={'Done'} secondary onClick={() => this.onClickStartBtn('inModal')} />
                  </div>
                </Grid>
              </div>
            </div>
          </Modal.Content>
        </Modal>
        <div className="filters-and-buttons">
          <Button className="inline field field-range-button linkBtn filter-section-title bmo_chevron right" onClick={this.openModal} content={'Advanced Filters'} />
          <div className={'download-link'}>
            <div className="universal-download">
              <a target="_blank" href={'https://researchglobal.bmocapitalmarkets.com/documents/red/BMORedUniverse.pdf'}>
                <Button
                  secondary
                  className={'univer-link'}
                  content={'Download BMO RED Universe'}
                />
              </a>
            </div>
          </div>
          <Grid>
            <Grid.Column className={'filter-row'} mobile={12} tablet={12} computer={6}>
              <Grid.Row className={'mobile-dropdown'}>
                <Divider />
                <div className="mobile-span">Search By:</div>
                <Dropdown
                  placeholder={'Search'}
                  className="search"
                  selection
                  value={mobDropValue}
                  text={mobDropValue}
                  options={allMobileDropdown}
                  onChange={this.mobDropChange}
                />
              </Grid.Row>
              <Grid.Row
                className={`drops sector-dropdown ${showList.length && (dropDownType === 'sector') ? 'active-div' : 'inactive-div'} ${mobDropValue === 'Sector' ? 'mob-active-div' : 'mob-inactive-div'}`}
              >
                <div className="mobile-hide">Sector:</div>
                <Dropdown
                  placeholder={'Search'}
                  selection
                  search
                  value={''}
                  options={industryList}
                  onChange={this.onDropdownValueChange('industry')}
                  icon={'search'}
                  selectOnBlur={false}
                />
              </Grid.Row>
              <Grid.Row className={`drops sector-dropdown ${showList.length && (dropDownType === 'analyst') ? 'active-div' : 'inactive-div'} ${mobDropValue === 'Analyst' ? 'mob-active-div' : 'mob-inactive-div'}`}>
                <div className="mobile-hide">Analyst:</div>
                <Dropdown
                  placeholder={'Search'}
                  selection
                  search
                  value={''}
                  options={analystList}
                  onChange={this.onDropdownValueChange('analyst')}
                  icon={'search'}
                  selectOnBlur={false}
                />
              </Grid.Row>
              <Grid.Row className={`drops sector-dropdown ${showList.length && (dropDownType === 'company') ? 'active-div' : 'inactive-div'} ${mobDropValue === 'Company' ? 'mob-active-div' : 'mob-inactive-div'}`}>
                <div className="mobile-hide">Company:</div>
                <Dropdown
                  placeholder={'Search'}
                  selection
                  search
                  value={''}
                  options={companyList}
                  onChange={this.onDropdownValueChange('company')}
                  icon={'search'}
                  selectOnBlur={false}
                />
              </Grid.Row>
            </Grid.Column>
            {
              showList.length ?
                <Grid.Column className={`selected-section ${dropDownType ? 'active-selected' : 'inactive-selected'}`} mobile={12} tablet={12} computer={6}>
                  {
                    showList.map((item) => {
                      return (
                        <div className="selected-option-div">
                          <Button className="close-button mega-menu-close-icon bmo-close-btn" onClick={() => this.deleteValue(item.value)} />
                          {item.text}
                        </div>
                      );
                    })
                  }
                </Grid.Column>
                : null
            }
            <div className="sector-dropdown button-div bmo-red-btns">
              <div className="daily-pricing">Daily pricing completed at ~10 AM ET</div>
              <Button secondary className="inline field-range-button" onClick={() => this.onClickStartBtn('outModal')} content={'Submit'} />
            </div>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  mobileLayout: bmoredSelector.isMobileLayout(state),
});

const mapDispatchToProps = (dispatch) => ({
  getBMORedResult: (data) => {
    dispatch(GET_BMO_RED_RESULTS(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BmoRedFilters);
