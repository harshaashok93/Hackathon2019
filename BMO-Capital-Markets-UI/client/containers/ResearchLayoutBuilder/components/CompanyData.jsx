import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'components';
import { Table, Heading } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

const getTableElements = (data) => {
  if (!data) return null;
  const rowData = [];
  let columnData = [];
  if (data.length === 1 || data.length === 2) {
    data.map(d => {
      columnData.push(<Table.Cell>{SearchFormatter(d.key)}</Table.Cell>);
      columnData.push(<Table.Cell className="right-table-align">{d.value}</Table.Cell>);
    });
    rowData.push(
      <Table.Row>
        {columnData}
      </Table.Row>
    );
  } else {
    data.map((d, i) => {
      if (i !== 0 && i % 2 === 0) {
        rowData.push(
          <Table.Row key={Math.random()}>
            {columnData}
          </Table.Row>
        );
        columnData = [];
      }
      columnData.push(<Table.Cell>{SearchFormatter(d.key)}</Table.Cell>);
      columnData.push(<Table.Cell className="right-table-align">{SearchFormatter(d.value)}</Table.Cell>);
      if (i === data.length - 1) {
        rowData.push(
          <Table.Row key={Math.random()}>
            {columnData}
          </Table.Row>
        );
      }
    });
  }
  return rowData;
};

const CompanyData = ({ data }) => {
  if (!data) return null;
  return (
    <div className="company-data label-value">
      <Table celled striped className="research-layout-table">
        <Table.Header>
          <Table.Row className={'headerRow'}>
            <Table.HeaderCell colSpan={'4'}>
              <Heading className="headingTab">
                {SearchFormatter(data.title)}
                <RichText className="title-subtext subtext" richText={SearchFormatter(data.currency)} />
              </Heading>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {getTableElements(data.data)}
        </Table.Body>
      </Table>
    </div>
  );
};

CompanyData.propTypes = {
  data: PropTypes.object
};

export default CompanyData;
