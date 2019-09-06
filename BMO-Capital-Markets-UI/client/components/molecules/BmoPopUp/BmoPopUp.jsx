/* @flow weak */
/*
 * Component: BmoPopUp
 */
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';
import { connect } from 'react-redux';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  popupSelector,
} from 'store/selectors';
import './BmoPopUp.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class BmoPopUp extends Component {
  props: {
    children: any,
    showOnClick: bool,
    showOnClickOrHover: bool,
    forceHide: bool,
    clickFunction: () => void,
    minHeight: number,
    minWidth: number,
    alsoOnMobile: bool,
    debug: bool,
    actTopBuff: number,
    actLeftBuff: number,
    actTopBuffMobile: number,
    actLeftBuffMobile: number,
    mobileSz: number,
    leftBuff: number,
    hideController: '',
    hideOnScroll: bool,
    topBuff: 0,
    rightBuff: 0,
    direction: '',
    onMount: () => void,
    onUnMount: () => void,
    title: '',
    strictDirection: '',
    backgroundColor: '',
    className: '',
    showInToggleMode: bool,
    classSelector: any,
    keyID: number,
    // pointerTriangle: any
  };
  static defaultProps = {
    actTopBuff: 0,
    actLeftBuff: 0,
    actTopBuffMobile: 0,
    actLeftBuffMobile: 0
  };
  state = {
    idx: this.props.keyID || Math.random(),
    show: false,
    pointerTriangle: {},
    topBuff: this.props.topBuff || 0,
    leftBuff: this.props.leftBuff || 0,
    readyToShow: false
  };
  componentDidMount() {
    const holder = document.getElementById(this.state.idx);
    holder.addEventListener('mouseover', (e) => { e.stopPropagation(); });
    if (this.props.showOnClickOrHover) {
      holder.parentElement.addEventListener('click', this.handleShow);
      holder.parentElement.addEventListener('mouseover', this.handleShow);
    } else if (this.props.showOnClick) {
      holder.parentElement.addEventListener('click', this.handleShow);
      document.removeEventListener('mouseover', this.handleHide);
    } else {
      holder.parentElement.addEventListener('mouseover', this.handleShow);
    }
    if (this.props.debug) {
      holder.parentElement.style.border = 'solid';
    }
    document.addEventListener('touchstart', this.handleHide);
    if (this.props.hideController === 'click') {
      document.addEventListener('click', this.handleHide);
    } else {
      document.addEventListener('mouseover', this.handleHide);
    }
    if (this.props.hideOnScroll) {
      document.addEventListener('scroll', this.hidePopUp);
    }
    if (this.props.showInToggleMode) {
      document.addEventListener('keydown', this.closeModal);
    }
  }

  closeModal = (e) => {
    if (e.keyCode === 27) {
      this.hidePopUp();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleHide);
    document.removeEventListener('click', this.handleHide);
    document.removeEventListener('mouseover', this.handleHide);
    document.removeEventListener('scroll', this.hidePopUp);
    document.removeEventListener('keydown', this.closeModal);
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.forceHide !== nextProps.forceHide) {
      this.setState({ forceHide: nextProps.forceHide });
    }
  }
  afterShow = () => {
    const holder = document.getElementById(this.state.idx);
    const rightBuff = this.props.rightBuff || 0;
    const { direction, strictDirection } = this.props;
    if (holder) {
      const boundBox = holder;
      const gBoundBox = holder.parentElement.getBoundingClientRect();
      const popHeight = boundBox.getBoundingClientRect().height || this.props.minHeight;
      const popWidth = boundBox.getBoundingClientRect().width || this.props.minWidth;
      const { bottom, top, width, height } = gBoundBox;
      let { left, right } = gBoundBox;
      const windowInnerHeight = window.innerHeight;
      let windowInnerWidth = window.innerWidth;
      windowInnerWidth = Math.min(1440, windowInnerWidth);
      const extraSpace = (window.innerWidth - windowInnerWidth) / 2;
      left += extraSpace;
      right -= extraSpace;
      let pointerTriangle = { left: -7, top: (popHeight / 2) - 7, transform: 'rotate(135deg)' };
      if (strictDirection === 'left') {
        pointerTriangle = { left: 'calc(100% - 7px)', top: `${(popHeight / 2) + 2}px`, transform: 'rotate(-45deg)' };
        holder.style.left = `-${popWidth + 15}px`;
        holder.style.top = `-${popHeight / 2}px`;
      } else if (strictDirection === 'right-parallel') {
        pointerTriangle = { left: '-7px', top: '40px', transform: 'rotate(135deg)' };
        holder.style.left = 'calc(100% + 10px)';
        holder.style.top = '-20px';
      } else if (strictDirection === 'right-mid') {
        pointerTriangle = { left: '-7px', top: `${(popHeight / 2) - 7}px`, transform: 'rotate(135deg)' };
        holder.style.left = 'calc(100% + 5px)';
        holder.style.top = `${(height / 2) - (popHeight / 2)}px`;
      } else if (direction === 'horizontal-mid' && (bottom + (popHeight / 2)) < windowInnerHeight && (top - (popHeight / 2)) > 70) {
        holder.style.top = `-${(popHeight / 2) - (height / 2)}px`;
        if (((left - popWidth) < 5 && (right + popWidth) < (windowInnerWidth - 5))
          || ((left - popWidth) > 5 && (right + popWidth) < (windowInnerWidth - 5))) {
          pointerTriangle = { left: '-5px', top: `${(popHeight / 2) - 7}px`, transform: 'rotate(135deg)' };
          holder.style.left = 'calc(100% + 10px)';
        } else if ((left - popWidth) > 5 && (right + popWidth) > (windowInnerWidth - 5)) {
          pointerTriangle = { left: 'calc(100% - 7px)', top: `${(popHeight / 2) - (height / 2)}px`, transform: 'rotate(-45deg)' };
          holder.style.left = `-${popWidth}px`;
        }
      } else if ((top - popHeight) > 7) {
        holder.style.top = `-${popHeight}px`;
        const extendedPortion = (popWidth / 2) - (width / 2);
        if ((left - extendedPortion) > 5 && (right + extendedPortion) < (windowInnerWidth - 5)) {
          pointerTriangle = { left: (popWidth / 2) - 7, top: 'calc(100% - 7px)', transform: 'rotate(45deg)' };
          holder.style.left = `-${(popWidth / 2) - (width / 2)}px`;
        } else if ((left - extendedPortion) < 5 && (right + extendedPortion) < (windowInnerWidth - 5)) {
          pointerTriangle = { left: left + (width / 2), top: 'calc(100% - 7px)', transform: 'rotate(45deg)' };
          holder.style.left = `-${left - 5}px`;
        } else if ((left - extendedPortion) > 5 && (right + extendedPortion) > (windowInnerWidth - rightBuff - 5)) {
          pointerTriangle = { left: `calc(100% - ${((windowInnerWidth - right - rightBuff) + (width / 2))}px)`, top: 'calc(100% - 7px)', transform: 'rotate(45deg)' };
          holder.style.left = `calc(100% - ${(popWidth - (windowInnerWidth - right)) + rightBuff + 5}px)`;
        } else {
          holder.style.left = `-${left - 5}px)`;
        }
      } else if ((bottom + popHeight + 5) < windowInnerHeight) {
        holder.style.top = 'calc(100% - 2px)';
        this.setState({ topBuff: 25 });
        const extendedPortion = (popWidth / 2) - (width / 2);
        if ((left - extendedPortion) > 5 && (right + extendedPortion) < (windowInnerWidth - 5)) {
          pointerTriangle = { left: (popWidth / 2) - 7, top: '-5px', transform: 'rotate(225deg)' };
          holder.style.left = `-${(popWidth / 2) - (width / 2)}px`;
        } else if ((left - extendedPortion) < 5 && (right + extendedPortion) < (windowInnerWidth - 5)) {
          pointerTriangle = { left: left + (width / 2), top: '-5px', transform: 'rotate(225deg)' };
          holder.style.left = `-${left - 5}px`;
        } else if ((left - extendedPortion) > 5 && (right + extendedPortion) > (windowInnerWidth - rightBuff - 5)) {
          pointerTriangle = { left: `calc(100% - ${((windowInnerWidth - right - rightBuff) + (width / 2))}px)`, top: '-5px', transform: 'rotate(225deg)' };
          holder.style.left = `calc(100% - ${(popWidth - (windowInnerWidth - right)) + rightBuff + 5}px)`;
        } else {
          holder.style.left = `-${left - 5}px)`;
        }
      } else if ((bottom + popHeight + 10) > windowInnerHeight && (top - popHeight) < 70) {
        holder.style.top = `-${(popHeight / 2) - (height / 2)}px`;
        if (((left - popWidth) < 5 && (right + popWidth) < (windowInnerWidth - 5))
          || ((left - popWidth) > 5 && (right + popWidth) < (windowInnerWidth - 5))) {
          pointerTriangle = { left: '-5px', top: `${popHeight / 2}px`, transform: 'rotate(135deg)' };
          holder.style.left = 'calc(100% - 5px)';
        } else if ((left - popWidth) > 5 && (right + popWidth) > (windowInnerWidth - 5)) {
          pointerTriangle = { left: 'calc(100% - 7px)', top: `${popHeight / 2}px`, transform: 'rotate(-45deg)' };
          holder.style.left = `-${popWidth}px`;
        }
      }
      pointerTriangle.backgroundColor = (this.props.backgroundColor || '#fff');
      // if (typeof pointerTriangleProps === 'function') {
      //   pointerTriangle = {
      //     ...pointerTriangle,
      //     ...typeof pointerTriangleProps === 'function' && pointerTriangleProps && pointerTriangleProps(this.state.idx)
      //   };
      // }
      // this.setState({
      //   pointerTriangle
      // }, () => {
      //   console.log(pointerTriangle); // eslint-disable-line
      // });
      this.setState({ pointerTriangle });
    }
  }
  handleShow = (e) => {
    if (this.props.showInToggleMode && e.target.className.indexOf(this.props.classSelector) > -1) {
      this.setState({ show: !this.state.show }, this.afterShow);
      if (!this.state.show) {
        this.props.onUnMount && this.props.onUnMount();
        return;
      }
    } else {
      this.setState({ show: true }, this.afterShow);
    }
    this.props.onMount && this.props.onMount();
    this.props.clickFunction && this.props.clickFunction();
  }
  hidePopUp = () => {
    this.setState({ show: false });
    this.props.onUnMount && this.props.onUnMount();
  }
  handleHide = (e) => {
    const holder = document.getElementById(this.state.idx);
    if (holder && !this.props.debug) {
      const { left, top, height, width } = holder.getBoundingClientRect();
      const parentBBox = holder.parentElement.getBoundingClientRect();
      const pLeft = parentBBox.left;
      const pTop = parentBBox.top;
      const pHeight = parentBBox.height;
      const pWidth = parentBBox.width;
      const actLeftBuff = window.document.innerWidth <= this.props.mobileSz ? this.props.actLeftBuffMobile : this.props.actLeftBuff;
      const actTopBuff = window.document.innerWidth <= this.props.mobileSz ? this.props.actTopBuffMobile : this.props.actTopBuff;
      let clientX = e.clientX;
      let clientY = e.clientY;
      if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      if (!(((clientX > (left + actLeftBuff) && clientY > (top + actTopBuff) && clientX < (left + width + actLeftBuff) && clientY < (top + height + actTopBuff)))
        || (clientX > (pLeft - this.state.leftBuff) && clientY > (pTop - this.state.topBuff) && clientX < (pLeft + pWidth + this.state.leftBuff) && clientY < (pTop + pHeight + this.state.topBuff)))) {
        this.setState({ show: false });
        this.props.onUnMount && this.props.onUnMount();
      }
    }
  }
  render() {
    const { children, title } = this.props;
    const { forceHide, show } = this.state;
    return (
      <div title={title || ''} className={`bmo-pop-up ${this.props.alsoOnMobile && this.props.alsoOnMobile.toString()} ${this.props.className}`} id={this.state.idx}>
        {
          show && !forceHide ?
            <div className="triangle" id={`${this.state.idx}-tri`} style={this.state.pointerTriangle} />
            : null
        }
        {(show && !forceHide) ? children : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  idxInStore: popupSelector.getCurrentIdx(state)
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentIdx: (idx) => {
    const rand = Math.random();
    dispatch({ type: 'SET_POP_UP_IDX', rand });
    dispatch({ type: 'SET_POP_UP_IDX', idx });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BmoPopUp);
