/* @flow weak */

/*
 * Component: Top15IndividualComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Accordion, Container } from 'unchained-ui-react';
import { NavLink } from 'react-router-dom';
import { RichText } from 'components';
import moment from 'moment';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './Top15IndividualComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Top15IndividualComponent extends Component {
  props: {
    result: {},
    title: '',
    subTitle: '',
    valueText: '',
    desktop: bool,
    updatedCompanies: '',
    top_15_type: ''
  };

  static defaultProps = {
  };

  state = {
    individualResult: {},
  };

  componentWillMount() {
    const { result, valueText } = this.props;
    const individualResult = result.data.filter(res => res.menu_title === valueText);
    this.setState({ individualResult });
  }

  formatCompanyList = (companyList) => {
    let formattedList = companyList.map(company => `${company.coverage__client_code.split('=')[0]} (${moment(company.updated_at).format('MM/DD/YYYY')})`);
    formattedList = formattedList.join('; ');
    return formattedList;
  }

  render() {
    const { individualResult } = this.state;
    const { title, subTitle, desktop, updatedCompanies, top_15_type } = this.props; // eslint-disable-line

    let addedCompanies = individualResult && individualResult[0].added && this.formatCompanyList(individualResult[0].added);
    addedCompanies = addedCompanies !== '' ? `<p>Added: ${addedCompanies}</p>` : '';
    let deletedCompanies = individualResult && individualResult[0].deleted && this.formatCompanyList(individualResult[0].deleted);
    deletedCompanies = deletedCompanies !== '' ? `<p>Deleted: ${deletedCompanies}</p>` : '';

    const featuredUpdatedCompanies = (addedCompanies !== '' || deletedCompanies !== '') ? `<div class="rich-text">${addedCompanies}${deletedCompanies}</div>` : '';

    let richTextData = '';
    if (top_15_type === 'q-model') { // eslint-disable-line
      richTextData = updatedCompanies;
    } else if (top_15_type === 'featured') { // eslint-disable-line
      richTextData = featuredUpdatedCompanies;
    }

    if (desktop) {
      return (
        <div className="top-15-detail-container">
          <div className="top-15-header">{title}</div>
          {subTitle && <div className="top-15-subheader">{subTitle}</div>}
          <div className="list-container">
            {individualResult && individualResult[0].company_list ? individualResult[0].company_list.map(company => {
              const ticker = company && company.CompanyTicker ? `(${company.CompanyTicker})` : '';
              const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(company.CompanyTicker)}&searchTicker=${encodeURIComponent(company.CompanyTicker)}`;
              const showCompanyLink = company.is_active && !company.do_not_sync_to_rds && !company.hide;
              return (
                <Container
                  className={showCompanyLink ? 'list-content' : 'list-content not-a-link'}
                  as={showCompanyLink ? NavLink : 'div'}
                  to={showCompanyLink ? toUrl : ''}
                >
                  <span className="comp">
                    {`${company.FullName}  `}
                  </span>
                  <span className="ticker">{ticker} {company.restricted && '*'}</span>
                </Container>
              );
            }) : null}
          </div>
          <RichText className={'updatedTexts'} richText={richTextData} />
        </div>
      );
    }
    return (
      <Accordion>
        <Accordion.Title>
          <i aria-hidden="true" className="bmo_chevron bottom" />
          <div className="top-15-header">{title}</div>
        </Accordion.Title>
        <Accordion.Content>
          {subTitle && <div className="top-15-subheader">{subTitle}</div>}
          <div className="list-container">
            {individualResult && individualResult[0].company_list ? individualResult[0].company_list.map(company => {
              const ticker = company && company.CompanyTicker ? `(${company.CompanyTicker})` : '';
              const toUrl = `/library/?searchType=company&searchVal=${encodeURIComponent(company.CompanyTicker)}&searchTicker=${encodeURIComponent(company.CompanyTicker)}`;
              const showCompanyLink = company.is_active && !company.do_not_sync_to_rds && !company.hide;
              return (
                <Container
                  className={showCompanyLink ? 'list-content' : 'list-content not-a-link'}
                  as={showCompanyLink ? NavLink : 'div'}
                  to={showCompanyLink ? toUrl : ''}
                >
                  <span className="comp">
                    {company.FullName}
                  </span>
                  <span className="ticker">{ticker} {company.restricted && '*'}</span>
                </Container>
              );
            }) : null}
          </div>
          <RichText className={'updatedTexts'} richText={richTextData} />
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default Top15IndividualComponent;
