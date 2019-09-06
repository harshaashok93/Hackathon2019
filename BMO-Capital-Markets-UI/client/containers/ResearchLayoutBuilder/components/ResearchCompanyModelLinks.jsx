import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Card } from 'unchained-ui-react';
import { pushToDataLayer } from 'analytics';

const ResearchCompanyModelLinks = ({ data, mainTitle, productId }) => {
  const handleNavClick = (action) => {
    pushToDataLayer('report', 'reportEvents', { action, label: mainTitle });
  };

  if (!data) return null;
  return (
    <div className="company-data">
      <Card >
        <Card.Content>
          <Card.Description>
            <span className="comp-desc-library-link">
              <NavLink to={`/library/?searchType=company&searchVal=${data.ticker}&searchTicker=${data.ticker}`} onClick={() => handleNavClick(`${data.ticker} Research`)}>
                {data.ticker} Research
              </NavLink>
            </span>
            <span className="comp-desc-model-link">
              <NavLink to={`/bmo-data/bmo-models/?searchCompId=${data.companyId}`} onClick={() => handleNavClick('Company Models')}>
                Company Models
              </NavLink>
            </span>
            { data.glossary_link &&
              <span className="comp-desc-model-link">
                <a href={`/api/v1/publication/GetGlossaryDoc/?publication_id=${productId}`} onClick={() => handleNavClick('Glossary')} target="_blank">
                  Glossary
                </a>
              </span>
            }
          </Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
};

ResearchCompanyModelLinks.propTypes = {
  data: PropTypes.object,
  mainTitle: PropTypes.string,
  productId: PropTypes.string,
};

export default ResearchCompanyModelLinks;
