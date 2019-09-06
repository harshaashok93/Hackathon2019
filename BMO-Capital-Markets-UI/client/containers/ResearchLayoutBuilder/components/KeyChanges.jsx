import React from 'react';
import PropTypes from 'prop-types';
import { Table, Heading, Grid } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

const KeyChanges = ({ data }) => {
  if (!data || !data.tableData.length) return null;

  const getArrow = (direction) => {
    if (direction === 'DOWN') {
      return <span className="down-arrow" />;
    } else if (direction === 'UP') {
      return <span className="up-arrow" />;
    }
    return null;
  };

  const getTable = () => {
    const columnNumber = data.tableHeader && data.tableHeader.length;
    const estimatesIndex = data.tableHeader.indexOf('Estimates');
    return (
      <div className="key-changes">
        <Table striped className="research-layout-table">
          <Table.Header>
            { data.title &&
              <Table.Row className={'headerRow'}>
                <Table.HeaderCell colSpan={data.tableHeader.length}>
                  <Heading className="headingTab">
                    {SearchFormatter(data.title)}
                    <span className="subtext">{SearchFormatter(data.currency)}</span>
                  </Heading>
                </Table.HeaderCell>
              </Table.Row>
            }
            <Table.Row>
              {
                data.tableHeader ?
                  data.tableHeader.map((d, i) => {
                    let className = (estimatesIndex !== -1 && i > estimatesIndex) ? 'right-table-align' : '';
                    className = (i === 0) ? `${className} first-table-cell` : className;
                    return (
                      <Table.HeaderCell className={className} key={`${i + 1}`}>{SearchFormatter(d)}</Table.HeaderCell>
                    );
                  })
                  :
                  null
              }
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              data.tableData && data.tableData.map((dt, index) => {
                let dVal = dt;
                if (dt && dt.length && dt.length < columnNumber) {
                  for (let i = dt.length; i < columnNumber; i += 1) {
                    dVal = dt;
                    dVal[i] = {};
                  }
                }
                if (!dVal.length) return null;
                let previousTextIndex = dVal.map(function(e) { return e.value.toLowerCase(); }).indexOf('previous'); // eslint-disable-line
                return (
                  <Table.Row key={Math.random()}>
                    {
                      dVal.map((d, i) => {
                        let className = ((index + 1) % 2 === 0) ? 'turn-text-italics' : '';
                        className = estimatesIndex !== -1 && i > estimatesIndex ? `${className} right-table-align` : `${className}`;
                        return (
                          <Table.Cell
                            title={d.value || ''}
                            className={className}
                            key={`${i + 1}`}
                          >
                            <span className={`${d.value ? '' : 'no-data'}`}>{SearchFormatter(d.value || '-')}</span>
                            {getArrow(d.arrow || '')}
                            {d.change ? <span className={SearchFormatter(d.change)} /> : null}
                          </Table.Cell>
                        );
                      })
                    }
                  </Table.Row>
                );
              })
            }
          </Table.Body>
        </Table>
      </div>
    );
  };
  return (
    <Grid className={'keychanges'}>
      <Grid.Column computer={2} tablet={2} mobile={12} className={'empty-grid'} />
      <Grid.Column computer={10} tablet={10} mobile={12} className={'move-right'}>
        {getTable()}
      </Grid.Column>
    </Grid>
  );
};

KeyChanges.propTypes = {
  data: PropTypes.object
};

export default KeyChanges;
