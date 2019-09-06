import React from 'react';
import PropTypes from 'prop-types';
import SearchFormatter from './SearchFormatter';

const Footnotes = ({ data }) => {
  if (!data) return null;
  return (
    <div className="publication-footnote">
      {
        data.map((d) => {
          return (
            <div>
              <small>
                {d.name.toLowerCase() === 'general' ?
                  SearchFormatter('Notes')
                  :
                  SearchFormatter(d.name)
                }: {SearchFormatter(d.description)}
              </small>
            </div>
          );
        })
      }
    </div>
  );
};

Footnotes.propTypes = {
  data: PropTypes.object,
};

export default Footnotes;
