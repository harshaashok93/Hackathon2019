/* @flow weak */

/*
 * Component: QModelArchives
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Label, Button } from 'unchained-ui-react';
import { connect } from 'react-redux';
import {
  GET_TEXT_FN
} from 'store/actions';

import {
  qmodelSelector
} from 'store/selectors';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './QModelArchives.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class QModelArchives extends Component {
  props: {
    MonthlyOverviewText: '',
    onSubmit: () => void
  };

  static defaultProps = {
    MonthlyOverviewText: '',
    onSubmit: () => {}
  };

  state = {
    subMenuExpand: false,
    subMenu: [{ name: 'sub1', val: '2016' }, { name: 'sub1', val: '2016' }],
    selectedSubMenuIndex: -1
  };

  componentDidMount() {
    // Component ready
  }
  expandSubMenu = () => {
    const subMenuExpand = !this.state.subMenuExpand;
    this.setState({ subMenuExpand });
  }
  subMenuClick = (e) => {
    const index = parseInt(e.currentTarget.dataset.idx, 10);
    this.setState({ selectedSubMenuIndex: index });
    this.props.onSubmit({ type: 'GET_TEXT', text: `Q Model Arch - ${index}` });
  }
  render() {
    const { subMenu, subMenuExpand } = this.state;
    const { MonthlyOverviewText } = this.props;
    return (
      <div className="q-model-monthly-overview q-model-accordion ui fluid accordion">
        <div className={`menu ${subMenuExpand.toString()}`} >
          <Label className={'menu-title filter-name'} as={Button} content={MonthlyOverviewText} onClick={this.expandSubMenu} />
          <span className="plus-minus">{(subMenuExpand ? '-' : '+')}</span>
          <ul className="sub-menu">
            {subMenu.map((x, i) => <li><span data-idx={i} className={(this.state.selectedSubMenuIndex === i) ? 'sub-menu-li active' : 'sub-menu-li'} onKeyPress={() => {}} role="button" tabIndex={0} onClick={this.subMenuClick}>{x.val}</span></li>)}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  clickOn: qmodelSelector.getText(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: data => {
    dispatch(GET_TEXT_FN(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QModelArchives);
