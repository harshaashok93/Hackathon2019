/* @flow weak */

/*
 * Component: AdminSearchSelectionPannel
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Dropdown, Heading, Checkbox, List, Accordion, Label, Button } from 'unchained-ui-react';
import { connect } from 'react-redux';
import st from 'constants/strings';
import findIndex from 'lodash/findIndex';
import { sitenameVariable } from 'constants/UnchainedVariable';

import {
  SET_DEFAULT_SEARCH_RESULT_DATA
} from 'store/actions';
import {
  adminSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminSearchSelectionPannel.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminSearchSelectionPannel extends Component {
  props: {
    dropDownOption: {},
    listOption: {},
    defaultSearch: [],
    setDefaultSearchResult: () => void,
    savingChanges: bool,
  };

  static defaultProps = {
    listOption: {
      Location: [
        {
          optionText: 'Show all',
          optionVal: 'all'
        },
        {
          optionText: 'The U.S.',
          optionVal: 'us'
        },
        {
          optionText: 'Canada',
          optionVal: 'canada',
        },
        {
          optionText: 'Rest of the world',
          optionVal: 'other'
        },
      ],
      'Research Type': [
        {
          optionText: 'Show all',
          optionVal: 'all',
        },
        {
          optionText: 'Reports',
          optionVal: 'report',
        },
        {
          optionText: 'Comments',
          optionVal: 'comment',
        },
        {
          optionText: 'Flashes',
          optionVal: 'flash',
        },
        {
          optionText: 'Periodicals',
          optionVal: 'periodical',
        },
        {
          optionText: 'Videocasts',
          optionVal: 'videocast',
        },
        {
          optionText: 'Podcasts',
          optionVal: 'podcast',
        }
      ],
      'Research Category': [
        {
          optionText: 'Show all',
          optionVal: 'all'
        },
        {
          optionText: 'IN Fact',
          optionVal: 'tier_3'
        },
        {
          optionText: 'IN Depth',
          optionVal: 'tier_2',
        },
        {
          optionText: 'IN Front',
          optionVal: 'tier_1',
        },
      ],
      'Additional Filter': [
        {
          optionText: 'Launches',
          optionVal: 'launches',
        },
        {
          optionText: 'Ratings Upgrade',
          optionVal: 'increase'
        },
        {
          optionText: 'Ratings Downgrade',
          optionVal: 'decrease',
        },
        {
          optionText: 'Company Specific Only',
          optionVal: 'company_specific',
        },
        {
          optionText: 'Top 15 member',
          optionVal: 'top15',
        },
        {
          optionText: 'Include Equity Research',
          optionVal: 'include_equity',
        }
      ],
      Rating: [
        {
          optionText: 'Show all',
          optionVal: 'all'
        },
        {
          optionText: 'OP',
          optionVal: 'op',
        },
        {
          optionText: 'R',
          optionVal: 'r',
        },
        {
          optionText: 'MKT',
          optionVal: 'mkt',
        },
        {
          optionText: 'NR',
          optionVal: 'nr',
        },
        {
          optionText: 'Und',
          optionVal: 'und',
        },
      ]
    },
    dropDownOption: {
      strategy: [
        {
          key: 'Investment Strategy',
          value: 'Investment Strategy',
          text: 'Investment Strategy',
        },
        {
          key: 'US Strategy',
          value: 'US Strategy',
          text: 'US Strategy',
        },
        {
          key: 'Portfolio Strategy',
          value: 'Portfolio Strategy',
          text: 'Portfolio Strategy',
        },
        {
          key: 'Canadian Strategy',
          value: 'Canadian Strategy',
          text: 'Canadian Strategy',
        },
        {
          key: 'Small Caps Research',
          value: 'Small Caps Research',
          text: 'Small Caps Research',
        },
        {
          key: 'Videocasts',
          value: 'Videocasts',
          text: 'Videocasts',
        }
      ],
      qModel: [
        {
          key: 'LARGECAP',
          value: 'LARGECAP',
          text: 'Large Cap',
        },
        {
          key: 'SMALLCAP',
          value: 'SMALLCAP',
          text: 'Small Cap',
        }
      ]
    }
  };

  state = {
    library: {
      date_field: 24
    },
    strategy_reports: {
      date_field: 24
    },
    bmo_models: {
      date_field: 24
    },
    bmo_red: {},
    change_summary: {
      date_field: 24
    },
    q_model_daily_list: {},
  };

  componentWillMount() {
    this.props.defaultSearch.map((item) => {
      if (item.content !== null) {
        this.setState({
          [item.page_selection]: item.content
        });
      }
    });
  }

  numbers = () => {
    const data = [];
    let i = 1;
    for (i = 1; i < 30; i += 1) {
      data.push({ key: i, value: i, text: i });
    }
    return data;
  }

  handleDateChange = (type) => (e, { value }) => {
    const filter = this.state[type];
    filter.date_field = value;
    this.setState({
      [type]: filter
    });
  };

  dataRange = (type) => {
    return (
      <div className="indiviadual-filters">
        <div className="filter-title">Date Range</div>
        <Dropdown
          defaultValue={24}
          value={this.state[type].date_field || 24}
          className="dropdown-chevron bmo_chevron bottom date"
          selection
          options={this.numbers()}
          onChange={this.handleDateChange(type)}
          selectOnBlur={false}
        />
        <span>Weeks</span>
      </div>
    );
  }

  handleDropdownChange = (pageType, type) => (e, { value }) => {
    const filter = this.state[pageType];
    filter[type] = value;
    this.setState({
      [pageType]: filter
    });
  }

  getDropdown = (pageType, type) => {
    const { dropDownOption } = this.props;
    const data = dropDownOption[type];
    const defaults = this.state[pageType];
    return (
      <div className="indiviadual-filters">
        <div className="filter-title">Default Content Shown</div>
        <Dropdown
          value={defaults[type] || data[0].value}
          className="dropdown-chevron bmo_chevron bottom"
          selection
          options={data}
          onChange={this.handleDropdownChange(pageType, type)}
        />
      </div>
    );
  }

  handleCheckbox = (pagetype, type, val) => (e, checkBox) => {
    const { listOption } = this.props;
    let arrayValue = [];
    const defaults = this.state[pagetype];

    arrayValue = listOption[type].map((item) => item.optionVal);
    if (pagetype === 'bmo_red' && type === 'Location') {
      arrayValue.pop();
    }
    if (pagetype === 'podcast' && type === 'Research Type') {
      arrayValue = arrayValue.filter(item => item === 'all' || item === 'videocast' || item === 'podcast');
    }

    if (defaults[type]) {
      defaults[type][val] = checkBox.checked;
    } else {
      defaults[type] = {};
      defaults[type][val] = checkBox.checked;
    }

    if (val === 'all') {
      arrayValue.map(opt => {
        if (defaults[type]) {
          defaults[type][opt] = checkBox.checked;
        } else {
          defaults[type] = {};
          defaults[type][opt] = checkBox.checked;
        }
      });
    } else {
      const isAtleastOneDeselected = Object.keys(defaults[type]).filter(opt => (opt !== 'all' && defaults[type][opt] === false)).length > 0;
      if (isAtleastOneDeselected) {
        defaults[type].all = false;
      } else {
        defaults[type].all = true;
      }
    }
    this.setState({ [pagetype]: defaults });
  }

  getSplicedArray = (arr, type) => {
    const index = findIndex(arr, { optionVal: type });
    arr.splice(index, 1);
    return arr;
  }

  checkboxFilter = (pagetype, type) => {
    const { listOption } = this.props;
    let data = Object.assign([], listOption[type]);
    const defaults = this.state[pagetype][type];

    if (pagetype === 'bmo_red' && type === 'Location') {
      data.pop();
    }

    if (pagetype === 'library' && type === 'Additional Filter' && sitenameVariable.isEquity) {
      data = Object.assign([], this.getSplicedArray(data, 'include_equity'));
    } else if (pagetype === 'library' && type === 'Additional Filter' && sitenameVariable.isCorp) {
      data = Object.assign([], this.getSplicedArray(data, 'top15'));
    } else if (pagetype === 'podcast') {
      data = data.filter(item => item.optionText === 'Show all' || item.optionText === 'Videocasts' || item.optionText === 'Podcasts');
    }

    if (pagetype === 'library' && type === 'Research Category' && sitenameVariable.isCorp) {
      data = Object.assign([], this.getSplicedArray(data, 'podcast'));
    }

    return (
      <div className="indiviadual-filters">
        <div className="filter-title">{type}</div>
        <List className="checkBoxes">
          {
            data.map((item) => {
              const val = item.optionVal;
              const text = item.optionText;
              return (
                <List.Item key={Math.random()}>
                  <Checkbox
                    ariaLabel={text}
                    label={text}
                    checked={defaults ? defaults[val] : false}
                    onChange={this.handleCheckbox(pagetype, type, val)}
                  />
                </List.Item>
              );
            })
          }
        </List>
      </div>
    );
  }

  handleSubmit = (type) => {
    this.props.setDefaultSearchResult(
      {
        defaults: {
          key: type,
          content: this.state[type],
        }
      }
    );
    this.setState({ saveType: type });
  }

  render() {
    const sitename = sitenameVariable.sitename || 'Equity';
    return (
      <div className="admin-search-selection-pannel">
        <Heading as={'h2'} content={'Default Search Filters by Page'} className="filter-pref-change-heading" />
        {
          this.props.defaultSearch.map((item) => {
            if (item.page_selection === 'library') {
              return (
                <Accordion fluid>
                  <Accordion.Title>
                    <i aria-hidden="true" className="dropdown icon" title={st.showMoreLess} />
                    <Label as={'h4'} content={item.title} className={'accord-title'} />
                  </Accordion.Title>
                  <Accordion.Content>
                    {this.dataRange(item.page_selection)}
                    {this.checkboxFilter(item.page_selection, 'Location')}
                    {this.checkboxFilter(item.page_selection, 'Research Type')}
                    {sitename === 'Equity' && this.checkboxFilter(item.page_selection, 'Research Category')}
                    {this.checkboxFilter(item.page_selection, 'Additional Filter')}
                    <div className="button-div">
                      {this.state.saveType === item.page_selection && this.props.savingChanges ?
                        <Button secondary disabled content={'Saving...'} />
                        :
                        <Button secondary content={'Save Changes'} onClick={() => this.handleSubmit(item.page_selection)} />
                      }
                      {
                        this.state.saveType === item.page_selection && !this.props.savingChanges ?
                          <div className="change-will-reflect">Change has been saved, refresh after 5 minutes.</div>
                          : null
                      }
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            } else if (item.page_selection === 'strategy_reports' && sitename !== 'Corp') {
              return (
                <Accordion fluid>
                  <Accordion.Title>
                    <i aria-hidden="true" className="dropdown icon" />
                    <Label as={'h4'} content={item.title} className={'accord-title'} />
                  </Accordion.Title>
                  <Accordion.Content>
                    {this.dataRange(item.page_selection)}
                    {this.getDropdown(item.page_selection, 'strategy')}
                    <div className="button-div">
                      {this.state.saveType === item.page_selection && this.props.savingChanges ?
                        <Button secondary disabled content={'Saving...'} />
                        :
                        <Button secondary content={'Save Changes'} onClick={() => this.handleSubmit(item.page_selection)} />
                      }
                      {
                        this.state.saveType === item.page_selection && !this.props.savingChanges ?
                          <div className="change-will-reflect">Change has been saved, refresh after 5 minutes.</div>
                          : null
                      }
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            } else if (item.page_selection === 'bmo_models') {
              return (
                <Accordion fluid>
                  <Accordion.Title>
                    <i aria-hidden="true" className="dropdown icon" />
                    <Label as={'h4'} content={item.title} className={'accord-title'} />
                  </Accordion.Title>
                  <Accordion.Content>
                    {this.dataRange(item.page_selection)}
                    <div className="button-div">
                      {this.state.saveType === item.page_selection && this.props.savingChanges ?
                        <Button secondary disabled content={'Saving...'} />
                        :
                        <Button secondary content={'Save Changes'} onClick={() => this.handleSubmit(item.page_selection)} />
                      }
                      {
                        this.state.saveType === item.page_selection && !this.props.savingChanges ?
                          <div className="change-will-reflect">Change has been saved, refresh after 5 minutes.</div>
                          : null
                      }
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            } else if (item.page_selection === 'change_summary' && sitename !== 'Corp') {
              return (
                <Accordion fluid>
                  <Accordion.Title>
                    <i aria-hidden="true" className="dropdown icon" />
                    <Label as={'h4'} content={item.title} className={'accord-title'} />
                  </Accordion.Title>
                  <Accordion.Content>
                    {this.dataRange(item.page_selection)}
                    <div className="button-div">
                      {this.state.saveType === item.page_selection && this.props.savingChanges ?
                        <Button secondary disabled content={'Saving...'} />
                        :
                        <Button secondary content={'Save Changes'} onClick={() => this.handleSubmit(item.page_selection)} />
                      }
                      {
                        this.state.saveType === item.page_selection && !this.props.savingChanges ?
                          <div className="change-will-reflect">Change has been saved, refresh after 5 minutes.</div>
                          : null
                      }
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            } else if (item.page_selection === 'bmo_red' && sitename !== 'Corp') {
              return (
                <Accordion fluid>
                  <Accordion.Title>
                    <i aria-hidden="true" className="dropdown icon" />
                    <Label as={'h4'} content={item.title} className={'accord-title'} />
                  </Accordion.Title>
                  <Accordion.Content>
                    {this.checkboxFilter(item.page_selection, 'Location')}
                    {this.checkboxFilter(item.page_selection, 'Rating')}
                    <div className="button-div">
                      {this.state.saveType === item.page_selection && this.props.savingChanges ?
                        <Button secondary disabled content={'Saving...'} />
                        :
                        <Button secondary content={'Save Changes'} onClick={() => this.handleSubmit(item.page_selection)} />
                      }
                      {
                        this.state.saveType === item.page_selection && !this.props.savingChanges ?
                          <div className="change-will-reflect">Change has been saved, refresh after 5 minutes.</div>
                          : null
                      }
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            } else if (item.page_selection === 'q_model_daily_list' && sitename !== 'Corp') {
              return (
                <Accordion fluid>
                  <Accordion.Title>
                    <i aria-hidden="true" className="dropdown icon" />
                    <Label as={'h4'} content={item.title} className={'accord-title'} />
                  </Accordion.Title>
                  <Accordion.Content>
                    {this.getDropdown(item.page_selection, 'qModel')}
                    <div className="button-div">
                      {this.state.saveType === item.page_selection && this.props.savingChanges ?
                        <Button secondary disabled content={'Saving...'} />
                        :
                        <Button secondary content={'Save Changes'} onClick={() => this.handleSubmit(item.page_selection)} />
                      }
                      {
                        this.state.saveType === item.page_selection && !this.props.savingChanges ?
                          <div className="change-will-reflect">Change has been saved, refresh after 5 minutes.</div>
                          : null
                      }
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            } else if (item.page_selection === 'podcast' && sitename !== 'Corp') {
              return (
                <Accordion fluid>
                  <Accordion.Title>
                    <i aria-hidden="true" className="dropdown icon" />
                    <Label as={'h4'} content={item.title} className={'accord-title'} />
                  </Accordion.Title>
                  <Accordion.Content>
                    {this.dataRange(item.page_selection)}
                    {this.checkboxFilter(item.page_selection, 'Research Type')}
                    <div className="button-div">
                      {this.state.saveType === item.page_selection && this.props.savingChanges ?
                        <Button secondary disabled content={'Saving...'} />
                        :
                        <Button secondary content={'Save Changes'} onClick={() => this.handleSubmit(item.page_selection)} />
                      }
                      {
                        this.state.saveType === item.page_selection && !this.props.savingChanges ?
                          <div className="change-will-reflect">Change has been saved, refresh after 5 minutes.</div>
                          : null
                      }
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            }
            return null;
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  savingChanges: adminSelector.getSavingChanges(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDefaultSearchResult: (data) => {
    dispatch(SET_DEFAULT_SEARCH_RESULT_DATA(data));
  },
  setDefaultBMOModelsDate: (number) => {
    dispatch({ type: SET_BMO_MODELS_DATE, data: { from: moment().subtract(number, 'days').format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD') } });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminSearchSelectionPannel);
