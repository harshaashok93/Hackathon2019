/* @flow weak */

/*
 * Component: AdminRegistrationPanel
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Input, Dropdown, Button, Icon, Modal, Checkbox, Loader } from 'unchained-ui-react';
import { AdminSummaryCard } from 'components';
import { connect } from 'react-redux';
import Pagination from 'rc-pagination';
import { libraryURLPush, removeQueryParams, getParameterByName } from 'utils';

import {
  adminSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminRegistrationPanel.scss';
import './pagination.css';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminRegistrationPanel extends Component {
  props: {
    statusLists: [],
    userLists: [],
    pageName: '',
    history: {},
    statusDropdownChange: () => void,
    clientLookUpApi: () => void,
    onEnter: () => void,
    sortingApi: () => void,
    clientLookUpData: [],
    isClientLookupLoading: bool,
    submitAdvanceFilter: () => void,
    userCount: number,
    isCountLoading: bool,
    advanceFilterStatus: '',
    resetAdvanceFilterStatus: () => void,
    userTotal: number,
    onPageChange: () => void,
    pendingUserCount: number,
    pageurlRedirectGetData: () => void,
  };

  static defaultProps = {
  };

  defaultFilterState = {
    access: {
      title: 'Access',
      options: {
        status: {
          title: 'Status',
          options: {
            all: {
              title: 'All',
              checked: false
            },
            Pending_with_access: {
              title: 'Pending',
              checked: true
            },
            Pending_without_access: {
              title: 'Pending (no access)',
              checked: false
            },
            Approved: {
              title: 'Approved',
              checked: false
            },
            Trial: {
              title: 'Trial',
              checked: false
            },
            Denied: {
              title: 'Denied',
              checked: false
            },
            Expired: {
              title: 'Expired',
              checked: false
            },
          }
        },
        equity: {
          title: 'Equity',
          options: {
            all: {
              title: 'All',
              checked: true
            },
            enabled: {
              title: 'Enabled',
              checked: false
            },
            disabled: {
              title: 'Disabled',
              checked: false
            }
          }
        },
        corpdebt: {
          title: 'Corp. Debt',
          options: {
            all: {
              title: 'All',
              checked: true
            },
            enabled: {
              title: 'Enabled',
              checked: false
            },
            disabled: {
              title: 'Disabled',
              checked: false
            }
          }
        },
        cannabis: {
          title: 'Cannabis',
          options: {
            all: {
              title: 'All',
              checked: true
            },
            enabled: {
              title: 'Enabled',
              checked: false
            },
            disabled: {
              title: 'Disabled',
              checked: false
            }
          }
        }
      }
    },
    tiers: {
      title: 'Tier',
      options: {
        tier1: {
          title: 'Tier 1',
          options: {
            all: {
              title: 'All',
              checked: true
            },
            enabled: {
              title: 'Enabled',
              checked: false
            },
            disabled: {
              title: 'Disabled',
              checked: false
            }
          }
        },
        tier2: {
          title: 'Tier 2',
          options: {
            all: {
              title: 'All',
              checked: true
            },
            enabled: {
              title: 'Enabled',
              checked: false
            },
            disabled: {
              title: 'Disabled',
              checked: false
            }
          }
        },
        tier3: {
          title: 'Tier 3',
          options: {
            all: {
              title: 'All',
              checked: true
            },
            enabled: {
              title: 'Enabled',
              checked: false
            },
            disabled: {
              title: 'Disabled',
              checked: false
            }
          }
        }
      }
    },
    region: {
      title: 'Region',
      options: {
        region: {
          title: 'Region',
          options: {
            all: {
              title: 'All',
              checked: true
            },
            'North America': {
              title: 'North America',
              checked: false
            },
            'Asia Pacific': {
              title: 'Asia Pacific',
              checked: false
            },
            Europe: {
              title: 'Europe',
              checked: false
            }
          }
        }
      }
    }
  };
  state = {
    toggleState: 'created_at',
    sortOrder: 'desc',
    searchTextValue: '',
    currentStatus: 'Pending_with_access',
    filterModal: false,
    currentFilterState: {
      access: {
        title: 'Access',
        options: {
          status: {
            title: 'Status',
            options: {
              all: {
                title: 'All',
                checked: false
              },
              Pending_with_access: {
                title: 'Pending',
                checked: true
              },
              Pending_without_access: {
                title: 'Pending (no access)',
                checked: false
              },
              Approved: {
                title: 'Approved',
                checked: false
              },
              Trial: {
                title: 'Trial',
                checked: false
              },
              Denied: {
                title: 'Denied',
                checked: false
              },
              Expired: {
                title: 'Expired',
                checked: false
              },
            }
          },
          equity: {
            title: 'Equity',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          },
          corpdebt: {
            title: 'Corp. Debt',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          },
          cannabis: {
            title: 'Cannabis',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          }
        }
      },
      tiers: {
        title: 'Tier',
        options: {
          tier1: {
            title: 'Tier 1',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          },
          tier2: {
            title: 'Tier 2',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          },
          tier3: {
            title: 'Tier 3',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          }
        }
      },
      region: {
        title: 'Region',
        options: {
          region: {
            title: 'Region',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              'North America': {
                title: 'North America',
                checked: false
              },
              'Asia Pacific': {
                title: 'Asia Pacific',
                checked: false
              },
              Europe: {
                title: 'Europe',
                checked: false
              }
            }
          }
        }
      }
    },
    previousFilterState: {
      access: {
        title: 'Access',
        options: {
          status: {
            title: 'Status',
            options: {
              all: {
                title: 'All',
                checked: false
              },
              Pending_with_access: {
                title: 'Pending',
                checked: true
              },
              Pending_without_access: {
                title: 'Pending (no access)',
                checked: false
              },
              Approved: {
                title: 'Approved',
                checked: false
              },
              Trial: {
                title: 'Trial',
                checked: false
              },
              Denied: {
                title: 'Denied',
                checked: false
              },
              Expired: {
                title: 'Expired',
                checked: false
              },
            }
          },
          equity: {
            title: 'Equity',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          },
          corpdebt: {
            title: 'Corp. Debt',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          },
          cannabis: {
            title: 'Cannabis',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: false
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          }
        }
      },
      tiers: {
        title: 'Tier',
        options: {
          tier1: {
            title: 'Tier 1',
            options: {
              all: {
                title: 'All',
                checked: false
              },
              enabled: {
                title: 'Enabled',
                checked: true
              },
              disabled: {
                title: 'Disabled',
                checked: false
              }
            }
          },
          tier2: {
            title: 'Tier 2',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: true
              },
              disabled: {
                title: 'Disabled',
                checked: true
              }
            }
          },
          tier3: {
            title: 'Tier 3',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              enabled: {
                title: 'Enabled',
                checked: true
              },
              disabled: {
                title: 'Disabled',
                checked: true
              }
            }
          }
        }
      },
      region: {
        title: 'Region',
        options: {
          region: {
            title: 'Region',
            options: {
              all: {
                title: 'All',
                checked: true
              },
              'North America': {
                title: 'North America',
                checked: false
              },
              'Asia Pacific': {
                title: 'Asia Pacific',
                checked: false
              },
              Europe: {
                title: 'Europe',
                checked: false
              }
            }
          }
        }
      }
    },
    status: ['Pending_with_access'],
    previousStatus: ['Pending_with_access'],
    equity: '',
    corpdebt: '',
    cannabis: '',
    tier1: '',
    tier2: '',
    tier3: '',
    region: [],
    pageNumber: 1
  }

  setFilterState = () => {
    // Function to pick all the filter values from the URL and make api to get the filtered data.
    const { currentFilterState, status, equity, corpdebt, tier1, tier2, tier3, region, cannabis } = this.state;

    let { currentStatus, searchTextValue, toggleState, sortOrder, pageNumber } = this.state;

    const urlFilteredData = {
      status: [],
      region: [],
    };

    const urlValue = {
      status: getParameterByName('stat'),
      equity: getParameterByName('eq'),
      corpdebt: getParameterByName('cor'),
      cannabis: getParameterByName('can'),
      tier1: getParameterByName('t1'),
      tier2: getParameterByName('t2'),
      tier3: getParameterByName('t3'),
      searchText: getParameterByName('search'),
      name: getParameterByName('name'),
      order: getParameterByName('order'),
      page: getParameterByName('page'),
      region: getParameterByName('region'),
    };

    if (urlValue.searchText) {
      searchTextValue = urlValue.searchText;
    }

    if (urlValue.name && urlValue.order) {
      toggleState = urlValue.name;
      sortOrder = urlValue.order;
    }

    if (urlValue.page) {
      pageNumber = urlValue.page;
    }

    Object.keys(currentFilterState).map((header) => {
      Object.keys(currentFilterState[header].options).map((key) => {
        if (key === 'status' || key === 'region') {
          Object.keys(currentFilterState[header].options[key].options).map((item) => {
            if (urlValue[key] && (urlValue[key].length > 0)) {
              if (urlValue[key].split(',').indexOf(item) > -1) {
                currentFilterState[header].options[key].options[item].checked = true;
                if (key === 'status' && item !== 'all') {
                  //  For status, if the value is "all" we need to keep this value as empty array.
                  urlFilteredData.status.push(item);
                } else if (key === 'region' && item !== 'all') {
                  //  For region, if the value is "all" we need to keep this value as empty array.
                  urlFilteredData.region.push(item);
                }
              } else {
                // Only the values recieved in URL should be set to true, rest all false for status and region
                currentFilterState[header].options[key].options[item].checked = false;
              }
            }
          });
        } else if (urlValue[key]) {
          Object.keys(currentFilterState[header].options[key].options).map((data) => {
            if (urlValue[key] === data) {
              currentFilterState[header].options[key].options[data].checked = true;
              if (data === 'enabled') {
                urlFilteredData[key] = true;
              } else if (data === 'disabled') {
                urlFilteredData[key] = false;
              } else {
                urlFilteredData[key] = '';
              }
            } else {
              currentFilterState[header].options[key].options[data].checked = false;
            }
          });
        }
      });
    });

    if (urlValue.status && urlFilteredData.status) {
      switch (urlFilteredData.status.length) {
        case 0 :
          currentStatus = 'All';
          break;
        case 1:
          currentStatus = urlFilteredData.status[0];
          break;
        default:
          currentStatus = '';
      }
    }

    this.setState({
      currentFilterState,
      currentStatus,
      searchTextValue,
      toggleState,
      sortOrder,
      pageNumber: parseInt(pageNumber, 10),
      status: (urlValue.status && urlFilteredData.status) || status,
      equity: urlValue.equity ? urlFilteredData.equity : equity,
      corpdebt: urlValue.corpdebt ? urlFilteredData.corpdebt : corpdebt,
      tier1: urlValue.tier1 ? urlFilteredData.tier1 : tier1,
      tier2: urlValue.tier2 ? urlFilteredData.tier2 : tier2,
      tier3: urlValue.tier3 ? urlFilteredData.tier3 : tier3,
      region: (urlValue.region && urlFilteredData.region) || region,
      cannabis: urlValue.cannabis ? urlFilteredData.cannabis : cannabis,
    }, () => {
      const urlApiData = {
        searchData: searchTextValue,
        sortValue: toggleState,
        sortOrder,
        filterData: (urlValue.status && urlFilteredData.status) || status,
        equity_access: urlValue.equity ? urlFilteredData.equity : equity,
        corp_access: urlValue.corpdebt ? urlFilteredData.corpdebt : corpdebt,
        cannabis_access: urlValue.cannabis ? urlFilteredData.cannabis : cannabis,
        tier1_access: urlValue.tier1 ? urlFilteredData.tier1 : tier1,
        tier2_access: urlValue.tier2 ? urlFilteredData.tier2 : tier2,
        tier3_access: urlValue.tier3 ? urlFilteredData.tier3 : tier3,
        region: (urlValue.region && urlFilteredData.region) || region,
        page_number: pageNumber,
      };
      this.props.pageurlRedirectGetData(urlApiData);
    });
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      this.setFilterState();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { advanceFilterStatus } = nextProps;
    const { currentFilterState, previousFilterState, previousStatus, status } = this.state;
    if (advanceFilterStatus === 'originalValue') {
      this.setState({ status: previousStatus, currentFilterState: JSON.parse(JSON.stringify(previousFilterState)) }, () => {
        this.props.resetAdvanceFilterStatus('sameValue');
      });
    } else if (advanceFilterStatus === 'newValue') {
      this.setState({ previousStatus: status, previousFilterState: JSON.parse(JSON.stringify(currentFilterState)) }, () => {
        this.props.resetAdvanceFilterStatus('sameValue');
      });
    }
  }

  componentWillMount() {
    this.setFilterState();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  toggleState = (name) => {
    const { toggleState } = this.state;
    let { sortOrder } = this.state;
    if (toggleState === name) {
      if (sortOrder === 'asc') {
        sortOrder = 'desc';
      } else {
        sortOrder = 'asc';
      }
    } else {
      sortOrder = 'asc';
    }
    this.setState({ toggleState: name, sortOrder, pageNumber: 1 });
    const data = {
      data: name,
      order: sortOrder,
    };
    const urlQuery = `name=${encodeURIComponent(name)}&order=${encodeURIComponent(sortOrder)}&page=${encodeURIComponent('1')}`;
    libraryURLPush(urlQuery);
    this.props.sortingApi(data);
  }

  onStatusDropDownChange = (e, { value }) => {
    const { currentFilterState } = this.state;
    const thirdLevelOption = currentFilterState.access.options.status.options;
    Object.keys(thirdLevelOption).map((data) => {
      const dataVal = data;
      const firstLetterCaps = dataVal.charAt(0).toUpperCase() + dataVal.slice(1);
      if (value === firstLetterCaps) {
        thirdLevelOption[dataVal].checked = true;
      } else {
        thirdLevelOption[dataVal].checked = false;
      }
    });
    this.setState({ currentStatus: value, currentFilterState, pageNumber: 1 });
    this.props.statusDropdownChange(value);
    if (value) {
      const urlQuery = value === 'All' ? `stat=${encodeURIComponent('all')}&page=${encodeURIComponent('1')}` : `stat=${encodeURIComponent(value)}&page=${encodeURIComponent('1')}`;
      libraryURLPush(urlQuery);
    }
  }

  submitSearchForm = (e) => {
    const value = e.target.value;
    if (e.key === 'Enter') {
      this.setState({ pageNumber: 1 }, () => {
        this.props.onEnter(value);
        if (value) {
          const urlQuery = `search=${encodeURIComponent(value)}&page=${encodeURIComponent('1')}`;
          libraryURLPush(urlQuery);
        }
      });
    }
  }

  handleSearchChange = (e) => {
    const value = e.target.value;
    this.setState({ searchTextValue: value }, () => {
      if (value === '') {
        const urlQuery = `search=${encodeURIComponent('')}&page=${encodeURIComponent('1')}`;
        libraryURLPush(urlQuery);
        this.setState({ pageNumber: 1 }, () => {
          this.props.onEnter(value);
        });
      }
    });
  }

  clentLookUpData = () => (email) => {
    this.props.clientLookUpApi(email);
  }

  openFilterModal = () => {
    this.setState({ filterModal: true });
    document.body.classList.add('noscroll');
  }

  closeFilterModal = () => {
    this.setState({ filterModal: false });
    document.body.classList.remove('noscroll');
  }

  onAdvanceFilterClose = () => {
    const { previousStatus } = this.state;
    this.setState({ status: previousStatus, filterModal: false }, () => {
      this.props.resetAdvanceFilterStatus('originalValue');
      this.makeApiCall('usercount');
    });
    document.body.classList.remove('noscroll');
  }

  makeApiCall = (type) => {
    const { status, region, equity, corpdebt, cannabis, tier1, tier2, tier3, currentFilterState, previousFilterState } = this.state;
    const finalFilter = {
      filterData: status,
      equity_access: equity,
      corp_access: corpdebt,
      cannabis_access: cannabis,
      tier1_access: tier1,
      tier2_access: tier2,
      tier3_access: tier3,
      region
    };
    if (type === 'usercount') {
      this.props.submitAdvanceFilter('usercount', finalFilter, '');
    } else {
      let { currentStatus } = this.state;
      switch (status.length) {
        case 0 :
          currentStatus = 'All';
          break;
        case 1:
          currentStatus = status[0];
          break;
        default:
          currentStatus = '';
      }
      this.setState({ currentStatus, pageNumber: 1 }, () => {
        this.props.submitAdvanceFilter('submit', finalFilter, '');
        this.closeFilterModal();
        if (JSON.stringify(currentFilterState) !== JSON.stringify(previousFilterState)) {
          const statusUrl = status && status.length ? status.join(',') : 'all';
          const regionUrl = region && region.length ? region.join(',') : 'all';
          const urlQuery = `stat=${encodeURIComponent(statusUrl)}&eq=${encodeURIComponent(this.returnSwitchValue('urlValue', equity))}&cor=${encodeURIComponent(this.returnSwitchValue('urlValue', corpdebt))}&can=${encodeURIComponent(this.returnSwitchValue('urlValue', cannabis))}&t1=${encodeURIComponent(this.returnSwitchValue('urlValue', tier1))}&t2=${encodeURIComponent(this.returnSwitchValue('urlValue', tier2))}&t3=${encodeURIComponent(this.returnSwitchValue('urlValue', tier3))}&region=${encodeURIComponent(regionUrl)}&page=${encodeURIComponent('1')}`;
          libraryURLPush(urlQuery);
        }
      });
    }
  }

  returnSwitchValue = (type, key) => {
    if (type === 'filterValue') {
      switch (key) {
        case 'all':
          return '';
        case 'enabled':
          return true;
        case 'disabled':
          return false;
        default:
          return '';
      }
    } else {
      switch (key.toString()) {
        case '':
          return 'all';
        case 'true':
          return 'enabled';
        case 'false':
          return 'disabled';
        default:
          return '';
      }
    }
  }

  getFilterValue = (currentFilterState, header, subOption) => {
    const thirdLevelOptions = currentFilterState[header].options[subOption].options;
    if (subOption === 'status' || subOption === 'region') {
      if (thirdLevelOptions.all.checked) {
        return [];
      }
      return Object.keys(thirdLevelOptions).filter(data => thirdLevelOptions[data].checked);
    }
    const selectedOPtion = Object.keys(thirdLevelOptions).filter(data => thirdLevelOptions[data].checked);
    return this.returnSwitchValue('filterValue', selectedOPtion[0]);
  }

  handleCheckbox = (header, subOption, option) => (e, checkBox) => {
    const { currentFilterState } = this.state;
    currentFilterState[header].options[subOption].options[option].checked = checkBox.checked;

    // Check if all the options in a row are checked.
    let isAllChecked = true;
    Object.keys(currentFilterState[header].options[subOption].options).map((data) => {
      if (data !== 'all' && !currentFilterState[header].options[subOption].options[data].checked) {
        isAllChecked = false;
      }
    });

    // If all the options are checked, then Check only "All" option, uncheck other options.
    if (isAllChecked || (option === 'all' && checkBox.checked)) {
      Object.keys(currentFilterState[header].options[subOption].options).map((data) => {
        if (data === 'all') {
          currentFilterState[header].options[subOption].options[data].checked = true;
        } else {
          currentFilterState[header].options[subOption].options[data].checked = false;
        }
      });
    } else {
      currentFilterState[header].options[subOption].options.all.checked = false;
    }
    const stateFilter = this.getFilterValue(currentFilterState, header, subOption);

    this.setState({ currentFilterState, [subOption]: stateFilter }, () => {
      this.makeApiCall('usercount');
    });
  }

  renderAdvanceFilterOption = () => {
    const { currentFilterState } = this.state;
    return (
      <div className={'filter-modal'}>
        <div className="button-holder">
          <Button className="ui button modal-close-icon bmo-close-btn" onClick={this.onAdvanceFilterClose} />
        </div>
        <div className={'modal-header'}>
          Advanced Filter
        </div>
        {Object.keys(currentFilterState).map((header, indexi) => {
          const subOptions = currentFilterState[header].options;
          return (
            <div className={`row-${indexi + 1} filter-row`}>
              <div className={'column-1'}>
                {currentFilterState[header].title}:
              </div>
              <div className={'column-2'}>
                {Object.keys(subOptions).map((subOption) => {
                  const allOptions = subOptions[subOption].options;
                  return (
                    <div className={'checkbox-division'}>
                      <div className={'sub-column-header'}>
                        {subOptions[subOption].title}:
                      </div>
                      {Object.keys(allOptions).map((option, index) => {
                        return (
                          <div className={`sub-column sub-column-${index + 1}`}>
                            <Checkbox
                              label={allOptions[option].title}
                              checked={allOptions[option].checked || false}
                              onChange={this.handleCheckbox(header, subOption, option)}
                            />
                          </div>
                        );
                      })
                      }
                    </div>
                  );
                })
                }
              </div>
            </div>
          );
        })
        }
      </div>
    );
  }

  resetFilter = (type) => {
    const finalFilter = {
      filterData: ['Pending_with_access'],
      equity_access: '',
      corp_access: '',
      cannabis_access: '',
      tier1_access: '',
      tier2_access: '',
      tier3_access: '',
      region: []
    };
    let { searchTextValue } = this.state;
    let resetType = '';
    if (type === 'submit') {
      searchTextValue = '';
      resetType = 'reset';
      removeQueryParams();
    }
    const status = this.getFilterValue(this.defaultFilterState, 'access', 'status');
    removeQueryParams();
    this.setState({
      status,
      pageNumber: 1,
      region: [],
      equity: '',
      corpdebt: '',
      cannabis: '',
      tier1: '',
      tier2: '',
      tier3: '',
      currentStatus: 'Pending_with_access',
      searchTextValue,
      currentFilterState: JSON.parse(JSON.stringify(this.defaultFilterState)) }, () => {
      this.props.submitAdvanceFilter(type, finalFilter, resetType);
    });
  }

  onChange = (page) => {
    this.setState({ pageNumber: page }, () => {
      this.props.onPageChange(page);
      const urlQuery = `page=${encodeURIComponent(page)}`;
      libraryURLPush(urlQuery);
    });
  }

  itemRender = (current, type, element) => {
    const { pageNumber } = this.state; //eslint-disable-line
    if (type === 'page') {
      return <div className={`${pageNumber === current ? 'admin-page-active' : 'admin-other-page'}`}>{current}</div>;//eslint-disable-line
    }
    return element;
  }

  renderDisplayPageCount = (total, current, pageSize) => {
    const range1 = (total === 0) ? 0 : (((current - 1) * pageSize) + 1);
    const range2 = ((current * pageSize) > total) ? total : (current * pageSize);
    return (
      <div className={'total-account'}>
        Displaying accounts <span>{range1}</span> - <span>{range2}</span> of <span>{total}</span> </div>
    );
  }

  render() {
    const {
      statusLists,
      userLists,
      pageName,
      isClientLookupLoading,
      userCount,
      isCountLoading,
      userTotal,
      pendingUserCount
    } = this.props;

    const statusListedit = [...statusLists, { key: '', value: '', text: 'Multiple' }];
    const { toggleState, sortOrder, searchTextValue, currentStatus, filterModal, currentFilterState } = this.state;
    const isJsonObjectSame = JSON.stringify(currentFilterState) === JSON.stringify(this.defaultFilterState);
    const userPerPage = parseInt((window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.NUMBER_OF_USER_PER_DISPLAYED_PAGE) || '50', 10);
    return (
      <div className="admin-registration-pannel">
        <div className="head-section">
          <div className="new-request-total-account">
            {`${pendingUserCount} Pending ${pageName === 'user-accounts' && `/ ${userTotal || 0} Users`}`}
          </div>
          <div className={'header-reset-filter'}>
            {(isJsonObjectSame && searchTextValue === '') ?
              <Button className={'linkBtn disabled-reset'}>Reset Filters</Button>
              :
              <Button className={'linkBtn'} onClick={() => { this.resetFilter('submit'); }} >Reset Filters</Button>
            }
          </div>
          <div className="status-filter">
            <Dropdown
              placeholder={'Multiple'}
              className={'dropdown-chevron bmo_chevron bottom'}
              search
              selection
              value={currentStatus}
              options={statusListedit}
              onChange={this.onStatusDropDownChange}
              selectOnBlur={false}
            />
          </div>
          <div className="search-filter">
            <span className={'search-text'}>Search</span>
            <Input
              className={'search-input-text'}
              input={{
                value: searchTextValue,
                onKeyPress: this.submitSearchForm,
                'aria-label': 'Search input box',
              }}
              onChange={this.handleSearchChange}
            />
          </div>
          <div className={'advance-filter'}>
            <Button secondary className={'advance-filter'} onClick={this.openFilterModal} >Advanced Filter</Button>
          </div>
        </div>
        {filterModal &&
          <Modal
            open={filterModal}
            onClose={this.onAdvanceFilterClose}
            className={'user-filter-modal'}
          >
            <Modal.Content>
              {this.renderAdvanceFilterOption()}
              <div className={'number-users-filterd'}>
                <Button className={'linkBtn count-loader'}>
                  {isCountLoading && <Loader active={true} />}
                </Button>
                <span className={'number'}>{userCount}</span> users found
              </div>
              <div className={'clear-all-submit'}>
                <div className={'clear-all-btn'}>
                  {isJsonObjectSame ?
                    <Button className={'linkBtn disabled-reset'}>Clear All</Button>
                    :
                    <Button className={'linkBtn'} onClick={() => { this.resetFilter('usercount'); }}>Clear All</Button>
                  }
                </div>
                <div className={'submit-btn'}><Button secondary onClick={() => { this.makeApiCall('submit'); }} >Show Users</Button></div>
              </div>
            </Modal.Content>
          </Modal>
        }
        <div className="result-table-header title-bar">
          <div className="result-column icon date">
            <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState('created_at')}>
              <span className={`${(toggleState === 'created_at') && 'underline'}`}>{'Date'}</span>
              <Icon name={(toggleState === 'created_at' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Date'} />
            </Button>
          </div>
          <div className="result-column icon name">
            <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState('first_name')}>
              <span className={`${(toggleState === 'first_name') && 'underline'}`}>{'Name'}</span>
              <Icon name={(toggleState === 'first_name' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Name'} />
            </Button>
          </div>
          {pageName === 'user-accounts' ?
            <div className="result-column icon company">
              <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState('company')}>
                <span className={`${(toggleState === 'company') && 'underline'}`}>{'Company'}</span>
                <Icon name={(toggleState === 'company' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Company'} />
              </Button>
            </div>
            :
            <div className="result-column icon company">
              <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState('event')}>
                <span className={`${(toggleState === 'event') && 'underline'}`}>{'Event'}</span>
                <Icon name={(toggleState === 'event' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Event'} />
              </Button>
            </div>
          }

          <div className="result-column icon status">
            <Button className={'linkBtn btn-text-color'} onClick={() => this.toggleState('status')}>
              <span className={`${(toggleState === 'status') && 'underline'}`}>{'Status'}</span>
              <Icon name={(toggleState === 'status' && sortOrder === 'asc') ? 'caret up' : 'caret down'} title={'Sort by Status'} />
            </Button>
          </div>

          <div className="result-column icon linked">
            <div className={'ui button linkBtn btn-text-color'}>
              <span>{'Entitlements'}</span>
            </div>
          </div>
        </div>
        <div className={'card-wraper'}>
          {userLists.length === 0 ?
            <div className={'admin-acounts-result-not-found'}>{'No Results Found'}</div>
            :
            userLists.map((data, i) => {
              const indexVal = i;
              const dataVal = data;
              dataVal.index = indexVal;
              return (
                <AdminSummaryCard
                  userData={dataVal}
                  apiClientLookUp={this.clentLookUpData()}
                  clientLookUpData={this.props.clientLookUpData}
                  isClientLookupLoading={isClientLookupLoading}
                  key={`index - ${i + 1}`}
                />
              );
            })
          }
        </div>
        <div className={'pagination-div'}>
          {this.renderDisplayPageCount(userTotal, this.state.pageNumber, userPerPage)}
          <Pagination
            current={this.state.pageNumber}
            total={userTotal}
            defaultPageSize={userPerPage}
            onChange={this.onChange}
            itemRender={this.itemRender}
            showTitle={false}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userTotal: adminSelector.getUserTotal(state),
  pendingUserCount: adminSelector.getPendingUserCount(state),
});

const mapDispatchToProps = (dispatch) => ({ //eslint-disable-line

});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRegistrationPanel);
