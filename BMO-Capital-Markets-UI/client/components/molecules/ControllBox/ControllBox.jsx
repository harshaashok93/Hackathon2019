/* @flow weak */

/*
 * Component: ControllBox
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ControllBox.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ControllBox extends Component {
  props: {
    closeControllBox: () => void,
    afterMount: () => void,
    children: {},
    attachPointIdx: number,
    stayInside: '',
    offsetX: '',
    fullCover: bool,
    popUpId: '',
    direction: '',
    topOffsetBuff: 0,
    leftOffSetBuff: 0,
    noHideBoxesIdx: [],
    triangleClass: '',
    outEvent: '',
    shadowNeed: '',
    calledFor: ''
  };

  static defaultProps = {
    topOffsetBuff: 0,
    leftOffSetBuff: 0
  };

  state = {
    top: 0,
    left: 0,
    isFirstMount: true,
  };
  isToBeClose = (e) => {
    const attachPoint = document.getElementById(this.props.attachPointIdx);
    const controllBox = document.getElementById(this.props.popUpId);
    if (attachPoint && controllBox) {
      const controllBoxBoundBox = controllBox.getBoundingClientRect();
      const attachPointBoundBox = attachPoint.getBoundingClientRect();
      if (!(
        (controllBoxBoundBox.left <= e.clientX && (controllBoxBoundBox.left + controllBoxBoundBox.width) >= e.clientX && controllBoxBoundBox.top <= e.clientY && (controllBoxBoundBox.top + controllBoxBoundBox.height) >= e.clientY) ||
        (attachPointBoundBox.left <= e.clientX && (attachPointBoundBox.left + attachPointBoundBox.width) >= e.clientX && attachPointBoundBox.top <= e.clientY && (attachPointBoundBox.top + attachPointBoundBox.height) >= e.clientY) ||
        this.isInsideNoHideBoxes(this.props.noHideBoxesIdx, e))) {
        this.props.closeControllBox();
      }
    }
  }
  isInsideNoHideBoxes = (data, e) => {
    if (!data) {
      return false;
    }
    let i = 0;
    let noHideBox = null;
    let noHideBoundBox = null;
    for (i = 0; i < data.length; i += 1) {
      noHideBox = document.getElementById(data[i]);
      if (noHideBox) {
        noHideBoundBox = noHideBox.getBoundingClientRect();
        if (noHideBoundBox.left <= e.clientX && (noHideBoundBox.left + noHideBoundBox.width) >= e.clientX && noHideBoundBox.top <= e.clientY && (noHideBoundBox.top + noHideBoundBox.height) >= e.clientY) {
          return true;
        }
      }
    }
    return false;
  }
  componentDidMount() {
    window.addEventListener(this.props.outEvent, this.isToBeClose);
    if (this.props.afterMount) {
      this.props.afterMount();
    }
  }
  componentWillUnmount() {
    window.removeEventListener(this.props.outEvent, this.isToBeClose);
  }
  render() {
    const {
      children,
      attachPointIdx,
      stayInside,
      offsetX,
      fullCover,
      popUpId,
      direction,
      topOffsetBuff,
      leftOffSetBuff,
      triangleClass,
      shadowNeed,
      calledFor
    } = this.props;
    const attachPoint = document.getElementById(attachPointIdx);
    const stayInsideBox = document.getElementById(stayInside);
    let attachPointBoundBox = null;
    let stayInsideBoundBox = null;
    if (attachPoint && stayInsideBox) {
      attachPointBoundBox = attachPoint.getBoundingClientRect();
      stayInsideBoundBox = stayInsideBox.getBoundingClientRect();
      const positionObject = {
        marginLeft: offsetX,
        left: (fullCover ? stayInsideBox.left : (attachPoint.offsetLeft + leftOffSetBuff)),
        top: (direction === 'top' ? (attachPoint.offsetTop - topOffsetBuff) : (attachPoint.offsetTop + 35 + attachPointBoundBox.height)),
        width: (fullCover ? stayInsideBoundBox.width : 'auto')
      };
      const positionObjectBottomBalance = {
        marginLeft: offsetX,
        left: (fullCover ? stayInsideBox.left : (attachPoint.offsetLeft + leftOffSetBuff)),
        bottom: (direction === 'top' ? (380 - attachPoint.offsetTop) : (attachPoint.offsetTop + attachPointBoundBox.height)),
        width: (fullCover ? stayInsideBoundBox.width : 'auto')
      };
      const trianglePositionObject = {
        left: attachPoint.offsetLeft + ((attachPointBoundBox.width / 2)) + leftOffSetBuff,
        top: (direction === 'top' ? (attachPoint.offsetTop - (topOffsetBuff + 12)) : {})
      };
      const trianglePositionObjectBottomBalance = {
        left: attachPoint.offsetLeft + ((attachPointBoundBox.width / 2) - 10),
        top: (direction === 'top' ? (attachPoint.offsetTop - (topOffsetBuff + 12)) : (attachPoint.offsetTop + topOffsetBuff + (attachPointBoundBox.height - 12)))
      };
      return (
        <div className="controll-box">
          <div className={(fullCover ? `pop-up ${direction} ${shadowNeed}` : `pop-up ${direction} triangle-need`)} id={popUpId} style={calledFor === 'scale' ? positionObjectBottomBalance : positionObject}>
            {
              fullCover ?
                <span className={`controll-box-triangle ${direction} ${triangleClass}`} style={calledFor === 'scale' ? trianglePositionObjectBottomBalance : trianglePositionObject} />
                : null
            }
            {children}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default ControllBox;
