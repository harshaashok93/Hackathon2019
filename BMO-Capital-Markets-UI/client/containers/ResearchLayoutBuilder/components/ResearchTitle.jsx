import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Heading } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

const ResearchTitle = ({ data }) => {
  let titleLink = '';

  if (data && data.TitleLink && data.TitleLink.searchVal) {
    const { searchType, searchVal } = data.TitleLink;

    titleLink = `/library/?searchType=${encodeURIComponent(searchType)}&searchVal=${encodeURIComponent(searchVal)}`;
    if (data.TitleLink.searchTicker) {
      titleLink += `&searchTicker=${encodeURIComponent(data.TitleLink.searchTicker)}`;
    }

    if (data.TitleLink.sectorId) {
      titleLink += `&sectorId=${encodeURIComponent(data.TitleLink.sectorId)}`;
    }
  }

  return (
    <div className="research-title">
      {titleLink !== '' ?
        <NavLink className="back-link" to={titleLink}>
          <Heading>{SearchFormatter(data.Title)}</Heading>
        </NavLink>
        :
        <Heading>{SearchFormatter(data.Title)}</Heading>
      }
    </div>
  );
};

ResearchTitle.propTypes = {
  data: PropTypes.object,
};

export default ResearchTitle;
