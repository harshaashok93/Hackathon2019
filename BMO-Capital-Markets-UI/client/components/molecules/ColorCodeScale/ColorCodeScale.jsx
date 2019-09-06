/* @flow weak */

/*
 * Component: ColorCodeScale
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './ColorCodeScale.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class ColorCodeScale extends Component {
  props: {
    pos: number,
    idx: number,
    color: number,
    shape: string,
    width: number,
    height: number
  };

  static defaultProps = {
  };

  state = {
    // Initialize state here
  };

  componentDidMount() {
    const { pos, idx, color, width } = this.props;
    const c = document.getElementById(idx);
    const ctx = c.getContext('2d');
    // Create gradient
    const grd = ctx.createLinearGradient(0, 0, width, 0);
    grd.addColorStop(0, '#f85252');
    grd.addColorStop(0.2, '#cd0303');
    grd.addColorStop(0.4, '#940404');
    grd.addColorStop(0.6, '#007b79');
    grd.addColorStop(0.8, '#2ab4ac');
    grd.addColorStop(1, '#22d4be');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 7, width, 12);
    const positionByColor = this.getPosition(idx, color);
    const plotPoint = (pos || positionByColor);
    const pixel1 = ctx.getImageData(plotPoint, 10, 1, 1).data;
    if (this.props.shape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(plotPoint, 2);
      ctx.lineTo((plotPoint + 6), 22);
      ctx.lineTo((plotPoint - 6), 22);
      ctx.closePath();
      ctx.lineWidth = 7;
      ctx.strokeStyle = `rgb(${pixel1[0]}, ${pixel1[1]}, ${pixel1[2]}, ${pixel1[3]})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(plotPoint, -2);
      ctx.lineTo((plotPoint + 14), 25);
      ctx.lineTo((plotPoint - 14), 25);
      ctx.closePath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    } else if (this.props.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(plotPoint, 14, 12, 0, 2 * Math.PI);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(plotPoint, 14, 6, 0, 2 * Math.PI);
      ctx.lineWidth = 10;
      ctx.strokeStyle = `rgb(${pixel1[0]}, ${pixel1[1]}, ${pixel1[2]}, ${pixel1[3]})`;
      ctx.stroke();
    }
  }
  getPosition = (idx, color) => {
    const c = document.getElementById(idx);
    const ctx = c.getContext('2d');
    let pixels;
    let minVal = 99999999;
    let tmp = 0;
    let position = 0;
    let R = 0;
    let G = 0;
    let B = 0;
    for (let i = 0; i < 240; i += 1) {
      pixels = ctx.getImageData(i, 10, 1, 1).data;
      R = (pixels[0] - color[0]) * (pixels[0] - color[0]);
      G = (pixels[1] - color[1]) * (pixels[1] - color[1]);
      B = (pixels[2] - color[2]) * (pixels[2] - color[2]);
      tmp = Math.sqrt(R + G + B);
      if (tmp <= minVal) {
        position = i;
        minVal = tmp;
      }
    }
    return position;
  }
  render() {
    const { idx, width, height } = this.props;
    return (
      <div className="color-code-scale">
        <canvas height={height} width={width} id={idx} />
      </div>
    );
  }
}

export default ColorCodeScale;
