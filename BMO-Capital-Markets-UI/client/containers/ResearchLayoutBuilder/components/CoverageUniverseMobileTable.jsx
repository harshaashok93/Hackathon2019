import React, { Component } from 'react';
import { Table, Modal, Button } from 'unchained-ui-react';
import SearchFormatter from './SearchFormatter';

class CoverageUniverseMobileTable extends Component {
  props: {
    data: {},
  }

  state = { modalOpen: false, companyIndex: '' }

  getArrow = (direction) => {
    if (direction === 'DOWN') {
      return <span className="down-arrow" />;
    } else if (direction === 'UP') {
      return <span className="up-arrow" />;
    }
    return null;
  };

  openModal = (companyIndex) => () => {
    this.setState({ modalOpen: true, companyIndex }, () => {
      document.body.style.overflow = 'hidden';
    });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
    document.body.style.overflow = '';
  }

  renderCompanyModal = () => {
    const { data } = this.props;
    const { companyIndex, modalOpen } = this.state;
    const companyData = data.tableData && data.tableData[companyIndex];
    return (
      <Modal
        open={modalOpen}
        onClose={this.closeModal}
        className={'coverageUniverseModal'}
      >
        <Modal.Content>
          <div className="button-holder">
            <Button className="ui button modal-close-icon bmo-close-btn" onClick={this.closeModal} />
          </div>
          {companyData.map((item, i) => {
            if (i === 0) {
              return (<div className={'company-name'}>{item.value}</div>);
            }
            if (data.tableHeader[i] && (data.tableHeader[i] !== '')) {
              return (
                <div className={`company-universe-Overlay-row ${i}`}>
                  <div className={'title'}>{data.tableHeader && data.tableHeader[i]}</div>
                  <div className={'value'}>{item.value}</div>
                </div>
              );
            }
            return null;
          })
          }
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    const { data } = this.props;
    const { modalOpen } = this.state;
    const columnNumber = 4;

    const tableHeader = Object.assign([], data.tableHeader);

    if (!data) return null;
    return (
      <div>
        <Table striped className="research-layout-table">
          <Table.Header>
            <Table.Row>
              {
                tableHeader ?
                  tableHeader.splice(0, 4).map((d, i) => {
                    return (
                      <Table.HeaderCell
                        className={i !== 0 ? 'right-table-align' : 'first-table-cell'}
                        key={`${i + 1}`}
                      >
                        {SearchFormatter(d)}
                      </Table.HeaderCell>
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
                let dVal = Object.assign([], dt);
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
                      dVal.splice(0, 4).map((d, i) => {
                        return (
                          <Table.Cell title={d.value || ''} className={i !== 0 ? 'right-table-align' : 'first-table-cell'} key={`${i + 1}`}>
                            {i === 0 ?
                              <span
                                className={`${d.value ? '' : 'no-data'}`}
                                onKeyPress={() => {}}
                                tabIndex={0}
                                role={'button'}
                                onClick={i === 0 ? this.openModal(index) : ''}
                              >
                                {SearchFormatter(d.value || '-')}
                              </span>
                              :
                              <span className={`${d.value ? '' : 'no-data'}`}>{SearchFormatter(d.value || '-')}</span>
                            }
                            {this.getArrow(d.arrow || '')}
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
        {modalOpen && this.renderCompanyModal()}
      </div>
    );
  }
}

export default CoverageUniverseMobileTable;
