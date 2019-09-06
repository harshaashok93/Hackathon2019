import React, { Component } from 'react';
import { Heading, Grid, Image } from 'unchained-ui-react';
import { ResearchLayoutFilters } from 'containers';
import { NavLink } from 'react-router-dom';
import { RichText } from 'components';

import SearchFormatter from './SearchFormatter';

class Sections extends Component {
  props: {
    data: {},
    pid: '',
    updateSearchTerm: () => void,
    isLoggedIn: bool,
    productId: ''
  }

  state = {
    fontSize: 'aa'
  }

  updateFont = (fontSize) => {
    this.setState({ fontSize });
  }

  getCountryFlag = (countryCode) => {
    if (countryCode && (countryCode === 'US' || countryCode === 'CA')) {
      return `${countryCode}.jpg`;
    }
    return 'globe.png';
  }


  render() {
    const { data, pid, updateSearchTerm, isLoggedIn, productId } = this.props;
    if (!data) return null;
    return (
      <Grid className={`sections ${this.state.fontSize}`}>
        <Grid.Column computer={2} tablet={2} mobile={12} className="rl-filters-section">
          <ResearchLayoutFilters
            pid={pid}
            currentFontSize={this.state.fontSize}
            updateFontSize={(size) => this.updateFont(size)}
            handleSearchChange={(val) => updateSearchTerm(val)}
            productId={productId}
          />
        </Grid.Column>
        <Grid.Column computer={isLoggedIn ? 10 : 12} tablet={isLoggedIn ? 10 : 12} mobile={12}>
          {
            data.map(parent => {
              return (
                <div className="parent-wrapper">
                  <Heading as={'h2'} className="title section-title">{SearchFormatter(parent.title)}</Heading>
                  {
                    parent.data && parent.data.map((child) => {
                      return (
                        <div className="child-wrapper">
                          <div className="section-company">
                            <span className="section-company-name">
                              {child.CompanyName ? SearchFormatter(child.CompanyName) : SearchFormatter(child.Industry)}
                            </span>
                            {
                              child.arrow ?
                                <Image src={`/assets/images/${child.arrow}.png`} />
                                :
                                null
                            }
                            {
                              (parent.title.toLowerCase() !== 'sector updates') ?
                                <Image src={`/assets/images/${this.getCountryFlag(child.CountryCode)}`} className={`countryCode ${this.getCountryFlag(child.CountryCode) === 'globe.png' ? 'globe-icon' : ''}`} />
                                :
                                null
                            }
                          </div>
                          <div className="author">
                            {SearchFormatter(child.Author)} {parent.title.toLowerCase() !== 'sector updates' && SearchFormatter(`- ${child.Industry}`)}
                          </div>
                          <NavLink to={`${child.ProductID ? `/research/${child.ProductID}` : ''}`} className="title">{SearchFormatter(child.Title)}</NavLink>
                          {(parent.title.toLowerCase() !== 'sector updates') &&
                            <div className="row sections-rating">
                              <div className="column">
                                <div>{SearchFormatter('Rating')}</div>
                                <div>{SearchFormatter(child.Rating || '-')}</div>
                              </div>
                              <div className="column">
                                <div>{SearchFormatter('Price')}</div>
                                <div>{SearchFormatter(child.Price || '-')}</div>
                              </div>
                              <div className="column">
                                <div>{SearchFormatter('Target')}</div>
                                <div>{SearchFormatter(child.Target || '-')}</div>
                              </div>
                              <div className="column">
                                <div>{SearchFormatter('Mkt Cap')}</div>
                                <div>{SearchFormatter(child.MktCap || '-')}</div>
                              </div>
                            </div>
                          }
                          <div className="sections-summary">
                            <RichText richText={SearchFormatter(child.Summary, { richText: false })} />
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </Grid.Column>
      </Grid>
    );
  }
}

export default Sections;
