import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Heading } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

const SectorName = ({ data }) => {
  const { searchType, searchVal, sectorId } = data.SectorLink;
  return (
    <NavLink className="back-link" to={`/library/?searchType=${encodeURIComponent(searchType)}&searchVal=${encodeURIComponent(searchVal)}&sectorId=${sectorId}`}>
      <Heading className="sector-name headingTab">{SearchFormatter(data.Title)}</Heading>
    </NavLink>
  );
};

SectorName.propTypes = {
  data: PropTypes.object
};

export default SectorName;
