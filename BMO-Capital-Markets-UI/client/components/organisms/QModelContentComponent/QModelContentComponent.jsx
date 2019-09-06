/* @flow weak */

/*
 * Component: QModelContentComponent
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { elasticSearchUrl } from 'config';
import { NavLink } from 'react-router-dom';
import { Image, Button } from 'unchained-ui-react';
import { RichText } from 'components';
import { pushToDataLayer } from 'analytics';


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QModelContentComponent.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QModelContentComponent extends Component {
  props: {
    qModelRichText: {},
    usReportButtonText: '',
    canadianReportButtonText: '',
    graphImage: '',
    tableImage: '',
    usReportTemplate: '',
    canadianReportTemplate: '',
  };

  static defaultProps = {
  };

  state = {
  };

  componentWillMount() {
    const { canadianReportTemplate, usReportTemplate } = this.props;
    this.setState({ [canadianReportTemplate]: '', [usReportTemplate]: '' });
    this.generateQModelReportLink(canadianReportTemplate);
    this.generateQModelReportLink(usReportTemplate);
  }

  componentDidMount() {
    // Component ready
  }

  generateQModelReportLink(templateAbbr) {
    fetch(`${elasticSearchUrl}/publications/_search/?filter_path=hits.hits._source.product_id&q=template_abbr:${templateAbbr}&size=1&sort=publisher_date:desc`)
      .then(response => response.json())
      .then(data => {
        const productId = (data.hits && data.hits.hits && data.hits.hits[0] && data.hits.hits[0]._source && data.hits.hits[0]._source.product_id) || '';

        if (productId !== '') {
          this.setState({ [templateAbbr]: `/research/${productId}` });
        } else {
          throw new Error(`Product ID not available for this template abbreviation ${templateAbbr}`);
        }
      })
      .catch(error => {
        this.setState({ [templateAbbr]: '#' });
        console.error(error);// eslint-disable-line
      });
  }

  handleClick = (reportCountry) => () => {
    pushToDataLayer('qmodel', 'viewReport', { action: reportCountry, label: '' });
  }

  getCanadianButtons = (canadianReportButtonText, canadianReportTemplate) => {
    const hrefUrl = this.state[canadianReportTemplate];

    if (canadianReportButtonText) {
      return (
        <NavLink
          to={hrefUrl}
          onClick={this.handleClick('Canadian Report')}
          className={'report-btn canadian-report'}
        >
          <Button secondary >{canadianReportButtonText}</Button>
        </NavLink>
      );
    }
    return null;
  }

  getUSButtons = (usReportButtonText, usReportTemplate) => {
    const hrefUrl = this.state[usReportTemplate];

    if (usReportButtonText) {
      return (
        <NavLink
          to={hrefUrl}
          onClick={this.handleClick('US Report')}
          className={'report-btn us-report'}
        >
          <Button secondary >{usReportButtonText}</Button>
        </NavLink>
      );
    }
    return null;
  }
  render() {
    const {
      qModelRichText,
      usReportButtonText,
      canadianReportButtonText,
      graphImage, tableImage,
      canadianReportTemplate,
      usReportTemplate
    } = this.props;

    return (
      <div className="q-model-content-component">
        <div className={'details'} >
          <RichText richText={qModelRichText} />
        </div>
        {
          (canadianReportButtonText || usReportButtonText) ?
            <div className="button-pair">
              {this.getCanadianButtons(canadianReportButtonText, canadianReportTemplate)}
              {this.getUSButtons(usReportButtonText, usReportTemplate)}
            </div>
            : null
        }
        <div className="images">
          {
            graphImage ?
              <Image className={'q-model-graph'} src={graphImage} />
              : null
          }
          {
            tableImage ?
              <Image className={'q-model-stats'} src={tableImage} />
              : null
          }
        </div>
      </div>
    );
  }
}

export default QModelContentComponent;
