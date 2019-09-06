/* @flow weak */

/*
 * Component: GicTree
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { Button, Modal } from 'unchained-ui-react';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './GicTree.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class GicTree extends Component {
  props: {
    closeGicTree: () => void,
    tree: []
  };

  static defaultProps = {
  };

  state = {
    selectedPath: '',
    currentDepth: 0,
    positionObject: { left: -240 },
  };

  componentWillMount() {
    const val = this.props.tree[0].children && this.props.tree[0].children.length ? 0 : -1;
    this.setState({ selectedPath: [(window.innerWidth > 500 ? val : -1)] });
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
    document.body.classList.remove('noscroll-thank');
  }

  changeSelection = (depth, idx) => () => {
    this.slideTree(depth, idx);
  }
  slideTree = (depth, idx) => {
    const { selectedPath } = this.state;

    if (selectedPath.length > depth) {
      selectedPath[depth] = idx;
    } else {
      selectedPath.push(idx);
    }
    for (let i = (depth + 1); i < selectedPath.length; i += 1) {
      selectedPath[i] = -1;
    }
    const windowInnerWidth = window.innerWidth;
    if (windowInnerWidth <= 768) {
      const { positionObject } = this.state;
      positionObject.left = (-1 * (depth * 280)) - (depth === 0 ? 240 : 200);
      this.setState({ positionObject });
      if (document.getElementsByClassName('gic-tree')) {
        document.getElementsByClassName('gic-tree')[0].scroll(0, 0);
      }
    }
    if (windowInnerWidth <= 500) {
      const { positionObject } = this.state;
      positionObject.left = (-1 * ((depth + 1) * 280)) - 240;
      this.setState({ positionObject });
    }
    this.setState({ selectedPath, currentDepth: (depth + 1) });
  }
  selectSector = (node) => () => {
    document.body.style.overflow = '';
    this.props.closeGicTree(node);
  }

  closeTree = () => {
    this.props.closeGicTree(null);
    document.body.style.overflow = '';
  }
  backDepth = () => {
    const depthToBack = this.state.currentDepth - 2;
    this.slideTree(depthToBack, this.state.selectedPath[depthToBack], true);
  }
  generateTree = (branch, branchName, depth, parentId, parentObj) => {
    let i;
    const treeHtml = [];
    if (branch.children) {
      treeHtml.push(<li className="clickable"><span onClick={this.selectSector(branch, parentId)} tabIndex={0} onKeyPress={() => {}} role="button">All {branchName}</span></li>);
    }
    for (i = 0; i < branch.length; i += 1) {
      if (i === 0 && parentObj) {
        treeHtml.push(
          <li className="clickable">
            <div className="count-and-text" onClick={this.selectSector(parentObj, parentObj.id)} tabIndex={0} onKeyPress={() => {}} role="button">
              <span className="text">{`All ${parentObj.name}`}</span>
            </div>
          </li>
        );
      }
      if (branch[i].children && this.state.selectedPath[depth] === i) {
        treeHtml.push(
          <li className="active">
            <div className="count-and-text">
              <span className="text">{branch[i].name}</span>
            </div>
            <span aria-hidden="true" className="active has-sub-tree" />
          </li>
        );
        const subTree = this.generateTree(branch[i].children, (depth === 0 ? branch[i].name : branchName), (depth + 1), branch[i].id, branch[i]);
        treeHtml.push(subTree);
      } else if (branch[i].children && branch[i].children.length) {
        treeHtml.push(
          <li>
            <div className="count-and-text">
              <span className="text">{branch[i].name}</span>
            </div>
            <Button aria-hidden="true" className="has-sub-tree" onClick={this.changeSelection(depth, i)} />
          </li>
        );
      } else {
        treeHtml.push(<li className="clickable"><span onClick={this.selectSector(branch[i])} tabIndex={0} onKeyPress={() => {}} role="button">{branch[i].name}</span></li>);
      }
    }
    return (
      <li className="tree-column-holder">
        <div className="gic-tree-column">
          <div className="col-title">
            { depth === 1 && branchName ? `${branchName} groups` : null }
            { depth === 2 && branchName ? `${branchName}` : null }
            { depth === 3 && branchName ? `sub-${branchName}` : null }
          </div>
          <ul>
            {treeHtml}
          </ul>
        </div>
      </li>
    );
  }
  render() {
    const { currentDepth } = this.state;
    const { tree } = this.props;

    return (
      <Modal
        open={true}
        className="gics-tree-modal"
        closeOnDocumentClick={false}
        closeOnDimmerClick={false}
        onClose={this.closeTree}
        size={'fullscreen'}
      >
        <div className="gic-tree">
          <div className="head-row">
            {
              (currentDepth < 1 && window.innerWidth <= 500) ||
              (currentDepth <= 1 && window.innerWidth > 500) ||
              window.innerWidth > 768 ?
                'Sectors'
                :
                <Button className="back-depth" onClick={this.backDepth}>
                  <span className="bmo_chevron left" /> Back
                </Button>
            }
            <Button className="mega-menu-close-icon bmo-close-btn" onClick={this.closeTree} />
          </div>
          <div className="gic-tree-holder">
            {this.generateTree(tree, '', 0, tree[0])}
          </div>
        </div>
      </Modal>
    );
  }
}

export default GicTree;
