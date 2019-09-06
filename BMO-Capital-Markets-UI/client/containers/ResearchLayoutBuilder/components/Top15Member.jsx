import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Card, Image, Grid } from 'unchained-ui-react';
import { RESEARCH_LAYOUT_BMOTOP15 } from 'constants/assets';
import SearchFormatter from './SearchFormatter';

const getUrlLink = (companyTicker) => `/library/?searchType=company&searchVal=${encodeURIComponent(companyTicker)}&searchTicker=${encodeURIComponent(companyTicker)}`;

const Top15Member = ({ data }) => {
  if (!data || !data.values || !data.values.length) return null;
  return (
    <div className="top-15-member price-title-text-block">
      <div className="item">
        <Card>
          <Card.Content className="red-circle-container">
            <Card.Header className="header">
              <div>{SearchFormatter('BMO Top 15 List Members')}</div>
            </Card.Header>
            <Card.Description>
              <Grid>
                <Grid.Row columns={12}>
                  <Grid.Column className="top15ImageHolder-container" width={3}>
                    <div className="top15ImageHolder"><Image src={RESEARCH_LAYOUT_BMOTOP15} /></div>
                  </Grid.Column>
                  <Grid.Column width={9}>
                    {
                      data.data
                        ? data.data.map(({ marketCap, companyName, companyTicker }) => {
                          const url = getUrlLink(companyTicker);
                          return (
                            <div className="top15-link-detail">
                              <div>
                                {
                                  companyName && companyTicker &&
                                  <NavLink to={url || ''}>
                                    {companyName} ({companyTicker})
                                  </NavLink>
                                }
                              </div>
                              <div className="market-name" >{marketCap.map((e) => <div>{e}</div>)}</div>
                            </div>
                          );
                        })
                        : data.values.map(value => <div className="market-name" key={Math.random()}>{SearchFormatter(value)}</div>)
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

Top15Member.propTypes = {
  data: PropTypes.object
};

export default Top15Member;
