/* @flow weak */

/*
 * Component: AdminSummaryCard
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Input, Button, Modal, Checkbox, Message, Loader } from 'unchained-ui-react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import {
  adminSelector
} from 'store/selectors';
import {
  email as emailRegExp,
  name as nameRegExp,
  salesforceID as sfidRegExp,
  rdsID as rdsidRegExp,
} from 'constants/regex';
import {
  GET_CLIENT_LOOKUP_DATA,
  UPDATE_USER_INFO_DATA,
  UNLINK_EXISTING_USER,
  SEND_BMO_CONTACT_EMAIL
} from 'store/actions';
import st from 'constants/strings';
import { sendBmoContactEmail } from 'api/admin';
import { forgotPasswordAPI } from 'api/auth';
import { appsettingsVariable } from 'constants/UnchainedVariable';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './AdminSummaryCard.scss';


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class AdminSummaryCard extends Component {
  props: {
    userData: {},
    statusLists: [],
    regionList: [],
    clientLookUpData: [],
    apiClientLookUp: () => void,
    isClientLookupLoading: bool,
    updateUserApi: () => void,
    userUpdateError: [],
    unlinkingExistingUser: () => void,
    unlinkingSuccessful: bool,
    closeModalCheck: {},
    saveLoading: bool,
    unlinkUserLoad: bool,
    sendBMOContactEmail: () => void,
  };

  static defaultProps = {
  };

  state = {
    isCardOpen: false,
    userData: {},
    userInfoModelOpen: false,
    userInfoModelContent: '',
    userEditState: {},
    tabName: 'clientDetails',
    rdsApiError: {},
    firstNameErr: '',
    lastNameErr: '',
    emailAddressErr: '',
    usernameErr: '',
    phoneErr: '',
    companyErr: '',
    sfIdErr: '',
    rdsIdErr: '',
    fromClientLookUP: false,
    showEmailLoader: false,
    sendEmailText: 'Send forgot password email',
    disableForgotPasswordLink: false
  }

  defaultEditState = {};
  accessMapper = {
    can_access_tier_1: { key: 'T1', orderId: 3 },
    can_access_tier_2: { key: 'T2', orderId: 4 },
    can_access_tier_3: { key: 'T3', orderId: 5 },
    can_access_cannabis: { key: 'CB', orderId: 6 },
    has_debt_access: { key: 'CD', orderId: 2 },
    has_equity_access: { key: 'EQ', orderId: 1 },
    can_access_models: { key: 'M', orderId: 7 }
  };

  componentWillMount() {
    const { userData, statusLists, regionList } = this.props;
    this.updateIntialState(userData, statusLists, regionList);
    this.setState({
      userData,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { userData, statusLists, regionList, userUpdateError, unlinkingSuccessful, closeModalCheck, clientLookUpData } = nextProps;
    const { currentUserId, userEditState } = this.state;
    if (this.state.userData !== userData) {
      // If any user info is changed then we are updating the state values for that user
      this.updateIntialState(userData, statusLists, regionList);
      this.setState({
        userData,
      });
    }
    const errObject = {};
    if (userUpdateError.length && (this.props.userUpdateError !== userUpdateError)) {
      userUpdateError.map((data) => {
        const keyVal = data.key;
        const errorField = `${keyVal}Err`;
        if (data.key === 'rdsId') {
          errObject.rdsApiError = data;
        } else {
          errObject[errorField] = data.message;
        }
      });
      this.setState(errObject);
      let selectedStatus = '';
      userEditState.entitlements.status.map((data) => {
        if (data.selected) {
          selectedStatus = data.value;
        }
      });
      if (userData.uuid === currentUserId && (selectedStatus === 'Approved' || selectedStatus === 'Expired')) {
        // On changing status to "Approved" / "Expired", and the response has error open the Modal to show the error
        this.setState({ userInfoModelContent: 'userInfoEdit', userInfoModelOpen: true, tabName: 'userids' });
      }
    }

    if (this.props.clientLookUpData !== clientLookUpData) {
      // If Client-lookup sends
      // Only 1 match we show Comparison screen
      // 1 results with error, show UserEdit tab with Error message
      // More then 1 result, Show "Client Matches" screen.
      if (clientLookUpData && clientLookUpData.length === 1) {
        if (clientLookUpData[0].error) {
          this.setState({ userInfoModelContent: 'userInfoEdit', rdsApiError: clientLookUpData[0].error });
        } else {
          this.setState({ userInfoModelContent: 'clientRecordMatch' });
        }
      } else {
        this.setState({ userInfoModelContent: 'clientMatches' });
      }
    }

    if (closeModalCheck.error.length === 0 && closeModalCheck.save) {
      // Close User Edit Modal, When save AOI call is success
      this.setState({ userInfoModelOpen: false, firstNameErr: '', lastNameErr: '', emailAddressErr: '', usernameErr: '', phoneErr: '', companyErr: '', sfIdErr: '', rdsIdErr: '', rdsApiError: {}, currentUserId: '' });
    }
    if (unlinkingSuccessful && (this.props.unlinkingSuccessful !== unlinkingSuccessful)) {
      // When Unlinking existing user api call is success, remove all the error shpwn in User edit tab.
      this.setState({ rdsApiError: {}, sfIdErr: '' });
    }
  }

  updateIntialState = (userData, statusLists, regionList) => {
    statusLists.map((data) => {
      const dataVal = data;
      if (data.value === userData.status) {
        dataVal.selected = true;
      } else {
        dataVal.selected = false;
      }
    });

    regionList.map((data) => {
      const dataVal = data;
      if (data.value === userData.region) {
        dataVal.selected = true;
      } else {
        dataVal.selected = false;
      }
    });

    this.defaultEditState = {
      clientDetails: {
        firstName: {
          text: 'First Name',
          value: userData.first_name
        },
        lastName: {
          text: 'Last Name',
          value: userData.last_name
        },
        emailAddress: {
          text: 'Email Address',
          value: userData.email
        },
        username: {
          text: 'Username',
          value: userData.username
        },
        phone: {
          text: 'Phone',
          value: userData.phone
        },
        company: {
          text: 'Company',
          value: userData.company
        },
        region: JSON.parse(JSON.stringify(regionList))
      },
      entitlements: {
        status: JSON.parse(JSON.stringify(statusLists)),
        tier: {
          t1: {
            key: 'T1',
            text: 'T1',
            checked: userData.can_access_tier_1
          },
          t2: {
            key: 'T2',
            text: 'T2',
            checked: userData.can_access_tier_2
          },
          t3: {
            key: 'T3',
            text: 'T3',
            checked: userData.can_access_tier_3
          },
          model: {
            key: 'model',
            text: 'Models',
            checked: userData.can_access_models
          }
        },
        researchAccess: {
          equity: {
            key: 'equity',
            text: 'Equity',
            checked: userData.has_equity_access
          },
          corp: {
            key: 'corp',
            text: 'Corporate Debt',
            checked: userData.has_debt_access
          },
          cannabis: {
            key: 'cannabis',
            text: 'Cannabis',
            checked: userData.can_access_cannabis
          }
        }
      },
      userids: {
        sfId: {
          text: 'Salesforce ID',
          value: userData.salesforce_id
        },
        rdsId: {
          text: 'RDS ID',
          value: userData.rds_id
        }
      }
    };
    this.setState({
      userEditState: JSON.parse(JSON.stringify(this.defaultEditState)),
    });
  }

  openAdminSummery = () => {
    const isCardOpen = !this.state.isCardOpen;
    this.setState({ isCardOpen });
  }

  userInfoEdit = () => {
    document.body.classList.add('noscroll');
    this.setState({
      userInfoModelOpen: true,
      userInfoModelContent: 'userInfoEdit',
      firstNameErr: '',
      lastNameErr: '',
      emailAddressErr: '',
      usernameErr: '',
      phoneErr: '',
      companyErr: '',
      sfIdErr: '',
      rdsIdErr: '',
      rdsApiError: {}
    });
  }

  closeUserInfoModelOpen = () => {
    document.body.classList.remove('noscroll');
    this.resetRDSValue();
    this.setState({
      userInfoModelOpen: false,
      tabName: 'clientDetails',
      userEditState: JSON.parse(JSON.stringify(this.defaultEditState)),
      firstNameErr: '',
      lastNameErr: '',
      emailAddressErr: '',
      usernameErr: '',
      phoneErr: '',
      companyErr: '',
      sfIdErr: '',
      rdsIdErr: '',
    });
  }

  switchTab = (tabName) => {
    this.setState({ tabName });
  }

  changeEditFormInputs = (e, keyName, key) => {
    const { userEditState } = this.state;
    userEditState[keyName][key].value = e.target.value;
    if (key) {
      this.setState({
        userEditState,
        [`${key}Err`]: '',
      });
      if (key === 'rdsId') {
        this.setState({ rdsApiError: {} });
      }
      if (key === 'rdsId' || key === 'sfId') {
        this.setState({ fromClientLookUP: false });
      }
    }
  }

  onRadioButtonSelect = (type, sectionKey, headerKey, key) => () => {
    const { userEditState } = this.state;
    userEditState[sectionKey][headerKey].map((obj) => {
      const objectValue = obj;
      if (obj.key === key) {
        objectValue.selected = true;
      } else {
        objectValue.selected = false;
      }
    });
    this.setState({ userEditState }, () => {
      const currentSecetedValue = userEditState[sectionKey][headerKey].filter(data => { if (data.key === key) return data.selected; }); //eslint-disable-line
      const alreadySelected = (currentSecetedValue[0].selected === type[1]);
      if (type[0] === 'saveData' && !alreadySelected) {
        this.setState({ fromClientLookUP: true }, () => {
          this.submitEditForm('fromExpandedRow');
        });
      }
    });
  }

  handleCheckboxChange = (sectionKey, headerKey, key) => (e, checkBox) => {
    const { userEditState } = this.state;
    const dataObj = userEditState[sectionKey][headerKey];
    Object.keys(dataObj).map((obj) => {
      if (dataObj[obj].key === key) {
        dataObj[obj].checked = checkBox.checked;
      }
    });
    this.setState({ userEditState });
  }

  resetFilter = () => {
    this.setState({ userEditState: JSON.parse(JSON.stringify(this.defaultEditState)), firstNameErr: '', lastNameErr: '', emailAddressErr: '', usernameErr: '', phoneErr: '', companyErr: '', sfIdErr: '', rdsIdErr: '' });
  }

  clientLookup = (data) => {
    const { userData } = this.state;
    const dataVal = data;
    dataVal.uuid = userData.uuid;
    this.props.apiClientLookUp(dataVal);
  }

  cleintMatchBackButton = () => {
    this.setState({ userInfoModelContent: 'userInfoEdit' });
  }

  clientRecordMatchBackButton = () => {
    const { clientLookUpData } = this.props;
    if (clientLookUpData.length === 0 || clientLookUpData.length === 1) {
      this.setState({ userInfoModelContent: 'userInfoEdit' });
    } else {
      this.setState({ userInfoModelContent: 'clientMatches' });
    }
  }

  getSelectedRadioButtonOption = (options = []) => {
    let selectedOption = '';
    options.length && options.map(ele => {
      if (ele.selected) {
        selectedOption = ele.key;
      }
    });
    return selectedOption;
  }

  getSelectedCheckboxOptions = (options = {}) => {
    const checkboxOptions = {};
    Object.keys(options).map(option => {
      checkboxOptions[option] = options[option].checked;
    });
    return checkboxOptions;
  }

  prepareData = () => {
    const { userEditState, userData } = this.state;
    const preparedData = {};
    const tabsData = {};
    const errObject = {};

    Object.keys(userEditState).map(key => {
      tabsData[key] = {};
      switch (key) {
        case 'clientDetails':
          Object.keys(userEditState[key]).map(field => {
            if (field === 'region') {
              tabsData[key][field] = this.getSelectedRadioButtonOption(userEditState[key][field]);
            } else {
              const fieldValue = userEditState[key][field].value;
              const fieldText = userEditState[key][field].text;
              const errorField = `${field}Err`;
              if ((field === 'firstName' || field === 'lastName') && !nameRegExp.test(fieldValue)) {
                errObject[errorField] = `Please enter a valid ${fieldText}`;
              } else if (field === 'emailAddress' && !emailRegExp.test(fieldValue)) {
                errObject[errorField] = `Please enter a valid ${fieldText}`;
              } else if (fieldValue === '') {
                errObject[errorField] = `Please enter a valid ${fieldText}`;
              }
              tabsData[key][field] = fieldValue;
            }
            return null;
          });
          break;
        case 'entitlements':
          Object.keys(userEditState[key]).map(field => {
            if (field === 'status') {
              tabsData[key][field] = this.getSelectedRadioButtonOption(userEditState[key][field]);
            } else if (field === 'researchAccess' || field === 'tier') {
              tabsData[key][field] = this.getSelectedCheckboxOptions(userEditState[key][field]);
            }
            return null;
          });
          break;
        case 'userids':
          Object.keys(userEditState[key]).map(id => {
            const fieldValue = userEditState[key][id].value.trim();
            const fieldText = userEditState[key][id].text;
            const errorField = `${id}Err`;
            if (id === 'sfId' && !(sfidRegExp.test(fieldValue) || (fieldValue.length === 0))) {
              errObject[errorField] = `Please enter a valid ${fieldText}`;
            } else if (id === 'rdsId' && !(rdsidRegExp.test(fieldValue) || (fieldValue.length === 0))) {
              errObject[errorField] = `Please enter a valid ${fieldText}`;
            }
            tabsData[key][id] = fieldValue;
            return null;
          });
          break;
        default: break;
      }
    });

    const errorPresent = !isEmpty(errObject);
    preparedData.data = tabsData;
    preparedData.id = userData.uuid;
    preparedData.index = userData.index;
    errObject.apiReqData = preparedData;
    this.setState(errObject);
    return JSON.parse(JSON.stringify({ data: preparedData, errorPresent }));
  }

  submitEditForm = (type) => {
    const { fromClientLookUP, userEditState, userData } = this.state;
    const data = this.prepareData();
    if (data.errorPresent) {
      if (type === 'fromExpandedRow') {
        this.setState({ userInfoModelContent: 'userInfoEdit', userInfoModelOpen: true, tabName: 'clientDetails' });
      }
      return null;
    }
    if (type === 'fromExpandedRow') {
      this.setState({ currentUserId: userData.uuid });
    }
    const changedSFID = userEditState.userids.sfId.value;
    const changedRDSID = userEditState.userids.rdsId.value;
    if (fromClientLookUP || ((changedSFID === '') && (changedRDSID === '')) || ((userData.rds_id === changedRDSID) && (userData.salesforce_id === changedSFID))) {
      this.props.updateUserApi(data.data, data.data.index, type !== 'fromExpandedRow');
    } else {
      this.clientLookup({ RdsID: changedRDSID, SFID: changedSFID });
    }
    return null;
  }

  resetRDSValue = () => {
    const { userEditState } = this.state;
    const defaultData = JSON.parse(JSON.stringify(this.defaultEditState));
    userEditState.userids.rdsId = defaultData.userids.rdsId;
    userEditState.userids.sfId = defaultData.userids.sfId;
    this.setState({ rdsApiError: {}, sfIdErr: '', userEditState });
  }

  unlinkExistingUser = (rdsid) => {
    this.props.unlinkingExistingUser(rdsid);
  }

  renderUserEditForm = () => {
    const { userEditState, tabName, rdsApiError, userData, firstNameErr, lastNameErr, emailAddressErr, usernameErr, phoneErr, companyErr, sfIdErr, rdsIdErr, sendEmailText, disableForgotPasswordLink } = this.state;
    const { saveLoading, unlinkUserLoad } = this.props;
    let content = '';
    const userObject = userEditState[tabName];
    const isJsonObjectSame = JSON.stringify(userEditState) === JSON.stringify(this.defaultEditState);
    const linkedUser = rdsApiError && rdsApiError.user && rdsApiError.user;
    const clientTabErr = (firstNameErr || lastNameErr || emailAddressErr || usernameErr || phoneErr || companyErr);
    const userIdTabErr = (sfIdErr || rdsIdErr || (!isEmpty(rdsApiError)));
    const enableSaveButton = !(isJsonObjectSame || clientTabErr || userIdTabErr);
    switch (tabName) {
      case 'clientDetails':
        content = (
          <div className={'client-details'}>
            {
              Object.keys(userObject).map((data, index) => {
                const key = index;
                const errMsg = `${data}Err`;
                const stateErrMsg = this.state[errMsg];
                return (
                  <div className={data}>
                    {data === 'region' && <div><div className="field-text">{'Region'}</div><br /></div> }
                    {(data !== 'region') ?
                      <div className={'row'} key={key}>
                        <div className="field-text">{userObject[data].text}</div>
                        { stateErrMsg && <Message className={'error-text'} content={stateErrMsg} /> }
                        <Input onChange={(e) => this.changeEditFormInputs(e, 'clientDetails', data)} className={`field-value ${stateErrMsg ? 'error-box' : ''}`} input={{ value: userObject[data].value }} />
                      </div>
                      :
                      userObject[data].map((region, indexi) => {
                        const keyprop = indexi;
                        return (
                          <div className="region-div" key={keyprop}>
                            <div
                              className={`status-circle individual-region ${region.selected ? 'selected' : ''}`}
                              onClick={this.onRadioButtonSelect([], 'clientDetails', 'region', region.key)}
                              onKeyPress={() => {}}
                              tabIndex={0}
                              role="button"
                            />
                            <div className="region-name">{region.text}</div>
                          </div>
                        );
                      })
                    }
                  </div>
                );
              })
            }
          </div>
        );
        break;
      case 'entitlements':
        content = (
          <div className={'entitlements'}>
            {
              Object.keys(userObject).map((data, indexj) => {
                const key = indexj;
                return (
                  <div key={key} className="entitlement-detail">
                    {(data === 'status') ?
                      <div>
                        <div className={'sub-heading'}>{'Status'}</div>
                        {userObject[data].slice(1).map((status, indexj) => {
                          const keyprop = indexj;
                          return (
                            <div className="all-status-color" key={keyprop}>
                              <div
                                className={`${status.value} status-circle ${status.selected}`}
                                onClick={this.onRadioButtonSelect([], 'entitlements', 'status', status.key)}
                                onKeyPress={() => {}}
                                tabIndex={0}
                                role="button"
                              />
                              <div className="entitlements-options status-option">{status.text}</div>
                            </div>
                          );
                        })
                        }
                      </div>
                      :
                      <div className={`tier-research-access ${data}`}>
                        <div className={'sub-heading'}>{data === 'tier' ? 'Tier' : 'Research Access'}</div>
                        {Object.values(userObject[data]).map((item, indexk) => {
                          const keyprop = indexk;
                          return (
                            <div className={'checkboxes entitlements-options'} key={keyprop}>
                              <Checkbox
                                label={item.text}
                                checked={item.checked || false}
                                onChange={this.handleCheckboxChange('entitlements', data, item.key)}
                              />
                            </div>
                          );
                        })
                        }
                      </div>
                    }
                  </div>
                );
              })
            }
          </div>
        );
        break;
      case 'userids':
        content = (
          <div className="user-ids-container">
            {Object.keys(userObject).map((data, index) => {
              const key = index;
              const errMsg = `${data}Err`;
              const stateErrMsg = this.state[errMsg];
              return (
                <div className={'user-id-section'}>
                  <div className={'row'} key={key}>
                    <div className="field-text">{userObject[data].text}</div>
                    { stateErrMsg && <Message className={'error-text'} content={stateErrMsg} /> }
                    <Input onChange={(e) => this.changeEditFormInputs(e, 'userids', data)} className={`field-value ${(stateErrMsg || !isEmpty(rdsApiError)) ? 'error-box' : ''} ${!isEmpty(rdsApiError) ? 'rds-error' : ''}`} input={{ value: userObject[data].value }} />
                  </div>
                </div>
              );
            })
            }
            {!isEmpty(rdsApiError) &&
              <div className={'rds-error-container'}>
                <div className={'error-message rds-error'}>{rdsApiError.message}</div>
                {!isEmpty(linkedUser) &&
                  <div className={'linked-user'}>
                    <div className={'created-at'}>
                      <span>Created</span>
                      <span>{moment(linkedUser.created_at).format('MM/DD/YYYY')}</span>
                    </div>
                    <div className={'user-other-info'}>
                      <span>{`${linkedUser.first_name} ${linkedUser.last_name}`}</span>
                      <span>{linkedUser.company}</span>
                      <span>{linkedUser.email}</span>
                      <span>{linkedUser.phone}</span>
                      <span>{linkedUser.username}</span>
                    </div>
                  </div>
                }
              </div>
            }
            {isEmpty(rdsApiError) &&
              <Button className={'linkBtn'} onClick={() => { this.clientLookup({ email: userEditState.clientDetails.emailAddress.value }); }} >
                Client Look-Up
              </Button>
            }
            {(isEmpty(rdsApiError)) ?
              <div>
                {userData.linked &&
                  <Button className={'linkBtn'} onClick={() => { this.unlink(''); }} >
                    <span>Unlink</span>
                    <span className={'link-btn unlink-icon'} />
                  </Button>
                }
                {(!userData.linked) &&
                  <Button className={'linkBtn disabled-button disabled-unlink'}>
                    <span >Unlink</span>
                    <span className={'link-btn unlink-disable-icon'} />
                  </Button>
                }
              </div>
              :
              null
            }
            {
              <Button
                className={`linkBtn forgotPasswordLinkBtn ${disableForgotPasswordLink ? 'disabled-unlink' : ''}`}
                onClick={disableForgotPasswordLink ? undefined : () => { this.sendForgotPasswordEmail(); }}
              >
                {sendEmailText.includes('Sending') && <Loader />}
                {sendEmailText.includes('Sent') && <span className="bmo_chevron tick" />}
                <span>{sendEmailText}</span>
              </Button>
            }
            {
              this.renderBMOContactSection()
            }
          </div>
        );
        break;
      default:
        content = '';
    }
    return (
      <Modal.Content>
        <div className="button-holder">
          <Button
            className="ui button modal-close-icon bmo-close-btn"
            onClick={this.closeUserInfoModelOpen}
          />
        </div>
        <div className={'navigation-tab'}>
          <Button className={`linkBtn ${tabName === 'clientDetails' ? 'active underline' : ''} ${clientTabErr ? 'error' : ''}`} onClick={() => this.switchTab('clientDetails')} content={'Client Details'} />
          <Button className={`linkBtn ${tabName === 'entitlements' ? 'active underline' : ''}`} onClick={() => this.switchTab('entitlements')} content={'Entitlements'} />
          <Button className={`linkBtn ${tabName === 'userids' ? ' active underline' : ''} ${userIdTabErr ? 'error' : ''}`} onClick={() => this.switchTab('userids')} content={'User IDs'} />
        </div>
        {content}
        {isEmpty(rdsApiError) ?
          <Modal.Actions className={'user-edit-actions'}>
            {isJsonObjectSame ?
              <Button disabled={true} className={'disabled-button'}>Reset Changes</Button>
              :
              <Button className={'linkBtn'} onClick={() => { this.resetFilter(); }} >Reset Changes</Button>
            }
            {enableSaveButton ?
              <Button secondary content={'Save'} onClick={() => { this.submitEditForm('fromModal'); }} />
              :
              <Button secondary disabled={true} className={'disabled-button'}>Save</Button>
            }

          </Modal.Actions>
          :
          <Modal.Actions className={'unlink-user-actions'}>
            <Button secondary content={'Cancel'} onClick={() => { this.resetRDSValue(); }} />
            <Button secondary content={'Unlink Existing User'} onClick={() => { this.unlinkExistingUser(linkedUser.rds_id); }} />
          </Modal.Actions>
        }
        {saveLoading && <div className={'saving-message-edit-modal'}>Saving changes and closing ...</div> }
        {unlinkUserLoad && <div className={'saving-message-edit-modal'}>Unlinking Existing User ...</div> }
      </Modal.Content>
    );
  }

  onClientSelect = (rdsid) => {
    this.setState({ userInfoModelContent: 'clientRecordMatch', clientRdsId: rdsid });
  }

  renderClientMatchesModal = () => {
    const { clientLookUpData, isClientLookupLoading } = this.props;
    const { userData } = this.state;
    return (
      <Modal.Content>
        <div className="button-holder">
          <Button
            className="ui button modal-close-icon bmo-close-btn"
            onClick={() => { this.cleintMatchBackButton(); }}
          />
        </div>
        <div
          onKeyPress={() => {}}
          tabIndex={0}
          role="button"
          className="go-back"
          onClick={() => this.cleintMatchBackButton()}
        >
          <span className="back-icon blue-circle-back-icon" /> <span> Back to User IDs </span>
        </div>
        <div className={'client-matches-header'}>Client Matches</div>
        <div className={'client-matches'}>
          {isClientLookupLoading && <Loader active={true} content={'Loading ...'} />}

          {
            (clientLookUpData.length === 0 && !isClientLookupLoading) &&
            <span className={'no-result'}>
              {appsettingsVariable.BMO_NO_CLIENT_MATCHES_FOUND_MESSAGE || 'No matches found for this client.'}
            </span>
          }
          {
            (clientLookUpData.length === 0 && !isClientLookupLoading) &&
            this.renderBMOContactSection('client-lookup-match')
          }
          {
            (clientLookUpData.length === 0 && !isClientLookupLoading) &&
            typeof (userData.bmo_contact_active) !== 'boolean' &&
            <Button
              className="secondary close-button"
              onClick={() => this.clientRecordMatchBackButton()}
            >
              Close
            </Button>
          }

          {clientLookUpData.map((data) => {
            return (
              <div className={'client-lookup-modal'} key={Math.random()}>
                <div className={'create-date'}>
                  <span>RDS ID</span>
                  <span>{data.RdsID}</span>
                </div>
                <div className={'client-info'}>
                  <span>{data.Name}</span>
                  <span>{data.Company}</span>
                  <span>{data.Email}</span>
                  <span>{data.Phone}</span>
                  <span>{data.UserName}</span>
                </div>
                <div className={'select-btn'}>
                  <Button secondary content={'Select'} className={''} onClick={() => { this.onClientSelect(data.RdsID); }} />
                </div>
              </div>
            );
          })
          }
        </div>
      </Modal.Content>
    );
  }

  onClickYes = (data, rdsid, sfid) => {
    const { userEditState } = this.state;
    let rdsApiError = {};
    userEditState.userids.rdsId.value = rdsid;
    userEditState.userids.sfId.value = sfid;
    if (data.error) {
      rdsApiError = data.error;
    }
    this.setState({ userEditState, userInfoModelContent: 'userInfoEdit', fromClientLookUP: true, rdsApiError });
  }

  renderBMOContactSection = (sectionName = null) => {
    const { userData, showEmailLoader } = this.state;

    return (
      <div className={`bmo-contact-section ${sectionName}`}>
        <div
          className={`heading ${sectionName === 'client-lookup-match' && 'hide'}`}
        >
          BMO Contact
        </div>
        {
          // bmo_contact_active will be null if a user does does not have a BMO Contact
          typeof (userData.bmo_contact_active) === 'boolean'
            ? <div>
              <div className="bmo-contact-column bmo-contact-details">
                <p className="bmo-contact-row bmo-contact-name">{`${userData.bmo_contact_first_name} ${userData.bmo_contact_last_name}`}</p>
                <p className="bmo-contact-row bmo-contact-email">{userData.bmo_contact_email}</p>
                <p className="bmo-contact-row bmo-contact-phone">{userData.bmo_contact_phone || 'No phone number'}</p>
              </div>
              <div className="bmo-contact-column bmo-contact-mail-details">
                {
                  showEmailLoader &&
                  sectionName !== 'client-lookup-match' &&
                  <Loader active={false} />}
                {
                  !showEmailLoader &&
                  userData.bmo_contact_email_sent_at &&
                  sectionName !== 'client-lookup-match' &&
                  <span className="bmo_chevron tick" />
                }
                <p className={'bmo-contact-row bmo-contact-last-mail-sent'}>
                  Last emailed: {userData.bmo_contact_email_sent_at ? userData.bmo_contact_email_sent_at : 'N/A'}
                </p>
                <Button
                  className={`
                    linkBtn bmo-contact-send-email-btn
                    ${!userData.bmo_contact_active && 'disabled-unlink'}
                    ${sectionName === 'client-lookup-match' && 'hide'}
                  `}
                  onClick={userData.bmo_contact_active ? () => { this.triggerBMOContactEmail(userData.uuid); } : undefined}
                >
                  <span>{userData.bmo_contact_email_sent_at ? 'Resend email' : 'Send email'}</span>
                </Button>
              </div>
              <Button
                className={`
                  linkBtn bmo-contact-send-email-btn
                  client-match-bmo-contact-send-email-btn
                  ${!userData.bmo_contact_email_sent_at && 'secondary'}
                  ${userData.bmo_contact_email_sent_at && 'email-sent'}
                  ${(!userData.bmo_contact_active || userData.bmo_contact_email_sent_at) && 'disabled'}
                  ${sectionName !== 'client-lookup-match' && 'hide'}
                `}
                onClick={userData.bmo_contact_active ? () => { this.triggerBMOContactEmail(userData.uuid); } : undefined}
              >
                {
                  userData.bmo_contact_email_sent_at &&
                  sectionName === 'client-lookup-match' &&
                  <span className="bmo_chevron tick" />
                }
                <span title={userData.bmo_contact_email_sent_at ? 'Email Sent' : `Send email to ${userData.bmo_contact_email}`}>{userData.bmo_contact_email_sent_at ? 'Email sent' : 'Email'}</span>
              </Button>
            </div>
            : <p
              className={`bmo-contact-row no-contact ${sectionName !== 'client-lookup-match' ? 'user-id' : ''}`}
            >
              {appsettingsVariable.BMO_CONTACT_NOT_SELECTED_MESSAGE || 'No contact was provided during registration'}
            </p>
        }
      </div>
    );
  }

  renderClientRecordMatchModal = () => {
    const { clientLookUpData } = this.props;
    const { clientRdsId, userData } = this.state; //eslint-disable-line
    let clientRecord = {};
    if (clientLookUpData.length > 1) {
      clientRecord = clientLookUpData.filter((data) => data.RdsID === clientRdsId)[0];
    } else {
      clientRecord = clientLookUpData[0];
    }
    return (
      <Modal.Content>
        <div className="button-holder">
          <Button
            className="ui button modal-close-icon bmo-close-btn"
            onClick={() => { this.clientRecordMatchBackButton(); }}
          />
        </div>
        <div
          onKeyPress={() => {}}
          tabIndex={0}
          role="button"
          className="go-back"
          onClick={() => this.clientRecordMatchBackButton()}
        >
          <span className="back-icon blue-circle-back-icon" /> <span> Back to User IDs </span>
        </div>
        <div className="record-matches">
          <div className="record-section">
            <div className="client-matches-header">
              Application Record
            </div>
            <div className="row">
              <div className="field-text">Name</div>
              <span className="field-value">{userData.first_name} {userData.last_name}</span>
            </div>
            <div className="row">
              <div className="field-text">Company</div>
              <span className="field-value">{userData.company}</span>
            </div>
            <div className="row">
              <div className="field-text">Email</div>
              <span className="field-value">{userData.email && userData.email.toLowerCase()}</span>
            </div>
            <div className="row">
              <div className="field-text">Username</div>
              <span className="field-value">{userData.username}</span>
            </div>
            <div className="row">
              <div className="field-text">Phone</div>
              <span className="field-value">{userData.phone}</span>
            </div>
          </div>
          <div className="record-section">
            <div className="client-matches-header">
              Salesforce Record
            </div>
            <div className="row">
              <div className="field-text">Name</div>
              <span className="field-value">{clientRecord.Name}</span>
            </div>
            <div className="row">
              <div className="field-text">Company</div>
              <span className="field-value">{clientRecord.Company}</span>
            </div>
            <div className="row">
              <div className="field-text">Email</div>
              <span className="field-value">{clientRecord.Email && clientRecord.Email.toLowerCase()}</span>
            </div>
            {clientRecord.RdsID ?
              <div className="row">
                <div className="field-text">RDS ID</div>
                <span className="field-value">{clientRecord.RdsID}</span>
              </div> : null
            }
            {clientRecord.SFID ?
              <div className="row">
                <div className="field-text">Salesforce ID</div>
                <span className="field-value">{clientRecord.SFID}</span>
              </div> : null
            }
            <div className="row">
              <div className="field-text">Phone</div>
              <span className="field-value">{clientRecord.Phone}</span>
            </div>
          </div>
        </div>
        <div className="link-account-question">Would you like to link these accounts ?</div>
        <div className={'button-actions'}>
          <Button secondary content={'Yes'} onClick={() => { this.onClickYes(clientRecord, clientRecord.RdsID, clientRecord.SFID); }} />
          <Button secondary content={'No'} onClick={() => { this.clientRecordMatchBackButton(); }} />
        </div>
      </Modal.Content>
    );
  }

  userInfoEditContent = () => {
    const { userInfoModelContent } = this.state;
    let content = null;
    switch (userInfoModelContent) {
      case 'userInfoEdit':
        content = this.renderUserEditForm();
        break;
      case 'clientMatches':
        content = this.renderClientMatchesModal();
        break;
      case 'clientRecordMatch':
        content = this.renderClientRecordMatchModal();
        break;
      default: return null;
    }
    return content;
  }

  toggleExpansion = (toggleStatus) => () => {
    if (!toggleStatus) {
      this.setState({ isCardOpen: true });
    }
  }

  linkUser = () => () => {
    this.setState({ userInfoModelOpen: true, userInfoModelContent: 'userInfoEdit', tabName: 'userids' });
  }

  unlink = (type) => {
    const { userEditState } = this.state;
    userEditState.userids.rdsId.value = '';
    userEditState.userids.sfId.value = '';
    this.setState({ userEditState, userInfoModelContent: 'userInfoEdit', fromClientLookUP: true }, () => {
      if (type === 'saveForm') {
        this.submitEditForm('fromExpandedRow');
      }
    });
  }

  sendForgotPasswordEmail = async () => {
    const { userData } = this.props;

    const formData = {
      email: userData.email
    };

    this.setState({
      sendEmailText: 'Sending...',
      disableForgotPasswordLink: true
    });

    const resp = await forgotPasswordAPI(formData);

    if (resp.ok && resp.status === 200) {
      setTimeout(() => this.setState({
        sendEmailText: 'Sent forgot password email',
        disableForgotPasswordLink: true
      }), 1000);
    }

    setTimeout(() => this.setState({
      sendEmailText: 'Send forgot password email',
      disableForgotPasswordLink: false
    }), 10000);
  }

  triggerBMOContactEmail = async (userUUID) => {
    const { sendBMOContactEmail } = this.props; //eslint-disable-line
    const { userData } = this.state;
    this.setState({ showEmailLoader: true });

    const resp = await sendBmoContactEmail(userUUID);


    if (resp.ok && resp.status === 200) {
      userData.bmo_contact_email_sent_at = resp.data.timestamp;

      // Updating the timestamp in the UI after triggering the BMO Contact Email feature
      this.setState({ userData, showEmailLoader: false });
    }
  }

  getUserAccessDetail = () => {
    const { userData } = this.state;
    const accessDetail = [];
    let displayData = [];
    userData && Object.keys(userData).map(key => {
      if (this.accessMapper[key] !== undefined) {
        userData[key] === true ? accessDetail.push(this.accessMapper[key]) : null;
      }
      return null;
    });
    displayData = accessDetail.length && accessDetail.sort((a, b) => a.orderId - b.orderId).map(item => item.key);
    if (!displayData) {
      return 'None';
    } else if (displayData.length && displayData.length === Object.keys(this.accessMapper).length) {
      return 'All';
    } else if (displayData.length) {
      return displayData.join(', ');
    }
    return null;
  }

  render() {
    const {
      isCardOpen,
      userData,
      userInfoModelOpen,
      userEditState,
    } = this.state;

    let currentStatus = '';
    let selectedStatus = '';
    userEditState.entitlements.status.map((data) => {
      if (data.selected) {
        currentStatus = data.text;
        selectedStatus = data.value;
      }
    });

    const displayName = `${userData.first_name} ${userData.last_name}`;

    const sflink = window.unchainedSite && window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.ADMIN_SALESFORCE_LINK;

    return (
      <div>
        <div className={`admin-summary-card ${isCardOpen.toString()}`}>
          <div className="date result-cell" onClick={this.openAdminSummery} onKeyPress={() => {}} tabIndex={0} role="button">{moment(userData.created_at).format('MM/DD/YYYY')}</div>
          <div className="name result-cell">
            <span className="admin-name rw">
              <span className={'user-display-name'}>
                {
                  userData.status !== 'Approved' &&
                  userData.status !== 'Expired' &&
                  !userData.linked &&
                  typeof (userData.bmo_contact_active) === 'boolean' &&
                  !userData.bmo_contact_email_sent_at &&
                  <span
                    className={`link-btn ${userData.bmo_contact_active ? 'mail-icon' : 'mail-icon-disabled'}`}
                    onClick={this.linkUser()}
                    onKeyPress={() => {}}
                    tabIndex={0}
                    role="button"
                  />
                }
                {
                  !userData.linked &&
                  <span className={'link-btn link-icon'} onClick={this.linkUser()} onKeyPress={() => {}} tabIndex={0} role="button" />
                }
                <span onClick={this.userInfoEdit} className={'name'} onKeyPress={() => {}} tabIndex={0} role="button">
                  {displayName}
                </span>
              </span>
            </span>
            {isCardOpen ?
              <div className={'name-col-other-info'}>
                <span className="email rw">
                  {userData.email || ''}
                </span>
                <span className="phone rw">
                  {userData.phone || ''}
                </span>
                {userData.linked &&
                  <div className={'sf-rds-info'}>
                    {userData.salesforce_id &&
                      <div className={'SF-external-link'}>
                        <span className={'sub-heading'}>SF</span>
                        <a href={`${sflink}/${userData.salesforce_id}/`} target="_blank" onClick={() => this.handleNavClick(text)} className="footer-link">
                          {userData.salesforce_id}
                        </a>
                      </div>
                    }
                    {userData.rds_id ?
                      <div className={'rds-info'}>
                        <span className={'sub-heading'}>RDS</span>
                        <span>{userData.rds_id}</span>
                      </div> : null
                    }
                  </div>
                }
                {userData.linked ?
                  <Button className={'linkBtn to-unlink'} onClick={() => { this.unlink('saveForm'); }} >
                    <span>Unlink</span>
                    <span className={'link-btn unlink-icon'} />
                  </Button> :
                  <Button className={'linkBtn  disabled-unlink to-unlink'} onClick={() => { this.unlink('saveForm'); }} >
                    <span>Unlink</span>
                    <span className={'link-btn unlink-disable-icon'} />
                  </Button>
                }
              </div>
              :
              null
            }
          </div>
          <div className="company result-cell" onClick={this.openAdminSummery} onKeyPress={() => {}} tabIndex={0} role="button">{userData.company}</div>
          <div className="status result-cell-status result-cell">
            <div className={'left'}>
              {!isCardOpen ?
                <div className=" rw status">
                  <span className={`${selectedStatus} desktop-row status-circle`} />
                  <span className={'status-circle-text'}>{currentStatus}</span>
                </div>
                :
                null
              }
              {
                isCardOpen ?
                  <div className={'all-status-color'}>
                    {userEditState.entitlements.status.slice(1).map((status, index) => {
                      const keyProp = index;
                      return (
                        <div className="rw status" key={keyProp}>
                          <span
                            className={`${status.value} status-circle ${status.selected}`}
                            onClick={this.onRadioButtonSelect(['saveData', status.selected], 'entitlements', 'status', status.key)}
                            onKeyPress={() => {}}
                            tabIndex={0}
                            role="button"
                          />
                          <span>{status.text}</span>
                        </div>
                      );
                    })
                    }
                  </div>
                  : null
              }
            </div>
          </div>
          <div className="linked result-cell-status result-cell" onClick={this.openAdminSummery} onKeyPress={() => {}} tabIndex={0} role="button">
            <div className={'left'}>
              <div className={'entitlement-list'}>{this.getUserAccessDetail()}</div>
            </div>
            <div className="result-cell-collaps-icon">
              <Button className={`icon blue-angle-icon ${isCardOpen.toString()}`} onClick={this.openAdminSummery} title={st.showMoreLess} />
            </div>
          </div>
        </div>
        {userInfoModelOpen &&
          <Modal
            open={userInfoModelOpen}
            dimmer={true}
            onClose={this.closeUserInfoModelOpen}
            className={'Client-Look-Up'}
            onUnmount={this.closeUserInfoModelOpen}
          >
            {this.userInfoEditContent()}
          </Modal>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  statusLists: adminSelector.getStatusLists(state),
  regionList: adminSelector.getRegionList(state),
  clientLookUpData: adminSelector.getClientLookUpdata(state),
  isClientLookupLoading: adminSelector.isClientLookupLoading(state),
  userUpdateError: adminSelector.getUserUpdateError(state),
  unlinkingSuccessful: adminSelector.isUnlinkingSuccessful(state),
  saveLoading: adminSelector.getSaveLoading(state),
  closeModalCheck: adminSelector.getCloseModalCheck(state),
  unlinkUserLoad: adminSelector.getUnlinkUserLoad(state),
});

const mapDispatchToProps = (dispatch) => ({
  apiClientLookUp: (email) => {
    dispatch(GET_CLIENT_LOOKUP_DATA(email));
  },
  updateUserApi: (data, userIndex, isDelayRequired) => {
    dispatch(UPDATE_USER_INFO_DATA(data, userIndex, isDelayRequired));
  },
  unlinkingExistingUser: (rdsid) => {
    dispatch(UNLINK_EXISTING_USER(rdsid));
  },
  sendBMOContactEmail: (data) => {
    dispatch(SEND_BMO_CONTACT_EMAIL(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminSummaryCard);
