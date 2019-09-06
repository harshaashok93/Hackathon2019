/* @flow weak */

/*
 * Component: DisclosureComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Loader } from 'unchained-ui-react';
import { getParameterByName, removeQueryParams } from 'utils';
import {
  GET_PROFILE_COMPANY_LIST,
  GET_DISCLOSURE_INFO,
} from 'store/actions';

import {
  userSelector,
} from 'store/selectors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './DisclosureComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DisclosureComponent extends Component {
  props: {
    getProfileCompanyList: () => void,
    getDefaultDisclosure: () => void,
    profileCompanyList: {
      sector: [],
      coverage: [],
      analyst: []
    },
    disclosureData: {},
    isLoading: boolean
  };

  static defaultProps = {
  };

  state = {
    companyList: [],
    selectedVal: '',
    iFrameUrl: '',
    newIframeUrl: ''
  }

  componentWillMount() {
    const { getProfileCompanyList, getDefaultDisclosure } = this.props;
    const id = getParameterByName('ticker') || '';
    getProfileCompanyList();
    getDefaultDisclosure(id !== '' ? id - 0 : '');
    this.setState({ selectedVal: id - 0 });
  }

  componentDidMount() {
    const { getDefaultDisclosure } = this.props;
    const id = getParameterByName('ticker') || '';
    getDefaultDisclosure(id !== '' ? id - 0 : '');
  }

  componentWillReceiveProps(nextProps) {
    const { disclosureData } = nextProps;
    this.setState({ iFrameUrl: disclosureData.disclosure_url });
    this.setState({ newIframeUrl: this.state.iFrameUrl });
  }

  onChangeofDropDown = (disclosureDropdown) => (e, val) => {
    const dropdownObj = disclosureDropdown.filter((data) => {
      return data.value === val.value;
    });

    this.setState({ selectedVal: val.value }, () => {
      removeQueryParams();

      this.setState({ newIframeUrl: `${this.state.iFrameUrl}&companySymbol=${(dropdownObj && dropdownObj[0] && dropdownObj[0].ticker)}` });
    });
  }

  render() {
    const { profileCompanyList, isLoading } = this.props;
    const { selectedVal } = this.state;
    const placeholderText = 'Company / Ticker';
    let selectedText = placeholderText;
    if ((profileCompanyList.coverage && (profileCompanyList.coverage.length) && selectedVal)) {
      const match = profileCompanyList.coverage.filter(c => c.value === selectedVal);
      if (match && match[0] && match[0].text) {
        selectedText = match[0].text;
      }
    }

    const disclosureDropdown = Object.assign([], profileCompanyList.coverage);
    disclosureDropdown.splice(0, 0, { key: 989898, text: 'Company / Ticker', value: '' });

    return (
      <div className="disclosure-component">
        <div className="disclosure-action-container">
          <Dropdown
            placeholder={placeholderText}
            fluid
            search
            selection
            options={disclosureDropdown}
            className={'dropdown-chevron bmo_chevron bottom'}
            onChange={this.onChangeofDropDown(disclosureDropdown)}
            value={selectedVal}
            text={selectedText}
            selectOnBlur={false}
          />
        </div>
        <div className="disclosure-seperator" />
        {
          isLoading ?
            <div className={'loader-container'}><Loader active={true} content="Loading..." /></div>
            :
            <div className="disclosure-iframe-wrapper">
              <iframe title="Disclosures" frameBorder="false" height="1200" width="100%" src={this.state.newIframeUrl} />
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profileCompanyList: userSelector.getProfileCompanyList(state),
  isLoading: userSelector.isDisclosureLoading(state),
  disclosureData: userSelector.getDisclosureInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  getProfileCompanyList: () => {
    dispatch(GET_PROFILE_COMPANY_LIST());
  },
  getDefaultDisclosure: (id) => {
    dispatch(GET_DISCLOSURE_INFO(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DisclosureComponent);
