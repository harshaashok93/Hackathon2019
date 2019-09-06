import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'components';
import { Table, Heading } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

const CommonBMOTable = ({ data }) => {
  const getArrow = (direction) => {
    if (direction === 'DOWN') {
      return <span className="down-arrow" />;
    } else if (direction === 'UP') {
      return <span className="up-arrow" />;
    }
    return null;
  };

  const columnNumber = data.tableHeader && data.tableHeader.length;
  if (!data) return null;
  return (
    <Table striped className="research-layout-table">
      <Table.Header>
        { data.title &&
          <Table.Row className={'headerRow'}>
            <Table.HeaderCell colSpan={data.tableHeader.length}>
              <Heading className="headingTab">
                {SearchFormatter(data.title)}
                <RichText className="title-subtext subtext" richText={SearchFormatter(data.currency)} />
              </Heading>
            </Table.HeaderCell>
          </Table.Row>
        }
        <Table.Row>
          {
            data.tableHeader ?
              data.tableHeader.map((d, i) => {
                return (
                  <Table.HeaderCell className={i !== 0 ? 'right-table-align' : 'first-table-cell'} key={`${i + 1}`}>{SearchFormatter(d)}</Table.HeaderCell>
                );
              })
              :
              null
          }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          data.tableData && data.tableData.map(dt => {
            let dVal = dt;
            if (dt && dt.length && dt.length < columnNumber) {
              for (let i = dt.length; i < columnNumber; i += 1) {
                dVal = dt;
                dVal[i] = {};
              }
            }
            if (!dVal.length) return null;
            return (
              <Table.Row key={Math.random()}>
                {
                  dVal.map((d, i) => {
                    return (
                      <Table.Cell title={d.value || ''} className={i !== 0 ? 'right-table-align' : 'first-table-cell'} key={`${i + 1}`}>
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
  );
};

CommonBMOTable.propTypes = {
  data: PropTypes.object
};

export default CommonBMOTable;
